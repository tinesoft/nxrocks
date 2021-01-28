import { BuildCommandAliasType, BuildCommandAliasMapperType, BuildCore, BuildSystem } from './build-core.class';


export class MavenBuild implements BuildCore {

    private static COMMAND_ALIASES: BuildCommandAliasMapperType = {
        'run': 'spring-boot:run',
        'test': 'test',
        'clean': 'clean',
        'buildJar': 'spring-boot:repackage',
        'buildWar': 'spring-boot:repackage',
        'buildImage': 'spring-boot:build-image',
        'buildInfo': 'spring-boot:build-info'
    }

    getBuildSystemType() {
        return BuildSystem.MAVEN;
    }

    getExecutable(ignoreWrapper: boolean) {
        const isWin = process.platform === "win32";
        return !ignoreWrapper ? `./mvnw${isWin ? '.cmd' : ''}` : `mvn`;
    }

    getCommand(alias: BuildCommandAliasType) {
        return MavenBuild.COMMAND_ALIASES[alias];
    }

}