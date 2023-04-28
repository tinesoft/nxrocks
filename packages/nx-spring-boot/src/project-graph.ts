import { ProjectGraph, ProjectGraphProcessorContext } from '@nx/devkit';

import {
  getProjectGraph,
  NX_SPRING_BOOT_PKG,
  getJvmPackageInfo,
} from '@nxrocks/common';
import { isBootProject } from './utils/boot-utils';

export function processProjectGraph(
  graph: ProjectGraph,
  context: ProjectGraphProcessorContext
): ProjectGraph {
  return getProjectGraph(
    NX_SPRING_BOOT_PKG,
    isBootProject,
    getJvmPackageInfo,
    graph,
    context
  );
}
