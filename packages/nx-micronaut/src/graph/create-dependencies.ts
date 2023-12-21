import { CreateDependencies } from "@nx/devkit";

import { JVM_PROJECT_FILES, createDependenciesIf, getJvmPackageInfo } from "@nxrocks/common-jvm";
import { NX_MICRONAUT_PKG } from "../index";
import { isMicronautProject } from "../utils/micronaut-utils";

export const createDependencies: CreateDependencies = (_, ctx) => createDependenciesIf(NX_MICRONAUT_PKG, JVM_PROJECT_FILES, isMicronautProject, getJvmPackageInfo, ctx);
