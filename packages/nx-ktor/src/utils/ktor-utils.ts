import { NormalizedSchema } from '../generators/project/schema';
import { NX_KTOR_PKG } from '../index';
import {
  getCommonHttpHeaders,
  isMavenProject,
  checkProjectBuildFileContains,
  isGradleProject,
  BuilderCommandAliasType,
  hasGradleProject,
  hasMavenProject,
  runBuilderCommand,
  hasMultiModuleGradleProject,
  hasMultiModuleMavenProject,
} from '@nxrocks/common-jvm';

import { MAVEN_BUILDER, GRADLE_BUILDER } from '../core/constants';
import { ProjectConfiguration } from '@nx/devkit';
import fetch from 'node-fetch';

const getBuilder = (cwd: string) => {
  if (hasMavenProject(cwd)) return MAVEN_BUILDER;
  if (hasGradleProject(cwd)) return GRADLE_BUILDER;

  throw new Error(
    `Cannot determine the build system. No 'pom.xml' nor 'build.gradle' file found under '${cwd}'`
  );
};

export const DEFAULT_KTOR_INITIALIZR_URL =
  'https://start-ktor-io.labs.jb.gg'; //'https://start.ktor.io';

export interface KtorFeature {
  name: string;
  description?: string;
}

export function runKtorPluginCommand(
  commandAlias: BuilderCommandAliasType,
  params: string[],
  options: {
    cwd: string;
    ignoreWrapper?: boolean;
    useLegacyWrapper?: boolean;
    runFromParentModule?: boolean;
  } = { cwd: process.cwd(), ignoreWrapper: false, useLegacyWrapper: true, runFromParentModule: false }
): { success: boolean } {
  //force use legacy wrapper for all executors
  options = { ...options, useLegacyWrapper: true };

  return runBuilderCommand(commandAlias, getBuilder, params, options);
}

export function buildKtorDownloadUrl(options: NormalizedSchema) {
  const url = `${options.ktorInitializrUrl}/project/generate`;

  const params = {
    settings: {
      project_name: `${options.groupId}.${options.artifactId}`,
      company_website: options.groupId,
      ktor_version: options.ktorVersion,
      kotlin_version: options.kotlinVersion,
      build_system: options.buildSystem,
      engine: options.engine,
    },
    features: options.projectFeatures,
    configurationOption: options.configurationLocation,
    addDefaultRoutes: !options.skipCodeSamples,
    addWrapper: true,
  };

  return { url, params };
}

export function isKtorProject(project: ProjectConfiguration): boolean {
  if(hasMultiModuleMavenProject(project.root) || hasMultiModuleGradleProject(project.root))
    return true;

  if (isMavenProject(project)) {
    return checkProjectBuildFileContains(project, {
      fragments: ['<version>${ktor_version}</version>'],
    });
  }

  if (isGradleProject(project)) {
    return checkProjectBuildFileContains(project, {
      fragments: ["id 'io.ktor.plugin'", 'id("io.ktor.plugin")'],
    });
  }

  return false;
}

export async function fetchKtorFeatures(
  options: NormalizedSchema
): Promise<KtorFeature[]> {
  const version = options.ktorVersion ?? 'main';
  const url = `https://raw.githubusercontent.com/ktorio/ktor/${version}/settings.gradle.kts`;
  const response = await fetch(
    url,
    getCommonHttpHeaders(NX_KTOR_PKG, url, options.proxyUrl)
  );

  const pluginLine = 'include(":ktor-server:ktor-server-plugins:ktor-server-';
  return (
    (await response.text())
      ?.split(/\r\n|\r|\n/)
      .filter((line) => line.trim().startsWith(pluginLine))
      .map((plugin) => ({
        name: plugin.replace(pluginLine, '').replace('")', ''),
      })) ?? []
  );
}
