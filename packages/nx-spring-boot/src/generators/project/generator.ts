import { Tree } from '@nx/devkit';
import { ProjectGeneratorOptions } from './schema';
import {
  normalizeOptions,
  generateBootProject,
  addBuilInfoTask,
  removeBootMavenPlugin,
  addFormattingWithSpotless,
  addMavenPublishPlugin,
  disableBootGradlePlugin,
  promptBootDependencies,
  promptForMultiModuleSupport,
  generateProjectConfiguration,
  createLibraryFiles,
  removeBootBuildImageGradleTask,
} from './lib';
import { NX_SPRING_BOOT_PKG } from '../../index';
import { normalizePluginOptions } from '../../graph/plugin';
import { addPluginToNxJson } from '@nxrocks/common-jvm';

export async function projectGenerator(
  tree: Tree,
  options: ProjectGeneratorOptions
) {
  const normalizedOptions = await normalizeOptions(tree, options);

  await promptBootDependencies(normalizedOptions);

  await promptForMultiModuleSupport(tree, normalizedOptions);

  generateProjectConfiguration(tree, normalizedOptions);

  await generateBootProject(tree, normalizedOptions);

  addBuilInfoTask(tree, normalizedOptions);

  if (normalizedOptions.projectType === 'library') {
    // 'library' projects should not be "spring-boot- executable"
    if (normalizedOptions.buildSystem === 'maven-project') {
      removeBootMavenPlugin(tree, normalizedOptions);
    } else {
      disableBootGradlePlugin(tree, normalizedOptions);

      removeBootBuildImageGradleTask(tree, normalizedOptions);
    }

    createLibraryFiles(tree, normalizedOptions);
  }

  addMavenPublishPlugin(tree, normalizedOptions);

  if (!options.skipFormat) {
    //if skipFormat is true, then we don't want to add Spotless plugin
    addFormattingWithSpotless(tree, normalizedOptions);
  }

  const defaultPluginOptions = normalizePluginOptions();
  addPluginToNxJson(
    NX_SPRING_BOOT_PKG,
    tree,
    defaultPluginOptions,
    defaultPluginOptions.installTargetName
  );
}

export default projectGenerator;
