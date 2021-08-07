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
import { inspectDeps as getPackageInfo, PackageInfo } from './utils/deps-utils';
interface WorkspacePackageInfoConfiguration {
    projects: {
        [projectName: string]: PackageInfo;
    };

    packages: {
        [packageId: string]: string;
    }
}

function isMavenProject(project: ProjectConfiguration): boolean {

    return (
        fileExists(path.join(appRootPath, project.root, 'pom.xml')) ||
        fileExists(path.join(appRootPath, project.root, 'build.gradle')) ||
        fileExists(path.join(appRootPath, project.root, 'build.gradle.kts'))
    );
}

function getPackageInfosForNxSpringBootProjects(workspace: WorkspaceJsonConfiguration): WorkspacePackageInfoConfiguration {
    const workspacePackageInfo = {
        projects: {},
        packages: {}
    };

    Object.entries(workspace.projects).filter(([, project]) => isMavenProject(project))
        .forEach(([projectName, project]) => {
            try {
                const pkgInfo = getPackageInfo(path.join(appRootPath, project.root));

                workspacePackageInfo.projects[projectName] = pkgInfo;
                workspacePackageInfo.packages[pkgInfo.packageId] = projectName;
            }
            catch {
                logger.warn(`[nx-quarkus]: Failed to get package info for project '${projectName}'`);
            }
        });

    return workspacePackageInfo;
}

function addDependenciesForProject(rootProjectFolder: string, rootProjectName: string, rootPkgInfo: PackageInfo, builder: ProjectGraphBuilder, workspace: WorkspacePackageInfoConfiguration): void {

    logger.debug(`[nx-quarkus]: Adding dependencies for project '${rootProjectName}'...`)
    
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

    logger.debug('[nx-quarkus]: Looking Quarkus related projects inside the workspace...');

    const workspace = getPackageInfosForNxSpringBootProjects(context.workspace);

    Object.entries(workspace.projects).forEach(([projectName, pkgInfo]) => {
        addDependenciesForProject(graph.nodes[projectName].data.root, projectName, pkgInfo, builder, workspace);
    });

    return builder.getUpdatedProjectGraph();
}