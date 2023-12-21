import { CreateDependencies } from "@nx/devkit";

import { JVM_PROJECT_FILES, createDependenciesIf, getJvmPackageInfo } from "@nxrocks/common-jvm";
import { NX_SPRING_BOOT_PKG } from "../index";
import { isBootProject } from "../utils/boot-utils";

export const createDependencies: CreateDependencies = (_, ctx) => createDependenciesIf(NX_SPRING_BOOT_PKG, JVM_PROJECT_FILES, isBootProject, getJvmPackageInfo, ctx);
