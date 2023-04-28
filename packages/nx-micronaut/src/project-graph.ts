import { ProjectGraph, ProjectGraphProcessorContext } from '@nx/devkit';

import {
  getProjectGraph,
  NX_MICRONAUT_PKG,
  getJvmPackageInfo,
} from '@nxrocks/common';
import { isMicronautProject } from './utils/micronaut-utils';

export function processProjectGraph(
  graph: ProjectGraph,
  context: ProjectGraphProcessorContext
): ProjectGraph {
  return getProjectGraph(
    NX_MICRONAUT_PKG,
    isMicronautProject,
    getJvmPackageInfo,
    graph,
    context
  );
}
