import {
  Tree,
  logger,
  addProjectConfiguration,
  joinPathFragments,
} from '@nx/devkit';
import { NormalizedSchema } from '../schema';
import { isNxCrystalEnabled } from '@nxrocks/common';
import { getProjectTypeAndTargetsFromOptions } from '../../../utils/plugin-utils';

export function generateProjectConfiguration(
  tree: Tree,
  options: NormalizedSchema
) {
  logger.info(`⚙️ Generating project configuration...`);

  addProjectConfiguration(tree, options.projectName, {
    root: options.projectRoot,
    sourceRoot: joinPathFragments(options.projectRoot, 'src'),
    ...(!isNxCrystalEnabled()
      ? getProjectTypeAndTargetsFromOptions(options)
      : { targets: {} }),
    tags: options.parsedTags,
  });
}
