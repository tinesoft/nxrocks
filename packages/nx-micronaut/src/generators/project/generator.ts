import { Tree } from '@nx/devkit';
import { ProjectGeneratorOptions } from './schema';
import {
  normalizeOptions,
  generateMicronautProject,
  addMavenPublishPlugin,
  addFormattingWithSpotless,
  promptMicronautFeatures,
  generateProjectConfiguration,
  promptForMultiModuleSupport,
} from './lib';
import { NX_MICRONAUT_PKG } from '../../index';
import {
  addPluginToNxJson,
} from '@nxrocks/common-jvm';

export async function projectGenerator(
  tree: Tree,
  options: ProjectGeneratorOptions
) {
  const normalizedOptions = normalizeOptions(tree, options);

  await promptMicronautFeatures(normalizedOptions);

  await promptForMultiModuleSupport(tree, normalizedOptions);

  await generateProjectConfiguration(tree, normalizedOptions);
  
  await generateMicronautProject(tree, normalizedOptions);

  addMavenPublishPlugin(tree, normalizedOptions);

  if (!options.skipFormat) {
    //if skipFormat is true, then we don't want to add Spotless plugin
    addFormattingWithSpotless(tree, normalizedOptions);
  }

  addPluginToNxJson(NX_MICRONAUT_PKG, tree);
}

export default projectGenerator;
