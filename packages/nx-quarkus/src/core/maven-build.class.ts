import { BuildCommandAliasType, BuildCommandAliasMapperType, BuildCore, BuildSystem } from './build-core.class';


export class MavenBuild implements BuildCore {

    private static COMMAND_ALIASES: BuildCommandAliasMapperType = {
        'dev': 'quarkus:dev',
        'remoteDev': 'quarkus:remote-dev',
        'test': 'test',
        'clean': 'clean',
        'build': 'build',
        'package': 'package',
        'addExtension': 'quarkus:add-extension',
        'listExtensions': 'quarkus:list-extensions',
    }

    getBuildSystemType() {
        return BuildSystem.MAVEN;
    }

    getExecutable(ignoreWrapper: boolean) {
        const isWin = process.platform === "win32";
        if (ignoreWrapper)
            return 'mvn';
        return isWin ? 'mvnw.cmd' : './mvnw';
    }

    getCommand(alias: BuildCommandAliasType) {
        return MavenBuild.COMMAND_ALIASES[alias];
    }

}