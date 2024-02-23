import { Tree, addProjectConfiguration, joinPathFragments, logger } from '@nx/devkit';
import { NormalizedSchema } from '../schema';
import { NX_KTOR_PKG } from '../../../index';
import {
  BuilderCommandAliasType,
} from '@nxrocks/common-jvm';

export async function generateProjectConfiguration(
  tree: Tree,
  options: NormalizedSchema
): Promise<void> {

  logger.info(
    `⚙️ Generating project configuration...`
  );

  const commands: BuilderCommandAliasType[] = [
    'build',
    'test',
    'clean',
  ];

  if (!options.skipFormat) {
    commands.push('format', 'apply-format', 'check-format');
  }

  const ktorOnlyCommands = [ 
    'run',
    'serve',
    'build-image',
    'publish-image',
    'publish-image-locally',
    'run-docker',
  ];
  commands.push(...ktorOnlyCommands);
  

  const getTargets = (commands: string[], rootFolder:string, runFromParentModule?:boolean) => {
    const targets = {};
    for (const command of commands) {
      targets[command] = {
        executor: `${NX_KTOR_PKG}:${command}`,
        options: {
          root: rootFolder,
          ...(runFromParentModule? { runFromParentModule } : {}),
        },
        ...(['build', 'install', 'run', 'serve'].includes(command) ? { dependsOn: ['^install'] } : {}),
        ...(['publish-image', 'publish-image-locally', 'run-docker'].includes(
          command
        )
          ? { dependsOn: ['build-image'] }
          : {}),
        ...(['build', 'build-image', 'install', 'test'].includes(command)
          ? {
              outputs: [
                joinPathFragments('{workspaceRoot}', rootFolder,  options.buildSystem === 'MAVEN' ? 'target' : 'build')
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
      projectType: 'application',
      targets: {},
      tags: options.parsedTags,
    });
  }

  addProjectConfiguration(tree, options.projectName, {
    root: options.projectRoot,
    sourceRoot: joinPathFragments(options.projectRoot, 'src'),
    projectType: 'application',
    targets: getTargets(commands, options.projectRoot, !options.keepProjectLevelWrapper),
    tags: options.parsedTags,
  });
}
