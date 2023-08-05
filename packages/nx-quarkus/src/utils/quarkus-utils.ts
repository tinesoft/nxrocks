import { NormalizedSchema } from '../generators/project/schema';
import {
  isMavenProject,
  checkProjectBuildFileContains,
  isGradleProject,
  BuilderCommandAliasType,
  hasGradleProject,
  hasMavenProject,
  runBuilderCommand,
  getCommonHttpHeaders,
  NX_QUARKUS_PKG,
} from '@nxrocks/common';

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

export const DEFAULT_QUARKUS_INITIALIZR_URL = 'https://code.quarkus.io';

export interface QuarkusExtension {
  id: string;
  shortName: string;
  version: string;
  name: string;
  description: string;
  category: string;
}

export function runQuarkusPluginCommand(
  commandAlias: BuilderCommandAliasType,
  params: string[],
  options: { cwd?: string; ignoreWrapper?: boolean } = { ignoreWrapper: false }
): { success: boolean } {
  return runBuilderCommand(commandAlias, getBuilder, params, options);
}

export function buildQuarkusDownloadUrl(options: NormalizedSchema) {
  const params = [
    { key: 'b', value: options.buildSystem },
    { key: 'g', value: options.groupId },
    { key: 'a', value: options.artifactId },
    { key: 'v', value: options.version },
    { key: 'ne', value: options.skipCodeSamples },
  ].filter((e) => typeof e.value !== 'undefined');

  const extensions = options.projectExtensions
    .map((ext) => `e=${ext.replace('io.quarkus:quarkus-', '')}`)
    .join('&');
  const queryParams = params
    .map((e) => `${e.key}=${e.value}`)
    .join('&')
    .concat(...(extensions?.length ? ['&', extensions] : []));

  return `${options.quarkusInitializerUrl}/d?${queryParams}`;
}

export function isQuarkusProject(project: ProjectConfiguration): boolean {
  if (isMavenProject(project)) {
    return checkProjectBuildFileContains(project, {
      fragments: [
        '<quarkus.platform.artifact-id>quarkus-bom</quarkus.platform.artifact-id>',
      ],
    });
  }

  if (isGradleProject(project)) {
    return checkProjectBuildFileContains(project, {
      fragments: [
        'implementation enforcedPlatform("${quarkusPlatformGroupId}:${quarkusPlatformArtifactId}:${quarkusPlatformVersion}")',
        'implementation(enforcedPlatform("${quarkusPlatformGroupId}:${quarkusPlatformArtifactId}:${quarkusPlatformVersion}"))',
      ],
    });
  }

  return false;
}

export async function fetchQuarkusExtensions(
  options: NormalizedSchema
): Promise<QuarkusExtension[]> {
  const response = await fetch(
    `${options.quarkusInitializerUrl}/api/extensions`,
    getCommonHttpHeaders(
      NX_QUARKUS_PKG,
      options.quarkusInitializerUrl,
      options.proxyUrl
    )
  );

  return (await response.json() as QuarkusExtension[]) ?? [];
}
