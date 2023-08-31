import { Tree, addProjectConfiguration } from '@nx/devkit';
import { ProjectGeneratorOptions } from './schema';
import {
  normalizeOptions,
  generateKtorProject,
  addMavenPublishPlugin,
  addFormattingWithSpotless,
  promptKtorFeatures,
  addDockerfile,
  promptForMultiModuleSupport,
  generateProjectConfiguration,
} from './lib';
import {
  addPluginToNxJson,
  BuilderCommandAliasType,
  NX_KTOR_PKG,
} from '@nxrocks/common';

export async function projectGenerator(
  tree: Tree,
  options: ProjectGeneratorOptions
) {
  const normalizedOptions = normalizeOptions(tree, options);

  await promptKtorFeatures(normalizedOptions);

  await promptForMultiModuleSupport(tree, normalizedOptions);

  await generateProjectConfiguration(tree, normalizedOptions);

  await generateKtorProject(tree, normalizedOptions);

  addMavenPublishPlugin(tree, normalizedOptions);

  addDockerfile(tree, normalizedOptions);

  if (!options.skipFormat) {
    //if skipFormat is true, then we don't want to add Spotless plugin
    addFormattingWithSpotless(tree, normalizedOptions);
  }

  addPluginToNxJson(NX_KTOR_PKG, tree);
}

export default projectGenerator;
