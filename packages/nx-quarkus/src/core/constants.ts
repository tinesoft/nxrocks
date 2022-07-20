import { BuilderCommandAliasMapper, GradleBuilder, MavenBuilder } from '@nxrocks/common';

export const GRADLE_QUARKUS_COMMAND_MAPPER : BuilderCommandAliasMapper = {
    'dev': 'quarkusDev',
    'remote-dev': 'quarkusRemoteDev',
    'test': 'test',
    'clean': 'clean',
    'format': 'spotlessApply',
    'format-check': 'spotlessCheck',
    'build': 'build',
    'install': 'publishToMavenLocal',
    'package': 'package',
    'add-extension': 'quarkusAddExtension',
    'list-extensions': 'quarkusListExtensions',
}

export const GRADLE_BUILDER = new GradleBuilder(GRADLE_QUARKUS_COMMAND_MAPPER);

export const MAVEN_QUARKUS_COMMAND_MAPPER: BuilderCommandAliasMapper = {
    'dev': 'quarkus:dev',
    'remote-dev': 'quarkus:remote-dev',
    'test': 'test',
    'clean': 'clean',
    'format': 'spotless:apply',
    'format-check': 'spotless:check',
    'build': 'package',
    'install': 'install',
    'package': 'package',
    'add-extension': 'quarkus:add-extension',
    'list-extensions': 'quarkus:list-extensions',
}

export const MAVEN_BUILDER = new MavenBuilder(MAVEN_QUARKUS_COMMAND_MAPPER);