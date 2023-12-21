import { ProjectGraph, ProjectGraphProcessorContext } from '@nx/devkit';

import { NX_SPRING_BOOT_PKG } from '..';
import {
  getProjectGraph,
  getJvmPackageInfo } from '@nxrocks/common-jvm';
import { isBootProject } from '../utils/boot-utils';

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
