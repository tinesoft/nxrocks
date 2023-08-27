import { GRADLE_EXECUTABLE, GRADLE_WRAPPER_EXECUTABLE } from './constants';
import {
  BuilderCommandAliasMapper,
  BuilderCommandAliasType,
  BuilderCore,
  BuildSystem,
} from './builder-core.interface';
import { hasGradleModule, hasGradleWrapper } from './gradle-utils';
import { basename, resolve } from 'path';

export class GradleBuilder implements BuilderCore {
  constructor(private commandAliases: BuilderCommandAliasMapper) { }

  getBuildSystemType() {
    return BuildSystem.GRADLE;
  }

  getExecutable(ignoreWrapper: boolean, useLegacyWrapper = false) {
    return ignoreWrapper ? GRADLE_EXECUTABLE : GRADLE_WRAPPER_EXECUTABLE;
  }

  getCommand(alias: BuilderCommandAliasType, options: { cwd: string, ignoreWrapper?: boolean, runFromParentModule?: boolean }) {
    let additionalArgs = '';
    let cwd = options.cwd;

    if (!options.ignoreWrapper && !hasGradleWrapper(options.cwd) && !options.runFromParentModule) {
      throw new Error(`⚠️ You chose not to use the Gradle wrapper from the parent module, but no wrapper was found in current child module`);
    }
    
    if (options.runFromParentModule) {
      let pathToModule = [];
      const childModuleName = basename(options.cwd);
      do {
        const module = basename(options.cwd);
        pathToModule = [...pathToModule, module];
        cwd = resolve(cwd, '..');
      } while (!hasGradleModule(cwd, childModuleName));

      additionalArgs = `:${pathToModule.join(':')}:`;
    }

    return { cwd, command: `${additionalArgs}${this.commandAliases[alias]}` };
  }
}
