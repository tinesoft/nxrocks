import {
    ProjectGraph,
    ProjectGraphProcessorContext,
    ProjectConfiguration} from '@nrwl/devkit';


import { isMavenProject, checkProjectBuildFileContains, isGradleProject, getProjectGraph, NX_QUARKUS_PKG, getJvmPackageInfo } from '@nxrocks/common';

function isQuarkusProject(project: ProjectConfiguration): boolean {
    
    if(isMavenProject(project)) {
        return checkProjectBuildFileContains(project, { fragments: ['<quarkus.platform.artifact-id>quarkus-bom</quarkus.platform.artifact-id>']}) ;
    }

    if(isGradleProject(project)) {
        return checkProjectBuildFileContains(project, { fragments: ['implementation enforcedPlatform("${quarkusPlatformGroupId}:${quarkusPlatformArtifactId}:${quarkusPlatformVersion}")',
            'implementation(enforcedPlatform("${quarkusPlatformGroupId}:${quarkusPlatformArtifactId}:${quarkusPlatformVersion}"))']}) ;
    }

    return false;
}

export function processProjectGraph(
    graph: ProjectGraph,
    context: ProjectGraphProcessorContext
): ProjectGraph {

    return getProjectGraph(NX_QUARKUS_PKG, isQuarkusProject, getJvmPackageInfo, graph, context);
}