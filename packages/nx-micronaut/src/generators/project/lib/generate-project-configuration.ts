import {
  Tree,
  addProjectConfiguration,
  joinPathFragments,
  logger,
} from '@nx/devkit';
import { NormalizedSchema } from '../schema';
import { isNxCrystalEnabled } from '@nxrocks/common-jvm';
import { getProjectTypeAndTargetsFromOptions } from '../../../utils/plugin-utils';

export function generateProjectConfiguration(
  tree: Tree,
  options: NormalizedSchema
) {
  logger.info(`⚙️ Generating project configuration...`);

  if (options.transformIntoMultiModule) {
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
    ...(!isNxCrystalEnabled()
      ? getProjectTypeAndTargetsFromOptions(options)
      : {}),
    tags: options.parsedTags,
  });
}
