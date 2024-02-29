import { Tree } from '@nx/devkit';
import { addPluginToNxJson } from '@nxrocks/common';

import {
  normalizeOptions,
  promptAdditionalOptions,
  generateFlutterProject,
  generateProjectConfiguration,
} from './lib';
import { ProjectGeneratorOptions } from './schema';
import { NX_FLUTTER_PKG } from '../../index';
import { normalizePluginOptions } from '../../graph/plugin';

export async function projectGenerator(
  tree: Tree,
  options: ProjectGeneratorOptions
) {
  const normalizedOptions = await normalizeOptions(tree, options);

  await promptAdditionalOptions(tree, normalizedOptions);

  generateProjectConfiguration(tree, normalizedOptions);

  await generateFlutterProject(tree, normalizedOptions);

  addPluginToNxJson(NX_FLUTTER_PKG, tree, normalizePluginOptions());
}

export default projectGenerator;
