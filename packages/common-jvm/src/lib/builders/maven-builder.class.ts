import { MAVEN_EXECUTABLE, MAVEN_WRAPPER_EXECUTABLE, MAVEN_WRAPPER_EXECUTABLE_LEGACY } from '../constants';
import {
  BuilderCommandAliasMapper,
  BuilderCommandAliasType,
  BuilderCore,
  BuildSystem,
} from './builder-core.interface';
import { basename, resolve } from 'path';
import { hasMavenModule, hasMavenWrapper } from '../utils/maven-utils';

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

  getCommand(alias: BuilderCommandAliasType, options: { cwd: string, ignoreWrapper?: boolean, runFromParentModule?: boolean}) {
    let additionalArgs = '';
    let cwd = options.cwd;

    if(!options.ignoreWrapper && !hasMavenWrapper(options.cwd) && !options.runFromParentModule){
      throw new Error(`⚠️ You chose not to use the Maven wrapper from the parent module, but no wrapper was found in current child module`);
    }
    
    if(options.runFromParentModule){
      let pathToModule:string[] = [];
      const childModuleName = basename(cwd);
      do {
        const module = basename(cwd);
        cwd = resolve(cwd, '..');
        pathToModule = [module, ...pathToModule];
      } while (!hasMavenModule(cwd, childModuleName));

      additionalArgs = `-f ${pathToModule.join('/')} `;
    }

    return {cwd, command: `${additionalArgs}${this.commandAliases[alias]}`};
  }
}
