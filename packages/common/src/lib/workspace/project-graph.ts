import {
  CreateDependenciesContext,
  CreateNodes,
  CreateNodesContext,
  CreateNodesContextV2,
  createNodesFromFiles,
  CreateNodesResult,
  CreateNodesResultV2,
  CreateNodesV2,
  DependencyType,
  joinPathFragments,
  logger,
  ProjectConfiguration,
  ProjectType,
  RawProjectGraphDependency,
  TargetConfiguration,
  validateDependency,
} from '@nx/devkit';
import { minimatch } from 'minimatch';

import { PackageInfo, WorkspacePackageInfoConfiguration } from './models';
import { getProjectRootFromFile, isNxCrystalEnabled } from './utils';
import { dirname } from 'path';

function getPackageInfosForNxProjects(
  pluginName: string,
  projectFilter: (project: ProjectConfiguration) => boolean,
  getPackageInfo: (project: ProjectConfiguration) => PackageInfo,
  workspace: {
    projects: {
      [projectName: string]: ProjectConfiguration;
    };
  }
): WorkspacePackageInfoConfiguration {
  const workspacePackageInfo: WorkspacePackageInfoConfiguration = {
    projects: {},
    packages: {},
  };

  Object.entries(workspace.projects)
    .filter(([, project]) => projectFilter(project))
    .forEach(([projectName, project]) => {
      try {
        const pkgInfo = getPackageInfo(project);

        workspacePackageInfo.projects[project.root] = pkgInfo;
        workspacePackageInfo.packages[pkgInfo.packageId] = projectName;
      } catch (e) {
        if (process.env['NX_VERBOSE_LOGGING'] === 'true') {
          logger.warn(
            `[${pluginName}]: Failed to get package info for project '${projectName}'`
          );
          logger.warn(e);
        }
      }
    });

  return workspacePackageInfo;
}

function getDependenciesForProject(
  pluginName: string,
  filePath: string,
  sourceProjectName: string,
  workspace: WorkspacePackageInfoConfiguration
): RawProjectGraphDependency[] {
  if (process.env['NX_VERBOSE_LOGGING'] === 'true') {
    logger.debug(
      `[${pluginName}]: Getting dependencies for project '${sourceProjectName}'...`
    );
  }

  const dependencies: RawProjectGraphDependency[] = [];

  const sourceProjectRoot = getProjectRootFromFile(filePath);
  const sourcePkgInfo = workspace.projects[sourceProjectRoot];

  if (!sourcePkgInfo) return dependencies;

  sourcePkgInfo.dependencies?.forEach((depPkgInfo) => {
    const targetProjectName = workspace.packages[depPkgInfo.packageId];

    if (targetProjectName) {
      dependencies.push({
        source: sourceProjectName,
        target: targetProjectName,
        type: DependencyType.static,
        sourceFile: joinPathFragments(
          sourceProjectRoot,
          sourcePkgInfo.packageFile
        ),
      });
    }
  });

  sourcePkgInfo.modules?.forEach((moduleId) => {
    const depProject = workspace.projects[moduleId];

    if (depProject) {
      dependencies.push({
        source: sourceProjectName,
        target: workspace.packages[depProject.packageId],
        type: DependencyType.static,
        sourceFile: joinPathFragments(
          sourceProjectRoot,
          sourcePkgInfo.packageFile
        ),
      });
    }
  });

  return dependencies;
}

function getProjectFilesGlob(projectFiles: string[]): string {
  return projectFiles.length > 1
    ? `**/{${projectFiles.join(',')}}`
    : `**/${projectFiles[0]}`;
}

// Project Graph using CreateNode (V1)
export const createNodesFor = <T = unknown>(
  projectFiles: string[],
  projectFilter: (project: { root: string }) => boolean,
  getProjectTypeAndTargets: (
    projectFile: string,
    options?: T | undefined
  ) => {
    projectType: ProjectType;
    targets: {
      [targetName: string]: TargetConfiguration;
    };
  },
  pluginName: string
): CreateNodes<T> => [
  getProjectFilesGlob(projectFiles),
  createNodesInternal<T>(projectFilter, getProjectTypeAndTargets, pluginName),
];

// Project Graph using CreateNode (V2)
export const createNodesForV2 = <T = unknown>(
  projectFiles: string[],
  projectFilter: (project: { root: string }) => boolean,
  getProjectTypeAndTargets: (
    projectFile: string,
    options: T | undefined
  ) => {
    projectType: ProjectType;
    targets: {
      [targetName: string]: TargetConfiguration;
    };
  },
  pluginName: string
): CreateNodesV2<T> => [
  getProjectFilesGlob(projectFiles),
  (
    files: readonly string[],
    options: T | undefined,
    context: CreateNodesContextV2
  ) => {
    return createNodesFromFiles<T>(
      createNodesInternal<T>(
        projectFilter,
        getProjectTypeAndTargets,
        pluginName
      ),
      files,
      options as T,
      context
    );
  },
];

export const createDependenciesIf = (
  pluginName: string,
  projectFiles: string[],
  projectFilter: (project: { root: string }) => boolean,
  getPackageInfo: (project: { root: string }) => PackageInfo,
  ctx: CreateDependenciesContext
) => {
  if (process.env['NX_VERBOSE_LOGGING'] === 'true') {
    logger.debug(
      `[${pluginName}]: Looking related projects inside the workspace...`
    );
  }
  let workspace = undefined;

  let dependencies: RawProjectGraphDependency[] = [];

  const projectFileGlob = getProjectFilesGlob(projectFiles);
  for (const source in ctx.filesToProcess.projectFileMap) {
    const changed = ctx.filesToProcess.projectFileMap[source];
    for (const file of changed) {
      if (minimatch(file.file, projectFileGlob)) {
        // we only create the workspace map once and only if changed file is of interest
        workspace ??= getPackageInfosForNxProjects(
          pluginName,
          projectFilter,
          getPackageInfo,
          { projects: ctx.projects }
        );

        dependencies = dependencies.concat(
          getDependenciesForProject(pluginName, file.file, source, workspace)
        );
      }
    }
  }

  dependencies.forEach((dep) => validateDependency(dep, ctx));

  return dependencies;
};

function createNodesInternal<T = unknown>(
  projectFilter: (project: { root: string }) => boolean,
  getProjectTypeAndTargets: (
    projectFile: string,
    options: T | undefined
  ) => {
    projectType: ProjectType;
    targets: {
      [targetName: string]: TargetConfiguration;
    };
  },
  pluginName: string
) {
  return (
    file: string,
    options: T | undefined,
    context: CreateNodesContext
  ): CreateNodesResult => {
    if (!projectFilter({ root: getProjectRootFromFile(file) })) {
      return {}; // back off if the file/project does not match the criteria
    }

    const root = dirname(file);

    // eslint-disable-next-line no-useless-escape -- eslint's wrong
    const parts = root.split(/[\/\\]/g);
    const name = parts[parts.length - 1].toLowerCase();

    return {
      projects: {
        [name]: {
          name,
          root,
          ...(isNxCrystalEnabled()
            ? getProjectTypeAndTargets(file, options)
            : {}),
          tags: [`type:${pluginName.replace('@nxrocks/', '')}`],
        },
      },
    };
  };
}
