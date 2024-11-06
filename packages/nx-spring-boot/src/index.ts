import { createNodesFn, createNodesFnV2 } from './graph/create-nodes';

export { projectGenerator } from './generators/project/generator';
export { createDependencies } from './graph/create-dependencies';

export const NX_SPRING_BOOT_PKG = '@nxrocks/nx-spring-boot';

export const createNodes = createNodesFn();
export const createNodesV2 = createNodesFnV2();
