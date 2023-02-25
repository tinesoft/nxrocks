import { BuilderCommandAliasMapper, GradleBuilder, MavenBuilder } from '@nxrocks/common';

export const GRADLE_KTOR_COMMAND_MAPPER : BuilderCommandAliasMapper = {
    'run': 'runFatJar',
    'serve': 'runFatJar',
    'test': 'test',
    'clean': 'clean',
    'format': 'spotlessApply',
    'apply-format': 'spotlessApply',
    'check-format': 'spotlessCheck',
    'build': 'buildFatJar',
    'install': 'publishToMavenLocal',
    'build-image': 'buildImage', 
    'publish-image': 'publishImage', 
    'publish-image-locally': 'publishImageToLocalRegistry', 
    'run-docker': 'runDocker'
}

export const GRADLE_BUILDER = new GradleBuilder(GRADLE_KTOR_COMMAND_MAPPER);

export const MAVEN_KTOR_COMMAND_MAPPER: BuilderCommandAliasMapper = {
    'run': 'exec:java',
    'serve': 'exec:java',
    'test': 'test',
    'clean': 'clean',
    'format': 'spotless:apply',
    'apply-format': 'spotless:apply',
    'check-format': 'spotless:check',
    'build': 'package',
    'install': 'install',
    'build-image': 'docker:build', 
    'publish-image': 'docker:push', 
    'publish-image-locally': 'docker:push', 
    'run-docker': 'docker:run'

}

export const MAVEN_BUILDER = new MavenBuilder(MAVEN_KTOR_COMMAND_MAPPER);