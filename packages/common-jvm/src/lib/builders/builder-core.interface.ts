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
  getBuildSystemType(): BuildSystem;

  getExecutable(ignoreWrapper: boolean, useLegacyWrapper: boolean): string;

  getCommand(alias: BuilderCommandAliasType, options: { cwd: string, ignoreWrapper?: boolean, runFromParentModule?: boolean}): {cwd: string, command: string};
}

export type BuilderCommandAliasType = keyof BuilderCommandAliasMapper & string; // enforce that the key is a string (default result of keyof would be string|number)
