import { BuilderCommandAliasMapper, GradleBuilder, MavenBuilder } from '@nxrocks/common-jvm';

export const GRADLE_MICRONAUT_COMMAND_MAPPER : BuilderCommandAliasMapper = {
    'run': 'run',
    'serve': 'run',
    'test': 'test',
    'clean': 'clean',
    'format': 'spotlessApply',
    'apply-format': 'spotlessApply',
    'check-format': 'spotlessCheck',
    'build': 'build',
    'install': 'publishToMavenLocal',
    'aot-sample-config': 'createAotSampleConfigurationFiles',
    'dockerfile': 'dockerfile'
}

export const GRADLE_BUILDER = new GradleBuilder(GRADLE_MICRONAUT_COMMAND_MAPPER);

export const MAVEN_MICRONAUT_COMMAND_MAPPER: BuilderCommandAliasMapper = {
    'run': 'mn:run',
    'serve': 'mn:run',
    'test': 'test',
    'clean': 'clean',
    'format': 'spotless:apply',
    'apply-format': 'spotless:apply',
    'check-format': 'spotless:check',
    'build': 'package',
    'install': 'install',
    'aot-sample-config': 'mn:aot-sample-config',
    'dockerfile': 'mn:dockerfile'
}

export const MAVEN_BUILDER = new MavenBuilder(MAVEN_MICRONAUT_COMMAND_MAPPER);