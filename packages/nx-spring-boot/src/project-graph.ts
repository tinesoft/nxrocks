import {
    logger,
    ProjectGraph,
    ProjectGraphBuilder,
    ProjectGraphProcessorContext,
    DependencyType,
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

function isBootProject(project: ProjectConfiguration): boolean {

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

    Object.entries(workspace.projects).filter(([, project]) => isBootProject(project))
        .forEach(([projectName, project]) => {
            try {
                const pkgInfo = getPackageInfo(path.join(appRootPath, project.root));

                workspacePackageInfo.projects[projectName] = pkgInfo;
                workspacePackageInfo.packages[pkgInfo.packageId] = projectName;
            }
            catch {
                logger.warn(`[nx-spring-boot]: Failed to get package info for project '${projectName}'`);
            }
        });

    return workspacePackageInfo;
}

function addDependenciesForProject(rootProjectName: string, rootPkgInfo: PackageInfo, builder: ProjectGraphBuilder, workspace: WorkspacePackageInfoConfiguration): void {

    logger.debug(`[nx-spring-boot]: Adding dependencies for project '${rootProjectName}'...`)
    
    rootPkgInfo.dependencies.forEach(depPkgInfo => {
        const depProjectName = workspace.packages[depPkgInfo.packageId];

        if (depProjectName) {
            builder.addDependency(
                DependencyType.static,
                rootProjectName,
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

    logger.debug('[nx-spring-boot]: Looking Spring Boot related projects inside the workspace...');

    const workspace = getPackageInfosForNxSpringBootProjects(context.workspace);

    Object.entries(workspace.projects).forEach(([projectName, pkgInfo]) => {
        addDependenciesForProject(projectName, pkgInfo, builder, workspace);
    });

    return builder.getProjectGraph();
}