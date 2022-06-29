import { MAVEN_EXECUTABLE, MAVEN_WRAPPER_EXECUTABLE, MAVEN_WRAPPER_EXECUTABLE_LEGACY } from './constants';
import {
  BuilderCommandAliasMapper,
  BuilderCommandAliasType,
  BuilderCore,
  BuildSystem,
} from './builder-core.interface';

export class MavenBuilder implements BuilderCore {
  constructor(private commandAliases: BuilderCommandAliasMapper) {}

  getBuildSystemType() {
    return BuildSystem.MAVEN;
  }

  getExecutable(ignoreWrapper: boolean, useLegacyWrapper = false) {
    if(ignoreWrapper)
      return  MAVEN_EXECUTABLE;
    else 
      return useLegacyWrapper ? MAVEN_WRAPPER_EXECUTABLE_LEGACY : MAVEN_WRAPPER_EXECUTABLE;
  }

  getCommand(alias: BuilderCommandAliasType) {
    return this.commandAliases[alias];
  }
}
