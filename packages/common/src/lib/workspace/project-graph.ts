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
  RawProjectGraphDependency,
  validateDependency,
} from '@nx/devkit';
import { minimatch } from 'minimatch';

import { PackageInfo, WorkspacePackageInfoConfiguration } from './models';
import { getNameAndRoot } from './utils';

export function getPackageInfosForNxProjects(
  pluginName: string,
  projectFilter: (project: ProjectConfiguration) => boolean,
  getPackageInfo: (project: ProjectConfiguration) => PackageInfo,
  workspace: {
    projects: {
      [projectName: string]: ProjectConfiguration;
    }
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

        workspacePackageInfo.projects[projectName] = pkgInfo;
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

export function addDependenciesForProject(
  pluginName: string,
  rootProjectFolder: string,
  rootProjectName: string,
  rootPkgInfo: PackageInfo,
  builder: ProjectGraphBuilder,
  workspace: WorkspacePackageInfoConfiguration
): void {

  const dependencies = getDependenciesForProject(pluginName, rootProjectFolder, rootProjectName, rootPkgInfo, workspace);
  for (const dep of dependencies) {
    builder.addDependency(dep.source, dep.target, dep.type, dep.source);
  };
}


export function getDependenciesForProject(
  pluginName: string,
  rootProjectFolder: string,
  rootProjectName: string,
  rootPkgInfo: PackageInfo,
  workspace: WorkspacePackageInfoConfiguration
): RawProjectGraphDependency[] {
  if (process.env['NX_VERBOSE_LOGGING'] === 'true') {
    logger.debug(
      `[${pluginName}]: Getting dependencies for project '${rootProjectName}'...`
    );
  }

  const dependencies: RawProjectGraphDependency[] = [];

  rootPkgInfo.dependencies?.forEach((depPkgInfo) => {
    const depProjectName = workspace.packages[depPkgInfo.packageId];

    if (depProjectName) {
      dependencies.push(
        {
          source: rootProjectName,
          target: depProjectName,
          type: DependencyType.static,
          sourceFile: joinPathFragments(rootProjectFolder, rootPkgInfo.packageFile),
        }
      );
    }
  });

  rootPkgInfo.modules?.forEach((childModuleName) => {
    dependencies.push(
      {
        source: rootProjectName,
        target: childModuleName,
        type: DependencyType.static,
        sourceFile: joinPathFragments(rootProjectFolder, rootPkgInfo.packageFile)
      }
    );
  });

  return dependencies;
}

export function getProjectGraph(
  pluginName: string,
  projectFilter: (project: { root: string }) => boolean,
  getPackageInfo: (project: { root: string }) => PackageInfo,
  graph: ProjectGraph,
  context: ProjectGraphProcessorContext
): ProjectGraph {
  const builder = new ProjectGraphBuilder(graph);
  if (process.env['NX_VERBOSE_LOGGING'] === 'true') {
    logger.debug(
      `[${pluginName}]: Looking related projects inside the workspace...`
    );
  }
  const workspace = getPackageInfosForNxProjects(
    pluginName,
    projectFilter,
    getPackageInfo,
    context.projectsConfigurations
  );
  Object.entries(workspace.projects).forEach(([projectName, pkgInfo]) => {
    addDependenciesForProject(
      pluginName,
      graph.nodes[projectName].data.root,
      projectName,
      pkgInfo,
      builder,
      workspace
    );
  });
  return builder.getUpdatedProjectGraph();
}

//Project Graph V2

export const createNodesFor = (projectFilePattern: string[], pluginName: string) =>
  [
    `**/{${projectFilePattern.join(',')}}` as string,
    (
      file: string,
      opt: unknown,
      context: CreateNodesContext,
    ): CreateNodesResult => {

      const { root, name } = getNameAndRoot(file);

      return {
        projects: {
          [name]: {
            name,
            root,
            tags: [`type:${pluginName.replace('@nxrocks/', '')}`],
          },
        },
      };
    }
  ] as const;


export const createDependenciesIf = (pluginName: string,
  projectFilePattern: string[],
  projectFilter: (project: { root: string }) => boolean,
  getPackageInfo: (project: { root: string }) => PackageInfo,
  ctx: CreateDependenciesContext) => {
  if (process.env['NX_VERBOSE_LOGGING'] === 'true') {
    logger.debug(
      `[${pluginName}]: Looking related projects inside the workspace...`
    );
  }
  const workspace = getPackageInfosForNxProjects(
    pluginName,
    projectFilter,
    getPackageInfo,
    { projects: ctx.projects }
  );

  let dependencies: RawProjectGraphDependency[] = [];

  for (const source in ctx.filesToProcess.projectFileMap) {
    const changed = ctx.filesToProcess.projectFileMap[source];
    for (const file of changed) {
      if (projectFilePattern.some(p => minimatch(file.file, p))) {
        const { root, name } = getNameAndRoot(file.file);

        dependencies = dependencies.concat(
          getDependenciesForProject(pluginName, root, name, workspace.projects[name], workspace),
        );
      }
    }
  }

  dependencies.forEach(dep => validateDependency(dep, ctx));

  return dependencies;
}