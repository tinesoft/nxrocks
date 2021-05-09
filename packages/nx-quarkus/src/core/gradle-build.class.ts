import { BuildCommandAliasMapperType, BuildCommandAliasType, BuildCore, BuildSystem } from './build-core.class';


export class GradleBuild implements BuildCore {

    private static COMMAND_ALIASES: BuildCommandAliasMapperType = {
        'dev': 'quarkusDev',
        'remoteDev': 'quarkusRemoteDev',
        'test': 'test',
        'clean': 'clean',
        'build': 'build',
        'package': 'package',
        'addExtension': 'quarkusAddExtension',
        'listExtensions': 'quarkusListExtensions',
    }

    getBuildSystemType() {
        return BuildSystem.GRADLE;
    }

    getExecutable(ignoreWrapper: boolean) {
        const isWin = process.platform === "win32";
        if (ignoreWrapper)
            return 'gradle';
        return isWin ? 'gradlew.bat' : './gradlew';
    }

    getCommand(alias: BuildCommandAliasType) {
        return GradleBuild.COMMAND_ALIASES[alias];
    }

}