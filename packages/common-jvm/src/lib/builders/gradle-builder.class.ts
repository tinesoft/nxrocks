import { GRADLE_EXECUTABLE, GRADLE_WRAPPER_EXECUTABLE } from '../constants';
import {
  BuilderCommandAliasMapper,
  BuilderCommandAliasType,
  BuilderCore,
  BuildSystem,
} from './builder-core.interface';
import { hasGradleModule, hasGradleWrapper, hasGradleProject } from '../utils';
import { basename, resolve } from 'path';
import { workspaceRoot } from '@nx/devkit';

export class GradleBuilder implements BuilderCore {
  constructor(private commandAliases: BuilderCommandAliasMapper) {}

  getBuildSystemType() {
    return BuildSystem.GRADLE;
  }

  getExecutable(ignoreWrapper: boolean, useLegacyWrapper = false) {
    return ignoreWrapper ? GRADLE_EXECUTABLE : GRADLE_WRAPPER_EXECUTABLE;
  }

  getCommand(
    alias: BuilderCommandAliasType,
    options: {
      cwd: string;
      ignoreWrapper?: boolean;
      runFromParentModule?: boolean;
    }
  ) {
    let additionalArgs = '';
    let cwd = options.cwd;

    if (
      !options.ignoreWrapper &&
      !hasGradleWrapper(options.cwd) &&
      !options.runFromParentModule
    ) {
      throw new Error(
        `⚠️ You chose not to use the Gradle wrapper from the parent module, but no wrapper was found in current child module`
      );
    }

    let pathToModule: string[] = [];
    if (options.runFromParentModule) {
      const childModuleName = basename(cwd);
      do {
        const module = basename(cwd);
        cwd = resolve(cwd, '..');
        pathToModule = [module, ...pathToModule];
      } while (!hasGradleModule(cwd, childModuleName) && cwd !== workspaceRoot);

      additionalArgs = `${pathToModule.join(':')}`;
    }

    return {
      cwd,
      command: `${additionalArgs}${pathToModule.length ? ':' : ''}${
        this.commandAliases[alias]
      }`,
    };
  }
}
