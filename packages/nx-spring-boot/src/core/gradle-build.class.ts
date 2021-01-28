import { BuildCommandAliasMapperType, BuildCommandAliasType, BuildCore, BuildSystem } from './build-core.class';


export class GradleBuild implements BuildCore {

    private static COMMAND_ALIASES: BuildCommandAliasMapperType = {
        'run': 'bootRun',
        'test': 'test',
        'clean': 'clean',
        'buildJar': 'bootJar',
        'buildWar': 'bootWar',
        'buildImage': 'bootBuildImage',
        'buildInfo': 'bootBuildInfo'
    }

    getBuildSystemType() {
        return BuildSystem.GRADLE;
    }

    getExecutable(ignoreWrapper: boolean) {
        const isWin = process.platform === "win32";
        return !ignoreWrapper ? `./gradlew${isWin ? '.cmd' : ''}` : `gradle`;
    }

    getCommand(alias: BuildCommandAliasType) {
        return GradleBuild.COMMAND_ALIASES[alias];
    }

}