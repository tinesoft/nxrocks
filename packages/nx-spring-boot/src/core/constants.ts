import { BuilderCommandAliasMapper, GradleBuilder, MavenBuilder } from '@nxrocks/common';

export const GRADLE_BOOT_COMMAND_MAPPER : BuilderCommandAliasMapper = {
    'run': 'bootRun',
    'test': 'test',
    'clean': 'clean',
    'build': 'build',
    'install': 'publishToMavenLocal',
    'format': 'spotlessApply',
    'format-check': 'spotlessCheck',
    'build-image': 'bootBuildImage',
    'build-info': 'bootBuildInfo'
}

export const GRADLE_BUILDER = new GradleBuilder(GRADLE_BOOT_COMMAND_MAPPER);

export const MAVEN_BOOT_COMMAND_MAPPER: BuilderCommandAliasMapper = {
    'run': 'spring-boot:run',
    'test': 'test',
    'clean': 'clean',
    'build': 'package',
    'install': 'install',
    'format': 'spotless:apply',
    'format-check': 'spotless:check',
    'build-image': 'spring-boot:build-image',
    'build-info': 'spring-boot:build-info'
}

export const MAVEN_BUILDER = new MavenBuilder(MAVEN_BOOT_COMMAND_MAPPER);