import { NormalizedSchema } from '../generators/project/schema';
import { NX_MICRONAUT_PKG } from '../index';
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

export const DEFAULT_MICRONAUT_LAUNCH_URL = 'https://launch.micronaut.io';

export interface MicronautFeature {
  name: string;
  title: string;
  description: string;
  category: string;
  preview: boolean;
  community: boolean;
}

export function runMicronautPluginCommand(
  commandAlias: BuilderCommandAliasType,
  params: string[],
  options: {
    cwd: string;
    ignoreWrapper?: boolean;
    useLegacyWrapper?: boolean;
    runFromParentModule?: boolean 
  } = { cwd: process.cwd(), ignoreWrapper: false, useLegacyWrapper: true, runFromParentModule: false }
): { success: boolean } {
  //force use legacy wrapper for all executors
  options = { ...options, useLegacyWrapper: true };
  return runBuilderCommand(commandAlias, getBuilder, params, options);
}

export function buildMicronautDownloadUrl(options: NormalizedSchema) {
  const params = [
    { key: 'javaVersion', value: options.javaVersion },
    { key: 'lang', value: options.language },
    { key: 'build', value: options.buildSystem },
    { key: 'test', value: options.testFramework },
  ].filter((e) => !!e.value);

  const features = options.projectFeatures
    .map((feat) => `features=${feat}`)
    .join('&');
  const queryParams = params
    .map((e) => `${e.key}=${e.value}`)
    .join('&')
    .concat(...(features.length ? ['&', features] : []));

  const versions = {
    current: 'launch',
    snapshot: 'snapshot',
    previous: 'prev',
  };

  const baseUrl = options.micronautVersion
    ? options.micronautLaunchUrl.replace(
        'launch',
        versions[options.micronautVersion]
      )
    : options.micronautLaunchUrl;

  return `${baseUrl}/create/${options.projectType}/${options.fullPackage}?${queryParams}`;
}

export function isMicronautProject(project: ProjectConfiguration): boolean {
  if(hasMultiModuleMavenProject(project.root) || hasMultiModuleGradleProject(project.root))
    return true;

  if (isMavenProject(project)) {
    return checkProjectBuildFileContains(project, {
      fragments: ['<artifactId>micronaut-parent</artifactId>'],
    });
  }

  if (isGradleProject(project)) {
    return checkProjectBuildFileContains(project, {
      fragments: [
        "implementation 'io.micronaut:micronaut-runtime'",
        'implementation("io.micronaut:micronaut-runtime")',
      ],
    });
  }

  return false;
}

export async function fetchMicronautFeatures(
  options: NormalizedSchema
): Promise<MicronautFeature[]> {
  const response = await fetch(
    `${options.micronautLaunchUrl}/application-types/${options.projectType}/features`,
    getCommonHttpHeaders(
      NX_MICRONAUT_PKG,
      options.micronautLaunchUrl,
      options.proxyUrl
    )
  );

  return (await response.json() as {features: MicronautFeature[]})?.features ?? [];
}
