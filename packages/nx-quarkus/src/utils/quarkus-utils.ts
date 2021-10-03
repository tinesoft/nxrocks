import { NormalizedSchema } from '../generators/project/schema';
import { BuilderCommandAliasType, hasGradleProject, hasMavenProject, runBuilderCommand } from '@nxrocks/common';
import { MAVEN_BUILDER, GRADLE_BUILDER } from '../core/constants';

const getBuilder = (cwd: string) => {
    if (hasMavenProject(cwd)) return MAVEN_BUILDER;
    if (hasGradleProject(cwd)) return GRADLE_BUILDER;

    throw new Error(
      `Cannot determine the build system. No 'pom.xml' nor 'build.gradle' file found under '${cwd}'`
    );
}

export function runQuarkusPluginCommand(
    commandAlias: BuilderCommandAliasType,
    params: string[],
    options: { cwd?: string; ignoreWrapper?: boolean } = { ignoreWrapper: false },
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
    ].filter( e => typeof e.value !== 'undefined');

    const extensions = options.projectExtensions.map(ext => `e=${ext.replace('io.quarkus:quarkus-', '')}`).join('&');
    const queryParams = params.map(e => `${e.key}=${e.value}`).join('&').concat(...(extensions?.length ? ['&',extensions]: []));

    return `${options.quarkusInitializerUrl}/d?${queryParams}`;
}

