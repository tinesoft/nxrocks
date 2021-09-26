import {
    ProjectGraph,
    ProjectGraphProcessorContext,
    ProjectConfiguration} from '@nrwl/devkit';


import { isMavenProject, checkProjectBuildFileContains, isGradleProject, getProjectGraph, NX_SPRING_BOOT_PKG, getJvmPackageInfo } from '@nxrocks/common';

function isBootProject(project: ProjectConfiguration): boolean {
    
    if(isMavenProject(project)) {
        return checkProjectBuildFileContains(project, { fragments: ['<artifactId>spring-boot-starter-parent</artifactId>']}) ;
    }

    if(isGradleProject(project)) {
        return checkProjectBuildFileContains(project, { fragments: ['implementation \'org.springframework.boot:spring-boot-starter-parent\'', 'implementation("org.springframework.boot:spring-boot-starter")']}) ;
    }

    return false;
}

export function processProjectGraph(
    graph: ProjectGraph,
    context: ProjectGraphProcessorContext
): ProjectGraph {

    return getProjectGraph(NX_SPRING_BOOT_PKG, isBootProject, getJvmPackageInfo, graph, context);
}