import { Tree } from '@nx/devkit';
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
} from '@nxrocks/common-jvm';
import { NX_KTOR_PKG } from '../../index';

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

  addPluginToNxJson(NX_KTOR_PKG, tree, 'install');
}

export default projectGenerator;
