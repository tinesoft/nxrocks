import { BuilderCommandAliasMapper, GradleBuilder, MavenBuilder } from '@nxrocks/common';

export const GRADLE_QUARKUS_COMMAND_MAPPER : BuilderCommandAliasMapper = {
    'dev': 'quarkusDev',
    'remoteDev': 'quarkusRemoteDev',
    'test': 'test',
    'clean': 'clean',
    'build': 'build',
    'package': 'package',
    'addExtension': 'quarkusAddExtension',
    'listExtensions': 'quarkusListExtensions',
}

export const GRADLE_BUILDER = new GradleBuilder(GRADLE_QUARKUS_COMMAND_MAPPER);

export const MAVEN_QUARKUS_COMMAND_MAPPER: BuilderCommandAliasMapper = {
    'dev': 'quarkus:dev',
    'remoteDev': 'quarkus:remote-dev',
    'test': 'test',
    'clean': 'clean',
    'build': 'build',
    'package': 'package',
    'addExtension': 'quarkus:add-extension',
    'listExtensions': 'quarkus:list-extensions',
}

export const MAVEN_BUILDER = new MavenBuilder(MAVEN_QUARKUS_COMMAND_MAPPER);