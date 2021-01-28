

export type BuildCommandAliasType = 'run' | 'test' | 'clean' | 'buildJar' | 'buildWar' | 'buildImage' | 'buildInfo';

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