import { ProjectGraph, ProjectGraphProcessorContext } from '@nx/devkit';

import { NX_MICRONAUT_PKG } from '.';
import {
  getProjectGraph,
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
