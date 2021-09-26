import { GRADLE_EXECUTABLE, GRADLE_WRAPPER_EXECUTABLE } from './constants';
import {
  BuilderCommandAliasMapper,
  BuilderCommandAliasType,
  BuilderCore,
  BuildSystem,
} from './builder-core.interface';

export class GradleBuilder implements BuilderCore {
  constructor(private commandAliases: BuilderCommandAliasMapper) {}

  getBuildSystemType() {
    return BuildSystem.GRADLE;
  }

  getExecutable(ignoreWrapper: boolean) {
    return ignoreWrapper ? GRADLE_EXECUTABLE : GRADLE_WRAPPER_EXECUTABLE;
  }

  getCommand(alias: BuilderCommandAliasType) {
    return this.commandAliases[alias];
  }
}
