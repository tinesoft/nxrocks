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

function checkProjectAndRoot(file: string, keyToCheckFor: string, project: ProjectConfiguration) {
  const packageFile = path.join(appRootPath, project.root, file);

  if(!fileExists(packageFile)) return false;

  const inProject = fs.readFileSync(packageFile, 'utf8').includes(keyToCheckFor);

  if(inProject) return inProject;

  const rootFile =  path.join(appRootPath, project.root, file);

  if(!fileExists(rootFile)) return false;

  return fs.readFileSync(rootFile, 'utf8').includes(keyToCheckFor);
}

function isBootProject(project: ProjectConfiguration): boolean {

  if(checkProjectAndRoot('pom.xml', '<artifactId>spring-boot-starter-parent</artifactId>', project)) return true;

  if(checkProjectAndRoot('build.gradle', 'implementation \'org.springframework.boot:spring-boot-starter-parent\'', project)) return true;

  return checkProjectAndRoot('build.gradle.kts', 'implementation("org.springframework.boot:spring-boot-starter")', project);
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
            catch (e) {
                if (process.env.NX_VERBOSE_LOGGING === 'true') {
                    logger.warn(`[nx-spring-boot]: Failed to get package info for project '${projectName}'`);
                    logger.warn(e);
                }
            }
        });

    return workspacePackageInfo;
}

function addDependenciesForProject(rootProjectFolder: string, rootProjectName: string, rootPkgInfo: PackageInfo, builder: ProjectGraphBuilder, workspace: WorkspacePackageInfoConfiguration): void {

    if (process.env.NX_VERBOSE_LOGGING === 'true') {
        logger.debug(`[nx-spring-boot]: Adding dependencies for project '${rootProjectName}'...`);
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
        logger.debug('[nx-spring-boot]: Looking Spring Boot related projects inside the workspace...');
    }

    const workspace = getPackageInfosForNxSpringBootProjects(context.workspace);

    Object.entries(workspace.projects).forEach(([projectName, pkgInfo]) => {
        addDependenciesForProject(graph.nodes[projectName].data.root, projectName, pkgInfo, builder, workspace);
    });

    return builder.getUpdatedProjectGraph();
}
