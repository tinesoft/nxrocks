import { escape } from 'querystring';
import {
  NormalizedSchema,
  ProjectGeneratorOptions,
} from '../generators/project/schema';
import {
  BuilderCommandAliasType,
  hasGradleProject,
  hasMavenProject,
  runBuilderCommand,
  isMavenProject,
  checkProjectBuildFileContains,
  isGradleProject,
  getCommonHttpHeaders,
  NX_SPRING_BOOT_PKG,
  MavenDependency,
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

export const DEFAULT_SPRING_INITIALIZR_URL = 'https://start.spring.io';

export function runBootPluginCommand(
  commandAlias: BuilderCommandAliasType,
  params: string[],
  options: { cwd?: string; ignoreWrapper?: boolean } = { ignoreWrapper: false }
): { success: boolean } {
  return runBuilderCommand(commandAlias, getBuilder, params, options);
}

export function buildBootDownloadUrl(options: NormalizedSchema) {
  const params = [
    { key: 'type', value: options.buildSystem },
    { key: 'language', value: options.language },
    { key: 'name', value: options.name },
    { key: 'groupId', value: options.groupId },
    { key: 'artifactId', value: options.artifactId },
    { key: 'version', value: options.version },
    { key: 'packageName', value: options.packageName },
    { key: 'javaVersion', value: options.javaVersion },
    { key: 'packaging', value: options.packaging },
    { key: 'dependencies', value: options.projectDependencies.join(',') },
    {
      key: 'description',
      value: options.description ? escape(options.description) : null,
    },
    { key: 'bootVersion', value: options.bootVersion },
  ].filter((e) => !!e.value);

  const queryParams = params.map((e) => `${e.key}=${e.value}`).join('&');

  return `${options.springInitializerUrl}/starter.zip?${queryParams}`;
}

export function isBootProject(project: ProjectConfiguration): boolean {
  if (isMavenProject(project)) {
    return checkProjectBuildFileContains(project, {
      fragments: ['<artifactId>spring-boot-starter-parent</artifactId>'],
    });
  }

  if (isGradleProject(project)) {
    return checkProjectBuildFileContains(project, {
      fragments: [
        "implementation 'org.springframework.boot:spring-boot-starter-parent'",
        'implementation("org.springframework.boot:spring-boot-starter")',
      ],
    });
  }

  return false;
}

export async function fetchBootDependencies(
  options: ProjectGeneratorOptions
): Promise<{ [id: string]: MavenDependency }> {
  const response = await fetch(
    `${options.springInitializerUrl}/dependencies`,
    getCommonHttpHeaders(
      NX_SPRING_BOOT_PKG,
      options.springInitializerUrl,
      options.proxyUrl
    )
  );

  return (await response.json())?.dependencies ?? {};
}
