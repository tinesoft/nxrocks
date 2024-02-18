import { JVM_PROJECT_FILES, createNodesFor } from "@nxrocks/common-jvm";
import { NX_MICRONAUT_PKG } from "../index";
import { isMicronautProject } from "../utils/micronaut-utils";

// wrapped into a () to avoid the 'Cannot access 'NX_MICRONAUT_PKG' before initialization'
export const createNodesFn = () => createNodesFor(JVM_PROJECT_FILES, isMicronautProject, NX_MICRONAUT_PKG); 