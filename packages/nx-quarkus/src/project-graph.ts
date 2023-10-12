import { ProjectGraph, ProjectGraphProcessorContext } from '@nx/devkit';

import {
  getProjectGraph,
  NX_QUARKUS_PKG,
} from '@nxrocks/common';
import {
  getJvmPackageInfo,
} from '@nxrocks/common-jvm';
import { isQuarkusProject } from './utils/quarkus-utils';

export function processProjectGraph(
  graph: ProjectGraph,
  context: ProjectGraphProcessorContext
): ProjectGraph {
  return getProjectGraph(
    NX_QUARKUS_PKG,
    isQuarkusProject,
    getJvmPackageInfo,
    graph,
    context
  );
}
