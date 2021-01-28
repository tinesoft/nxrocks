

export type BuildCommandAliasType = 'run' | 'test' | 'clean' | 'buildJar' | 'buildWar' | 'buildImage' | 'buildInfo';

export type BuildCommandAliasMapperType  =  { [ key in  BuildCommandAliasType ]: string; };

export enum BuildSystem {
    MAVEN,
    GRADLE
}

export interface BuildCore {

    getBuildSystemType();

    getExecutable();

    getCommand(alias: BuildCommandAliasType): string;

}