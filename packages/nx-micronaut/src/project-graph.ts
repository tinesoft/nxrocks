import { ProjectGraph, ProjectGraphProcessorContext } from '@nx/devkit';

import {
  getProjectGraph,
  NX_MICRONAUT_PKG,
} from '@nxrocks/common';
import {
  getJvmPackageInfo,
} from '@nxrocks/common-jvm';
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
