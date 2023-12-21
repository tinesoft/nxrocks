import { JVM_PROJECT_FILES, createNodesFor } from "@nxrocks/common-jvm";
import { NX_QUARKUS_PKG } from "../index";

// wrapped iton a () to avoid the 'Cannot access 'NX_QUARKUS_PKG' before initialization'
export const createNodesFn = () => createNodesFor(JVM_PROJECT_FILES, NX_QUARKUS_PKG); 