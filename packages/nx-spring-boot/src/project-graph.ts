import {
    logger,
    ProjectGraph,
    ProjectGraphBuilder,
    ProjectGraphProcessorContext,
    ProjectConfiguration,
    WorkspaceJsonConfiguration
} from '@nrwl/devkit';

import * as path from 'path';
import * as fs from 'fs';

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
    let packageFile = path.join(appRootPath, project.root, 'pom.xml');
    if(fileExists(packageFile)) {
        return fs.readFileSync(packageFile, 'utf8').indexOf('<artifactId>spring-boot-starter-parent</artifactId>') > -1;
    }

    packageFile = path.join(appRootPath, project.root, 'build.gradle');
    if(fileExists(packageFile)) {
        return fs.readFileSync(packageFile, 'utf8').indexOf('implementation \'org.springframework.boot:spring-boot-starter-parent\'') > -1;
    }
    
    packageFile = path.join(appRootPath, project.root, 'build.gradle.kts');
    if(fileExists(packageFile)) {
        return fs.readFileSync(packageFile, 'utf8').indexOf('implementation("org.springframework.boot:spring-boot-starter")') > -1;
    }

    return false;
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

function addDependenciesForProject(rootProjectFolder: string, rootProjectName: string, rootPkgInfo: PackageInfo, builder: ProjectGraphBuilder, workspace: WorkspacePackageInfoConfiguration): void {

    logger.debug(`[nx-spring-boot]: Adding dependencies for project '${rootProjectName}'...`)
    
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

    logger.debug('[nx-spring-boot]: Looking Spring Boot related projects inside the workspace...');

    const workspace = getPackageInfosForNxSpringBootProjects(context.workspace);

    Object.entries(workspace.projects).forEach(([projectName, pkgInfo]) => {
        addDependenciesForProject(graph.nodes[projectName].data.root, projectName, pkgInfo, builder, workspace);
    });

    return builder.getUpdatedProjectGraph();
}