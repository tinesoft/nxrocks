import {
    logger,
    ProjectGraph,
    ProjectGraphBuilder,
    ProjectGraphProcessorContext,
    ProjectConfiguration,
    WorkspaceJsonConfiguration
} from '@nrwl/devkit';

import * as path from 'path';

import { fileExists } from '@nrwl/workspace/src/utils/fileutils';
import { appRootPath } from '@nrwl/workspace/src/utils/app-root';
import { getPackageInfo, PackageInfo } from './utils/deps-utils';
interface WorkspacePackageInfoConfiguration {
    projects: {
        [projectName: string]: PackageInfo;
    };

    packages: {
        [packageId: string]: string;
    }
}

function isFlutterProject(project: ProjectConfiguration): boolean {

    return fileExists(path.join(appRootPath, project.root, 'pubspec.yaml'));
}

function getPackageInfosForNxFlutterProjects(workspace: WorkspaceJsonConfiguration): WorkspacePackageInfoConfiguration {
    const workspacePackageInfo = {
        projects: {},
        packages: {}
    };

    Object.entries(workspace.projects).filter(([, project]) => isFlutterProject(project))
        .forEach(([projectName, project]) => {
            try {
                const pkgInfo = getPackageInfo(path.join(appRootPath, project.root));

                workspacePackageInfo.projects[projectName] = pkgInfo;
                workspacePackageInfo.packages[pkgInfo.packageId] = projectName;
            }
            catch (e) {
                if (process.env.NX_VERBOSE_LOGGING === 'true') {
                    logger.warn(`[nx-flutter]: Failed to get package info for project '${projectName}'`);
                    logger.warn(e);
                }
            }
        });

    return workspacePackageInfo;
}

function addDependenciesForProject(rootProjectFolder: string, rootProjectName: string, rootPkgInfo: PackageInfo, builder: ProjectGraphBuilder, workspace: WorkspacePackageInfoConfiguration): void {

    if (process.env.NX_VERBOSE_LOGGING === 'true') {
        logger.debug(`[nx-flutter]: Adding dependencies for project '${rootProjectName}'...`);
    }
    
    rootPkgInfo.dependencies.forEach(depPkgInfo => {
        const depProjectName = workspace.packages[depPkgInfo.packageId];

        if (depProjectName) {
            builder.addExplicitDependency(
                rootProjectName,
                path.join(rootProjectFolder,rootPkgInfo.packageFile),
                depProjectName
            );
        }
    });
}

export function processProjectGraph(
    graph: ProjectGraph,
    context: ProjectGraphProcessorContext
): ProjectGraph {
    const builder = new ProjectGraphBuilder(graph);

    if (process.env.NX_VERBOSE_LOGGING === 'true') {
        logger.debug('[nx-flutter]: Looking Flutter related projects inside the workspace...');
    }

    const workspace = getPackageInfosForNxFlutterProjects(context.workspace);

    Object.entries(workspace.projects).forEach(([projectName, pkgInfo]) => {
        addDependenciesForProject(graph.nodes[projectName].data.root, projectName, pkgInfo, builder, workspace);
    });

    return builder.getUpdatedProjectGraph();
}