import {
    ProjectGraph,
    ProjectGraphProcessorContext,
} from '@nrwl/devkit';

import { getPackageInfo } from './utils/deps-utils';
import { getProjectGraph, NX_FLUTTER_PKG } from '@nxrocks/common';
import { isFlutterProject } from './utils/flutter-utils';


export function processProjectGraph(
    graph: ProjectGraph,
    context: ProjectGraphProcessorContext
): ProjectGraph {

    return getProjectGraph(NX_FLUTTER_PKG, isFlutterProject, getPackageInfo, graph, context);
}