import { ProjectGraph, ProjectGraphProcessorContext } from '@nx/devkit';

import {
  getProjectGraph,
  NX_KTOR_PKG,
} from '@nxrocks/common';
import {
  getJvmPackageInfo,
} from '@nxrocks/common-jvm';
import { isKtorProject } from './utils/ktor-utils';

export function processProjectGraph(
  graph: ProjectGraph,
  context: ProjectGraphProcessorContext
): ProjectGraph {
  return getProjectGraph(
    NX_KTOR_PKG,
    isKtorProject,
    getJvmPackageInfo,
    graph,
    context
  );
}
