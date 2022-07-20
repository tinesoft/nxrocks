import { BuilderCommandAliasMapper, GradleBuilder, MavenBuilder } from '@nxrocks/common';

export const GRADLE_MICRONAUT_COMMAND_MAPPER : BuilderCommandAliasMapper = {
    'run': 'run',
    'test': 'test',
    'clean': 'clean',
    'format': 'spotlessApply',
    'format-check': 'spotlessCheck',
    'build': 'build',
    'install': 'publishToMavenLocal',
    'aotSampleConfig': 'createAotSampleConfigurationFiles',
    'dockerfile': 'dockerfile'
}

export const GRADLE_BUILDER = new GradleBuilder(GRADLE_MICRONAUT_COMMAND_MAPPER);

export const MAVEN_MICRONAUT_COMMAND_MAPPER: BuilderCommandAliasMapper = {
    'run': 'mn:run',
    'test': 'test',
    'clean': 'clean',
    'format': 'spotless:apply',
    'format-check': 'spotless:check',
    'build': 'package',
    'install': 'install',
    'aotSampleConfig': 'mn:aot-sample-config',
    'dockerfile': 'mn:dockerfile'
}

export const MAVEN_BUILDER = new MavenBuilder(MAVEN_MICRONAUT_COMMAND_MAPPER);