import {
    ProjectGraph,
    ProjectGraphProcessorContext} from '@nrwl/devkit';

import { getProjectGraph, NX_KTOR_PKG, getJvmPackageInfo } from '@nxrocks/common';
import { isKtorProject } from './utils/ktor-utils';


export function processProjectGraph(
    graph: ProjectGraph,
    context: ProjectGraphProcessorContext
): ProjectGraph {

    return getProjectGraph(NX_KTOR_PKG, isKtorProject, getJvmPackageInfo, graph, context);
}