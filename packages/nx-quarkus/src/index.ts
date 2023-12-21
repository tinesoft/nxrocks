export const NX_QUARKUS_PKG = '@nxrocks/nx-quarkus';

export { projectGenerator } from './generators/project/generator';
export { processProjectGraph } from './graph/process-project-graph';
export { createDependencies } from './graph/create-dependencies';
import { createNodesFn } from './graph/create-nodes';

export const createNodes = createNodesFn();
