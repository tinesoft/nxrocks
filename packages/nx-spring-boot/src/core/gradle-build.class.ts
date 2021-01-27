import { BuildCommandAliasMapperType, BuildCommandAliasType, BuildCore, BuildSystem } from './build-core.class';


export class GradleBuild implements BuildCore {

    private static COMMAND_ALIASES : BuildCommandAliasMapperType = {
        'run': 'bootRun',
        'test': 'test',
        'buildJar': 'bootJar',
        'buildWar': 'bootWar',
        'buildImage': 'bootBuildImage',
        'buildInfo': 'bootBuildInfo'
    }

    getBuildSystemType() {
        return BuildSystem.GRADLE;
    }

    getExecutable() {
        const isWin = process.platform === "win32";
        return `./gradlew${isWin ? '.cmd' : ''}`;
    }

    getCommand( alias: BuildCommandAliasType){
        return GradleBuild.COMMAND_ALIASES[alias];
    }

}