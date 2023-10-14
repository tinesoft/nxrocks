import { ProjectGraph, ProjectGraphProcessorContext } from '@nx/devkit';

import { getPackageInfo } from './utils/deps-utils';
import { getProjectGraph} from '@nxrocks/common';
import { isFlutterProject } from './utils/flutter-utils';
import { NX_FLUTTER_PKG } from '.';

export function processProjectGraph(
  graph: ProjectGraph,
  context: ProjectGraphProcessorContext
): ProjectGraph {
  return getProjectGraph(
    NX_FLUTTER_PKG,
    isFlutterProject,
    getPackageInfo,
    graph,
    context
  );
}
