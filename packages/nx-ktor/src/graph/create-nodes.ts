import { JVM_PROJECT_FILES, createNodesFor } from "@nxrocks/common-jvm";
import { NX_KTOR_PKG } from "../index";
import { isKtorProject } from "../utils/ktor-utils";

// wrapped into a () to avoid the 'Cannot access 'NX_KTOR_PKG' before initialization'
export const createNodesFn = () => createNodesFor(JVM_PROJECT_FILES, isKtorProject, NX_KTOR_PKG); 