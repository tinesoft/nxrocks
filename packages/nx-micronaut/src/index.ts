import { createNodesFn, createNodesFnV2 } from './graph/create-nodes';

export { projectGenerator } from './generators/project/generator';
export { createDependencies } from './graph/create-dependencies';

export const NX_MICRONAUT_PKG = '@nxrocks/nx-micronaut';

export const createNodes = createNodesFn();
export const createNodesV2 = createNodesFnV2();
