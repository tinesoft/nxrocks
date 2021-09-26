import { logger, ProjectConfiguration, ProjectGraph, ProjectGraphBuilder, ProjectGraphProcessorContext, WorkspaceJsonConfiguration } from "@nrwl/devkit";
import { join } from "path";
import { PackageInfo, WorkspacePackageInfoConfiguration } from "./models";

export function getPackageInfosForNxProjects(pluginName: string,
    projectFilter: (project: ProjectConfiguration) => boolean,
    getPackageInfo: (project: ProjectConfiguration) => PackageInfo,
    workspace: WorkspaceJsonConfiguration,
): WorkspacePackageInfoConfiguration {
    const workspacePackageInfo = {
        projects: {},
        packages: {}
    };

    Object.entries(workspace.projects).filter(([, project]) => projectFilter(project))
        .forEach(([projectName, project]) => {
            try {
                const pkgInfo = getPackageInfo(project);

                workspacePackageInfo.projects[projectName] = pkgInfo;
                workspacePackageInfo.packages[pkgInfo.packageId] = projectName;
            }
            catch (e) {
                if (process.env.NX_VERBOSE_LOGGING === 'true') {
                    logger.warn(`[${pluginName}]: Failed to get package info for project '${projectName}'`);
                    logger.warn(e);
                }
            }
        });

    return workspacePackageInfo;
}

export function addDependenciesForProject(pluginName: string, rootProjectFolder: string, rootProjectName: string, rootPkgInfo: PackageInfo, builder: ProjectGraphBuilder, workspace: WorkspacePackageInfoConfiguration): void {

    if (process.env.NX_VERBOSE_LOGGING === 'true') {
        logger.debug(`[${pluginName}]: Adding dependencies for project '${rootProjectName}'...`);
    }

    rootPkgInfo.dependencies.forEach(depPkgInfo => {
        const depProjectName = workspace.packages[depPkgInfo.packageId];

        if (depProjectName) {
            builder.addExplicitDependency(
                rootProjectName,
                join(rootProjectFolder, rootPkgInfo.packageFile),
                depProjectName
            );
        }
    });
}

export function getProjectGraph(
    pluginName: string,
    projectFilter: (project: ProjectConfiguration) => boolean, 
    getPackageInfo: (project: ProjectConfiguration) => PackageInfo,
    graph: ProjectGraph,
    context: ProjectGraphProcessorContext
): ProjectGraph {
    const builder = new ProjectGraphBuilder(graph);
    if (process.env.NX_VERBOSE_LOGGING === 'true') {
        logger.debug(`[${pluginName}]: Looking related projects inside the workspace...`);
    }
    const workspace = getPackageInfosForNxProjects(pluginName, projectFilter, getPackageInfo, context.workspace);
    Object.entries(workspace.projects).forEach(([projectName, pkgInfo]) => {
        addDependenciesForProject(pluginName, graph.nodes[projectName].data.root, projectName, pkgInfo, builder, workspace);
    });
    return builder.getUpdatedProjectGraph();
}