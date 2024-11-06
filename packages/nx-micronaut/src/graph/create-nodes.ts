import {
  JVM_PROJECT_FILES,
  createNodesFor,
  createNodesForV2,
} from '@nxrocks/common-jvm';
import { NX_MICRONAUT_PKG } from '../index';
import { isMicronautProject } from '../utils/micronaut-utils';
import { getProjectTypeAndTargetsFromFile } from '../utils/plugin-utils';

// wrapped into a () to avoid the 'Cannot access 'NX_MICRONAUT_PKG' before initialization'
export const createNodesFn = () =>
  createNodesFor(
    JVM_PROJECT_FILES,
    isMicronautProject,
    getProjectTypeAndTargetsFromFile,
    NX_MICRONAUT_PKG
  );

export const createNodesFnV2 = () =>
  createNodesForV2(
    JVM_PROJECT_FILES,
    isMicronautProject,
    getProjectTypeAndTargetsFromFile,
    NX_MICRONAUT_PKG
  );
