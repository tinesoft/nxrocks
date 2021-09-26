/**
 * Type of JVM Build System.
 */
export enum BuildSystem {
  MAVEN,
  GRADLE,
}

/**
 * Class defining the mapping between a command alias and the actual command to run.
 */
export interface BuilderCommandAliasMapper {
  [key: string]: string;
}

/**
 * Base interface for build systems.
 */
export interface BuilderCore {
  getBuildSystemType();

  getExecutable(ignoreWrapper: boolean);

  getCommand(alias: BuilderCommandAliasType): string;
}

export type BuilderCommandAliasType = keyof BuilderCommandAliasMapper;
