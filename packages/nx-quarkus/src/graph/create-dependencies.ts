import { CreateDependencies } from "@nx/devkit";

import { JVM_PROJECT_FILES, createDependenciesIf, getJvmPackageInfo } from "@nxrocks/common-jvm";
import { NX_QUARKUS_PKG } from "../index";
import { isQuarkusProject } from "../utils/quarkus-utils";

export const createDependencies: CreateDependencies = (_, ctx) => createDependenciesIf(NX_QUARKUS_PKG, JVM_PROJECT_FILES, isQuarkusProject, getJvmPackageInfo, ctx);
