import { Tree } from '@nx/devkit';
import { ProjectGeneratorOptions } from './schema';
import {
  normalizeOptions,
  generateQuarkusProject,
  addMavenPublishPlugin,
  addFormattingWithSpotless,
  promptQuarkusExtensions,
  generateProjectConfiguration,
  promptForMultiModuleSupport,
} from './lib';
import { NX_QUARKUS_PKG } from '../../index';
import { normalizePluginOptions } from '../../graph/plugin';

import { addPluginToNxJson } from '@nxrocks/common-jvm';

export async function projectGenerator(
  tree: Tree,
  options: ProjectGeneratorOptions
) {
  const normalizedOptions = await normalizeOptions(tree, options);

  await promptQuarkusExtensions(normalizedOptions);

  await promptForMultiModuleSupport(tree, normalizedOptions);

  generateProjectConfiguration(tree, normalizedOptions);

  await generateQuarkusProject(tree, normalizedOptions);

  addMavenPublishPlugin(tree, normalizedOptions);

  if (!options.skipFormat) {
    //if skipFormat is true, then we don't want to add Spotless plugin
    addFormattingWithSpotless(tree, normalizedOptions);
  }

  const defaultPluginOptions = normalizePluginOptions();
  addPluginToNxJson(
    NX_QUARKUS_PKG,
    tree,
    defaultPluginOptions,
    defaultPluginOptions.installTargetName
  );
}

export default projectGenerator;
