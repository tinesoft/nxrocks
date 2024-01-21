import { JVM_PROJECT_FILES, createNodesFor } from "@nxrocks/common-jvm";
import { NX_SPRING_BOOT_PKG } from "../index";

// wrapped into a () to avoid the 'Cannot access 'NX_SPRING_BOOT_PKG' before initialization'
export const createNodesFn = () => createNodesFor(JVM_PROJECT_FILES, NX_SPRING_BOOT_PKG); 