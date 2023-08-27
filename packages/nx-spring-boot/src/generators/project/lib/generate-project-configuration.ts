import { Tree, addProjectConfiguration, logger } from '@nx/devkit';
import { NormalizedSchema } from '../schema';
import {
  BuilderCommandAliasType,
  NX_SPRING_BOOT_PKG,
} from '@nxrocks/common';

export async function generateProjectConfiguration(
  tree: Tree,
  options: NormalizedSchema
): Promise<void> {

  logger.info(
    `⚙️ Generating project configuration...`
  );

  const commands: BuilderCommandAliasType[] = [
    'build',
    'install',
    'test',
    'clean',
  ];

  if (!options.skipFormat) {
    commands.push('format', 'apply-format', 'check-format');
  }

  const parentModuleCommands = [...commands];

  const appOnlyCommands = ['run', 'serve', 'build-image', 'build-info'];
  if (options.projectType === 'application') {
    //only 'application' projects should have 'boot' related commands
    commands.push(...appOnlyCommands);
  }

  const getTargets = (commands: string[], rootFolder:string, runFromParentModule?:boolean) => {
    const targets = {};
    for (const command of commands) {
      targets[command] = {
        executor: `${NX_SPRING_BOOT_PKG}:${command}`,
        options: {
          root: rootFolder,
          ...(runFromParentModule? { runFromParentModule } : {}),
        },
        ...(command === 'build' ? { dependsOn: ['^install'] } : {}),
        ...(['build', 'build-image', 'install', 'test'].includes(command)
          ? {
              outputs: [
                `{workspaceRoot}/${rootFolder}/${
                  options.buildSystem === 'maven-project'
                    ? 'target'
                    : 'build'
                }`,
              ],
            }
          : {}),
      };
    }
    return targets;
  }

  if(options.transformIntoMultiModule){

    addProjectConfiguration(tree, options.parentModuleName, {
      root: options.moduleRoot,
      sourceRoot: `${options.moduleRoot}`,
      projectType: options.projectType,
      targets: getTargets(parentModuleCommands, options.moduleRoot, false),
      tags: options.parsedTags,
    });
  }

  addProjectConfiguration(tree, options.projectName, {
    root: options.projectRoot,
    sourceRoot: `${options.projectRoot}/src`,
    projectType: options.projectType,
    targets: getTargets(commands, options.projectRoot, !options.keepProjectLevelWrapper),
    tags: options.parsedTags,
  });
}
