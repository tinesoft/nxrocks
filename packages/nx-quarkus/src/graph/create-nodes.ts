import {
  JVM_PROJECT_FILES,
  createNodesFor,
  createNodesForV2,
} from '@nxrocks/common-jvm';
import { NX_QUARKUS_PKG } from '../index';
import { isQuarkusProject } from '../utils/quarkus-utils';
import { getProjectTypeAndTargetsFromFile } from '../utils/plugin-utils';

// wrapped into a () to avoid the 'Cannot access 'NX_QUARKUS_PKG' before initialization'
export const createNodesFn = () =>
  createNodesFor(
    JVM_PROJECT_FILES,
    isQuarkusProject,
    getProjectTypeAndTargetsFromFile,
    NX_QUARKUS_PKG
  );

export const createNodesFnV2 = () =>
  createNodesForV2(
    JVM_PROJECT_FILES,
    isQuarkusProject,
    getProjectTypeAndTargetsFromFile,
    NX_QUARKUS_PKG
  );
