import { createNodesFn, createNodesFnV2 } from './graph/create-nodes';

export { projectGenerator } from './generators/project/generator';
export { createDependencies } from './graph/create-dependencies';

export const NX_QUARKUS_PKG = '@nxrocks/nx-quarkus';

export const createNodes = createNodesFn();
export const createNodesV2 = createNodesFnV2();
