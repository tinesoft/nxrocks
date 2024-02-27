import { createProjectGraphAsync, logger, ProjectGraph, readCachedProjectGraph, Tree } from '@nx/devkit';
import { execSync } from 'child_process';
import { fileExists } from '@nx/workspace/src/utilities/fileutils';

import { BuilderCommandAliasType, BuilderCore } from '../builders';
import {
  getCurrentAndParentFolder,
  getProjectFileContent,
  getProjectFilePath,
  getProjectRoot,
  hasProjectFile,
  PackageInfo,
} from '@nxrocks/common';
import {
  readXml,
  findXmlNodes,
  findNodeContent,
} from '../utils';
import { getCoordinatesForMavenProjet, getMavenModules, hasMavenModule } from './maven-utils';
import { getCoordinatesForGradleProjet, getGradleModules, hasGradleModule } from './gradle-utils';
import { dirname, relative } from 'path';

export const LARGE_BUFFER = 1024 * 1000000;

export const JVM_PROJECT_FILES = ['pom.xml', 'build.gradle', 'build.gradle.kts', 'settings.gradle', 'settings.gradle.kts']

export function runBuilderCommand(
  commandAlias: BuilderCommandAliasType,
  getBuilder: (cwd: string) => BuilderCore,
  params: string[],
  options: {
    cwd: string;
    ignoreWrapper?: boolean;
    useLegacyWrapper?: boolean;
    runFromParentModule?: boolean;
  } = { cwd: process.cwd(), ignoreWrapper: false, useLegacyWrapper: false, runFromParentModule: false }
): { success: boolean } {
  // Take the parameters or set defaults
  const buildSystem = getBuilder(options.cwd);
  const executable = buildSystem.getExecutable(
    options.ignoreWrapper ?? false,
    options.useLegacyWrapper ?? false
  );
  const { cwd, command } = buildSystem.getCommand(commandAlias, options);
  // Create the command to execute
  const execute = `${executable} ${command} ${(params || []).join(' ')}`;
  try {
    logger.info(`Executing command: ${execute}`);
    execSync(execute, { cwd, stdio: [0, 1, 2], maxBuffer: LARGE_BUFFER });
    return { success: true };
  } catch (e) {
    logger.error(`Failed to execute command: ${execute}`);
    logger.error(e);
    return { success: false };
  }
}

export function isMavenProject(project: { root: string }) {
  return fileExists(getProjectFilePath(project, 'pom.xml'));
}

export function isMavenProjectInTree(tree: Tree, rootFolder: string) {
  return tree.exists(`./${rootFolder}/pom.xml`);
}

export function hasMavenProject(cwd: string) {
  return fileExists(`${cwd}/pom.xml`);
}

export function isGradleProject(project: { root: string }) {
  return fileExists(getProjectFilePath(project, 'build.gradle')) || fileExists(getProjectFilePath(project, 'settings.gradle')) ||
    fileExists(getProjectFilePath(project, 'build.gradle.kts')) || fileExists(getProjectFilePath(project, 'settings.gradle.kts'));
}

export function isGradleProjectInTree(tree: Tree, rootFolder: string) {
  return tree.exists(`./${rootFolder}/build.gradle`) || tree.exists(`./${rootFolder}/settings.gradle`) ||
    tree.exists(`./${rootFolder}/build.gradle.kts`) || tree.exists(`./${rootFolder}/settings.gradle.kts`);
}

export function isGradleProjectSettingsInTree(tree: Tree, rootFolder: string) {
  return tree.exists(`./${rootFolder}/settings.gradle`) || tree.exists(`./${rootFolder}/settings.gradle.kts`);
}

export function hasGradleProject(cwd: string) {
  return (fileExists(`${cwd}/build.gradle`) || fileExists(`${cwd}/settings.gradle`)) ||
    fileExists(`${cwd}/build.gradle.kts`) || fileExists(`${cwd}/settings.gradle.kts`);
}

export function hasGradleSettingsFile(cwd: string) {
  return fileExists(`${cwd}/settings.gradle`) || fileExists(`${cwd}/settings.gradle.kts`);
}

export function hasGradleBuildFile(cwd: string) {
  return fileExists(`${cwd}/build.gradle`) || fileExists(`${cwd}/build.gradle.kts`);
}

export function getGradleBuildFilesExtension(project: { root: string }): '.gradle.kts' | '.gradle' | undefined {
  if (fileExists(getProjectFilePath(project, 'build.gradle.kts')) || fileExists(getProjectFilePath(project, 'settings.gradle.kts'))) {
    return '.gradle.kts';
  }

  return fileExists(getProjectFilePath(project, 'build.gradle')) || fileExists(getProjectFilePath(project, 'settings.gradle'))
    ? '.gradle'
    : undefined;
}

export function getGradleBuildFilesExtensionInTree(tree: Tree, rootFolder: string): '.gradle.kts' | '.gradle' | undefined {
  if (tree.exists(`./${rootFolder}/build.gradle.kts`) || tree.exists(`./${rootFolder}/settings.gradle.kts`)) {
    return '.gradle.kts';
  }

  return (tree.exists(`./${rootFolder}/build.gradle`) || tree.exists(`./${rootFolder}/settings.gradle`))
    ? '.gradle'
    : undefined;
}

export const getGradleDependencyIdRegEx = () =>
  /\s*(api|implementation|testImplementation)\s*(\(?project)?\s*\(?['"](?<id>[^"']+)['"]\)?\)?/g;

export function getJvmPackageInfo(project: { root: string }): PackageInfo {
  if (isMavenProject(project)) {
    // maven project
    const pomXmlStr = getProjectFileContent(project, 'pom.xml');
    const pomXmlNode = readXml(pomXmlStr);

    const { groupId, artifactId } = getCoordinatesForMavenProjet(project.root);


    const dependencies: PackageInfo[] = [];
    const dependencyNodes = findXmlNodes(
      pomXmlNode,
      `/project/dependencies/dependency`
    );

    if (Array.isArray(dependencyNodes)) {
      dependencyNodes?.forEach((node) => {
        const depGroupId = findNodeContent(node, `/dependency/groupId/text()`);
        const depArtifactId = findNodeContent(
          node,
          `/dependency/artifactId/text()`
        );
        dependencies.push({
          packageId: `${depGroupId}:${depArtifactId}`,
          packageFile: 'pom.xml',
        });
      });
    }

    const modules = getMavenModules(project.root);
    return {
      packageId: `${groupId}:${artifactId}`,
      packageFile: 'pom.xml',
      dependencies,
      modules: modules.map(mod => `${groupId}:${mod}`)
    };
  }

  if (isGradleProject(project)) {
    // gradle project
    const ext = getGradleBuildFilesExtension(project);
    const { groupId, artifactId } = getCoordinatesForGradleProjet(project.root);

    const gradleDependencyIdRegEx = getGradleDependencyIdRegEx();
    const dependencyIds: string[] = [];

    if (hasGradleBuildFile(project.root)) {
      const buildGradle = getProjectFileContent(project, `build${ext}`);

      let match: RegExpExecArray | null;
      do {
        match = gradleDependencyIdRegEx.exec(buildGradle);
        const id = match?.groups?.['id']
        if (id) {// project dependencies start with ':', we prepend the groupId to it
          dependencyIds.push(id.startsWith(':') ? `${groupId}${id}` : id);
        }
      } while (match);
    }

    const dependencies: PackageInfo[] = dependencyIds.map((depId) => {
      return { packageId: depId, packageFile: `build${ext}` };
    });

    const modules = getGradleModules(project.root);

    const offsetFromRoot = getPathFromParentModule(project.root);
    const pkgId = offsetFromRoot ? offsetFromRoot.replaceAll('/', ':') : artifactId;

    return {
      packageId: `${groupId}:${pkgId}`,
      packageFile: hasGradleSettingsFile(project.root) ? `settings${ext}` : `build${ext}`,
      dependencies,
      modules: modules.map(mod => `${groupId}:${mod}`)
    };
  }

  throw new Error(
    `Cannot inspect dependencies of project at: '${getProjectRoot(
      project
    )}'.\n` + `No 'pom.xml' nor 'build.gradle[.kts]' was found.`
  );
}

export function checkProjectBuildFileContains(
  project: { root: string },
  opts: { fragments: string[]; logicalOp?: 'and' | 'or' },
  searchInParentModule = true
): boolean {

  let found = false;
  if (isMavenProject(project) && hasProjectFile(project, 'pom.xml')) {
    const content = getProjectFileContent(project, 'pom.xml');
    found = checkProjectFileContains(content, opts);
    if (!found && searchInParentModule) {//not found in the project, check at parent module level
      const parentRoot = getPathToParentModule(project.root);

      if (hasProjectFile({ root: parentRoot }, 'pom.xml')) {
        const parentModuleContent = getProjectFileContent({ root: parentRoot }, 'pom.xml');
        return checkProjectFileContains(parentModuleContent, opts);
      }
    }
  }

  const ext = getGradleBuildFilesExtension(project);

  if (isGradleProject(project) && ext && hasProjectFile(project, `build${ext}`)) {
    const content = getProjectFileContent(project, `build${ext}`);
    found = checkProjectFileContains(content, opts);
    if (!found && searchInParentModule) {//not found in the project, check at parent module level
      const parentRoot = getPathToParentModule(project.root);
      if (hasProjectFile({root: parentRoot}, `build${ext}`)) {
        const parentModuleContent = getProjectFileContent({ root: parentRoot }, `build${ext}`);
        return checkProjectFileContains(parentModuleContent, opts);
      }
    }
  }

  return found;
}

export function checkProjectFileContains(
  content: string,
  opts: { fragments: (string | RegExp)[]; logicalOp?: 'and' | 'or' }): boolean {
  const { fragments, logicalOp = fragments?.length === 1 ? 'and' : 'or' } = opts;
  const findOccurencesInContent = (content: string): boolean => {
    return (fragments || []).reduce<boolean>((acc, curr) => {
      return logicalOp === 'and'
        ? acc && match(content, curr)
        : acc || match(content, curr);
    }, logicalOp === 'and');
  };

  return findOccurencesInContent(content);
}

export function getPathFromParentModule(cwd: string): string {

  let pathFromParent: string[] = [];
  let root: string, name: string;
  let currentFolder = cwd;
  do {
    const obj = getCurrentAndParentFolder(currentFolder);

    root = obj.parentFolder;
    name = obj.currentFolder;
    currentFolder = root;

    if (root !== '.') {
      pathFromParent = [name, ...pathFromParent];
    }

  } while (
    !(hasGradleBuildFile(root) && hasGradleModule(root, name)) &&
    !(hasMavenProject(root) && hasMavenModule(root, name)) &&
    root !== '.');

  return pathFromParent.slice(1).join('/');
}

export function getPathToParentModule(cwd: string): string {

  let root: string, name: string;
  let currentFolder = cwd;
  do {
    const obj = getCurrentAndParentFolder(currentFolder);

    root = obj.parentFolder;
    name = obj.currentFolder;

    currentFolder = root;
  } while (
    !(hasGradleBuildFile(root) && hasGradleModule(root, name)) &&
    !(hasMavenProject(root) && hasMavenModule(root, name)) &&
    root !== '.');

  return root;
}

export async function getAdjustedProjectAndModuleRoot(options: {
  projectRoot: string;
  addToExistingParentModule?: boolean;
  parentModuleName?: string;
}, isMavenProject: boolean
) {

  const projectGraph: ProjectGraph = process.env['NX_INTERACTIVE'] === 'true' ? readCachedProjectGraph() : await createProjectGraphAsync();

  if (options.addToExistingParentModule && options.parentModuleName && !projectGraph.nodes[options.parentModuleName]) {
    throw new Error(`No parent module project named '${options.parentModuleName}' was found in this workspace! Make sure the project exists.`);
  }
  const indexOfPathSlash = isMavenProject ? options.projectRoot.lastIndexOf('/') : options.projectRoot.indexOf('/');
  let projectRoot = options.projectRoot;
  let moduleRoot;
  if (options.addToExistingParentModule && options.parentModuleName) {
    moduleRoot = projectGraph.nodes[options.parentModuleName].data.root;
  }
  else {
    const rootFolder = options.projectRoot.substring(0, indexOfPathSlash);
    moduleRoot = `${rootFolder}/${options.parentModuleName}`;
  }
  projectRoot = `${moduleRoot}/${options.projectRoot.substring(indexOfPathSlash + 1)}`;

  const offsetFromRoot = dirname(relative(moduleRoot, projectRoot));

  return {
    projectRoot,
    moduleRoot,
    offsetFromRoot
  };
}

function match(content: string, value: string | RegExp) {
  if (typeof value === 'string') {
    return content.includes(value);
  }
  else {
    return value.test(content)
  }
}
