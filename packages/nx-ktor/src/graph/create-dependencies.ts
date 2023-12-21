import { CreateDependencies } from "@nx/devkit";

import { JVM_PROJECT_FILES, createDependenciesIf, getJvmPackageInfo } from "@nxrocks/common-jvm";
import { NX_KTOR_PKG } from "../index";
import { isKtorProject } from "../utils/ktor-utils";

export const createDependencies: CreateDependencies = (_, ctx) => createDependenciesIf(NX_KTOR_PKG, JVM_PROJECT_FILES, isKtorProject, getJvmPackageInfo, ctx);
