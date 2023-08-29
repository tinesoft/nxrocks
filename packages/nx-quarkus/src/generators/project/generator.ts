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
import {
  addPluginToNxJson,
  NX_QUARKUS_PKG,
} from '@nxrocks/common';

export async function projectGenerator(
  tree: Tree,
  options: ProjectGeneratorOptions
) {
  const normalizedOptions = normalizeOptions(tree, options);

  await promptQuarkusExtensions(normalizedOptions);

  await promptForMultiModuleSupport(tree, normalizedOptions);

  await generateProjectConfiguration(tree, normalizedOptions);
  
  await generateQuarkusProject(tree, normalizedOptions);

  addMavenPublishPlugin(tree, normalizedOptions);

  if (!options.skipFormat) {
    //if skipFormat is true, then we don't want to add Spotless plugin
    addFormattingWithSpotless(tree, normalizedOptions);
  }

  addPluginToNxJson(NX_QUARKUS_PKG, tree);
}

export default projectGenerator;
