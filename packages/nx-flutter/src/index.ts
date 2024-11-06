import { createNodesFn, createNodesFnV2 } from './graph/create-nodes';

export { projectGenerator } from './generators/project/generator';
export { createDependencies } from './graph/create-dependencies';

export const NX_FLUTTER_PKG = '@nxrocks/nx-flutter';

export const createNodes = createNodesFn();
export const createNodesV2 = createNodesFnV2();
