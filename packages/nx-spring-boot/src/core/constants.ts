import { BuilderCommandAliasMapper, GradleBuilder, MavenBuilder } from '@nxrocks/common';

export const GRADLE_BOOT_COMMAND_MAPPER : BuilderCommandAliasMapper = {
    'run': 'bootRun',
    'test': 'test',
    'clean': 'clean',
    'build': 'build',
    'format': 'spotlessApply',
    'buildImage': 'bootBuildImage',
    'buildInfo': 'bootBuildInfo'
}

export const GRADLE_BUILDER = new GradleBuilder(GRADLE_BOOT_COMMAND_MAPPER);

export const MAVEN_BOOT_COMMAND_MAPPER: BuilderCommandAliasMapper = {
    'run': 'spring-boot:run',
    'test': 'test',
    'clean': 'clean',
    'build': 'package',
    'format': 'spotless:apply',
    'buildImage': 'spring-boot:build-image',
    'buildInfo': 'spring-boot:build-info'
}

export const MAVEN_BUILDER = new MavenBuilder(MAVEN_BOOT_COMMAND_MAPPER);