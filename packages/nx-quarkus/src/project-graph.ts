import {
    ProjectGraph,
    ProjectGraphProcessorContext} from '@nrwl/devkit';

import { getProjectGraph, NX_QUARKUS_PKG, getJvmPackageInfo } from '@nxrocks/common';
import { isQuarkusProject } from './utils/quarkus-utils';


export function processProjectGraph(
    graph: ProjectGraph,
    context: ProjectGraphProcessorContext
): ProjectGraph {

    return getProjectGraph(NX_QUARKUS_PKG, isQuarkusProject, getJvmPackageInfo, graph, context);
}