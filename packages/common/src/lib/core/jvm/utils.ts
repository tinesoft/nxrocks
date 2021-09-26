import { logger, ProjectConfiguration } from '@nrwl/devkit';
import { execSync } from 'child_process';
import { fileExists } from '@nrwl/workspace/src/utils/fileutils';
import { XmlDocument } from 'xmldoc';

import {
  BuilderCommandAliasType,
  BuilderCore,
} from './builder-core.interface';
import { getProjectFileContent, getProjectFilePath, getProjectRoot, PackageInfo } from '../workspace';


export function runBuilderCommand(
  commandAlias: BuilderCommandAliasType,
  getBuilder : (cwd: string) => BuilderCore,
  params: string[],
  options: { cwd?: string; ignoreWrapper?: boolean } = { ignoreWrapper: false }
): { success: boolean } {
  // Take the parameters or set defaults
  const cwd = options.cwd || process.cwd();
  const buildSystem = getBuilder(cwd);
  const executable = buildSystem.getExecutable(options.ignoreWrapper);
  const command = buildSystem.getCommand(commandAlias);
  // Create the command to execute
  const execute = `${executable} ${command} ${(params || []).join(' ')}`;
  try {
    logger.info(`Executing command: ${execute}`);
    execSync(execute, { cwd, stdio: [0, 1, 2] });
    return { success: true };
  } catch (e) {
    logger.error(`Failed to execute command: ${execute}`);
    logger.error(e);
    return { success: false };
  }
}


export function isMavenProject(project: ProjectConfiguration) {
  return fileExists(getProjectFilePath(project, 'pom.xml'));
}

export function hasMavenProject(cwd: string) {
  return fileExists(`${cwd}/pom.xml`);
}

export function isGradleProject(project: ProjectConfiguration) {
  return (
    fileExists(getProjectFilePath(project, 'build.gradle')) ||
    fileExists(getProjectFilePath(project, 'build.gradle.kts'))
  );
}

export function hasGradleProject(cwd: string) {
  return fileExists(`${cwd}/build.gradle`) ||
    fileExists(`${cwd}/build.gradle.kts`)
}

export function getGradleBuildFilesExtension(project: ProjectConfiguration) {
  if (fileExists(getProjectFilePath(project, 'build.gradle.kts'))) {
    return '.gradle.kts';
  }

  return fileExists(getProjectFilePath(project, 'build.gradle')) ? '.gradle' : '';
}

export function getJvmPackageInfo(project: ProjectConfiguration): PackageInfo {
  if (isMavenProject(project)) {
    // maven project
    const pomXmlStr = getProjectFileContent(project, 'pom.xml');
    const pomXmlNode = new XmlDocument(pomXmlStr);

    const groupId = pomXmlNode.valueWithPath('groupId');
    const artifactId = pomXmlNode.valueWithPath('artifactId');

    const dependencies: PackageInfo[] = [];
    const dependencyNodes = pomXmlNode
      .childNamed('dependencies')
      ?.childrenNamed('dependency');

    for (const depNode of dependencyNodes) {
      const depGroupId = depNode.valueWithPath('groupId');
      const depArtifactId = depNode.valueWithPath('artifactId');
      dependencies.push({
        packageId: `${depGroupId}:${depArtifactId}`,
        packageFile: 'pom.xml',
      });
    }

    return {
      packageId: `${groupId}:${artifactId}`,
      packageFile: 'pom.xml',
      dependencies,
    };
  }

  if (isGradleProject(project)) {
    // gradle project
    const ext = getGradleBuildFilesExtension(project);
    const buildGradle = getProjectFileContent(project, `build${ext}`);
    const settingsGradle = getProjectFileContent(project, `settings${ext}`);

    const groupId = buildGradle.match(/group\s*=\s*['"]([^"']+)['"]/)?.[1];
    const artifactId = settingsGradle.match(
      /rootProject\.name\s*=\s*['"]([^"']+)['"]/
    )?.[1];

    const dependencies: PackageInfo[] = [];
    const dependencyIds =
      buildGradle.match(
        /\s*(api|implementation|testImplementation)\s*['"]([^"']+)['"]/
      ) || [];

    for (const depId of dependencyIds) {
      dependencies.push({
        packageId: depId,
        packageFile: `build.gradle${ext}`,
      });
    }

    return {
      packageId: `${groupId}:${artifactId}`,
      packageFile: `build.gradle${ext}`,
      dependencies,
    };
  }

  throw new Error(
    `Cannot inspect dependencies of project at: '${getProjectRoot(
      project
    )}'.\n` + `No 'pom.xml' nor 'build.gradle[.kts]' was found.`
  );
}

export function checkProjectBuildFileContains(project: ProjectConfiguration, opts: { fragments: string[], logicalOp?: 'and' | 'or' }): boolean {

  const { fragments, logicalOp =  fragments?.length == 1 ? 'and' : 'or'} = opts;
  const findOccurencesInContent = (content: string): boolean => {
    return (fragments || []).reduce((acc, cur) => {
      return (logicalOp == 'and') ? acc && content.includes(cur) : acc || content.includes(cur);
    }, logicalOp == 'and');
  }

  if (isMavenProject(project)) {
    const content = getProjectFileContent(project, 'pom.xml');
    return findOccurencesInContent(content);
  }

  if (isGradleProject(project)) {
    const ext = getGradleBuildFilesExtension(project);
    const content = getProjectFileContent(project, `build${ext}`);
    return findOccurencesInContent(content);
  }

  return false;
}