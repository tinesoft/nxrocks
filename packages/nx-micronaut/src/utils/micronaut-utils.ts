import { NormalizedSchema } from '../generators/project/schema';
import { isMavenProject, checkProjectBuildFileContains, isGradleProject, BuilderCommandAliasType, hasGradleProject, hasMavenProject, runBuilderCommand } from '@nxrocks/common';

import { MAVEN_BUILDER, GRADLE_BUILDER } from '../core/constants';
import { ProjectConfiguration } from '@nrwl/devkit';

const getBuilder = (cwd: string) => {
    if (hasMavenProject(cwd)) return MAVEN_BUILDER;
    if (hasGradleProject(cwd)) return GRADLE_BUILDER;

    throw new Error(
      `Cannot determine the build system. No 'pom.xml' nor 'build.gradle' file found under '${cwd}'`
    );
}

export function runMicronautPluginCommand(
    commandAlias: BuilderCommandAliasType,
    params: string[],
    options: { cwd?: string; ignoreWrapper?: boolean, useLegacyWrapper?: boolean } = { ignoreWrapper: false, useLegacyWrapper: true },
): { success: boolean } {
    //force use legacy wrapper for all executors
    options = { ...options, useLegacyWrapper : true};
    console.log(`runMicronautPluginCommand, ignoreWrapper: ${options.ignoreWrapper}, useLegacyWrapper: ${options.useLegacyWrapper}`);
    return runBuilderCommand(commandAlias, getBuilder, params, options);
}


export function buildMicronautDownloadUrl(options: NormalizedSchema) {
    const params = [
        { key: 'javaVersion', value: options.javaVersion },
        { key: 'lang', value: options.language },
        { key: 'build', value: options.buildSystem },
        { key: 'test', value: options.testFramework },
    ].filter( e =>  !!e.value);

    const features = options.projectFeatures
    .filter(feat => feat.trim.length)
    .map(feat => `features=${feat}`).join('&');
    const queryParams = params.map(e => `${e.key}=${e.value}`).join('&').concat(...(features.length ? ['&',features]: []));

    const versions = {
        'current': 'launch',
        'snapshot': 'snapshot',
        'previous': 'prev'
    };

    const baseUrl = options.micronautVersion ?
     options.micronautLaunchUrl.replace('launch', versions[options.micronautVersion]) :
     options.micronautLaunchUrl;

    return `${baseUrl}/create/${options.type}/${options.fullPackage}?${queryParams}`;
}


export function isMicronautProject(project: ProjectConfiguration): boolean {
    
    if(isMavenProject(project)) {
        return checkProjectBuildFileContains(project, { fragments: ['<artifactId>micronaut-parent</artifactId>']}) ;
    }

    if(isGradleProject(project)) {
        return checkProjectBuildFileContains(project, { fragments: ['implementation \'io.micronaut:micronaut-runtime\'', 'implementation("io.micronaut:micronaut-runtime")']}) ;
    }

    return false;
}

