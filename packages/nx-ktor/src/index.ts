import { createNodesFn, createNodesFnV2 } from './graph/create-nodes';

export { projectGenerator } from './generators/project/generator';
export { createDependencies } from './graph/create-dependencies';

export const NX_KTOR_PKG = '@nxrocks/nx-ktor';

export const createNodes = createNodesFn();
export const createNodesV2 = createNodesFnV2();
