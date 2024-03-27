import {
  CreateDependenciesContext,
  CreateNodesContext,
  CreateNodesResult,
  DependencyType,
  joinPathFragments,
  logger,
  ProjectConfiguration,
  ProjectGraph,
  ProjectGraphBuilder,
  ProjectGraphProcessorContext,
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

  if(!sourcePkgInfo)
    return dependencies;

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
    const depProjectName = workspace.packages[moduleId];

    if (depProjectName) {
      dependencies.push({
        source: sourceProjectName,
        target: depProjectName,
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

// Project Graph V1

export function getProjectGraph(
  pluginName: string,
  projectFilter: (project: { root: string }) => boolean,
  getPackageInfo: (project: { root: string }) => PackageInfo,
  graph: ProjectGraph,
  ctx: ProjectGraphProcessorContext
): ProjectGraph {
  const builder = new ProjectGraphBuilder(graph);
  if (process.env['NX_VERBOSE_LOGGING'] === 'true') {
    logger.debug(
      `[${pluginName}]: Looking related projects inside the workspace...`
    );
  }
  let workspace = undefined;
  let dependencies: RawProjectGraphDependency[] = [];

  for (const source in ctx.filesToProcess) {
    const changed = ctx.filesToProcess[source];
    for (const file of changed) {
      // we only create the workspace map once and only if changed file is of interest
      workspace ??= getPackageInfosForNxProjects(
        pluginName,
        projectFilter,
        getPackageInfo,
        ctx.projectsConfigurations
      );

      dependencies = dependencies.concat(
        getDependenciesForProject(pluginName, file.file, source, workspace)
      );
    }
  }

  for (const dep of dependencies) {
    builder.addDependency(dep.source, dep.target, dep.type, dep.source);
  }

  return builder.getUpdatedProjectGraph();
}

// Project Graph V2

export const createNodesFor = <T = unknown>(
  projectFiles: string[],
  projectFilter: (project: { root: string }) => boolean,
  getProjectTypeAndTargets: (
    projectFile: string,
    options?: T
  ) => {
    projectType: ProjectType;
    targets: {
      [targetName: string]: TargetConfiguration;
    };
  },
  pluginName: string
) =>
  [
    `**/{${projectFiles.join(',')}}` as string,
    (
      file: string,
      options: T,
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
    },
  ] as const;

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

  const projectFilePattern = `**/{${projectFiles.join(',')}}`;
  for (const source in ctx.filesToProcess.projectFileMap) {
    const changed = ctx.filesToProcess.projectFileMap[source];
    for (const file of changed) {
      if (minimatch(file.file, projectFilePattern)) {
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
