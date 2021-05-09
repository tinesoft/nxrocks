

export type BuildCommandAliasType = 'dev' | 'remoteDev' | 'test' | 'clean' | 'build' | 'package' | 'addExtension' | 'listExtensions';

export type BuildCommandAliasMapperType = { [key in BuildCommandAliasType]: string; };

export enum BuildSystem {
    MAVEN,
    GRADLE
}

export interface BuildCore {

    getBuildSystemType();

    getExecutable(ignoreWrapper: boolean);

    getCommand(alias: BuildCommandAliasType): string;

}