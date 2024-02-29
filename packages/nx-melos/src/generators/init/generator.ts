import { Tree, formatFiles } from '@nx/devkit';
import { addPluginToNxJson } from '@nxrocks/common';
import { NX_MELOS_PKG } from '../../index';
import {
  installMelosPackageGlobally,
  generateMelosConfigurationFile,
  addMelosScriptsToPackageJson,
} from './lib';
import { InitGeneratorOptions } from './schema';

export async function initGenerator(tree: Tree, options: InitGeneratorOptions) {
  await installMelosPackageGlobally();
  await generateMelosConfigurationFile(tree);
  addMelosScriptsToPackageJson(tree, options);
  addPluginToNxJson(NX_MELOS_PKG, tree, null);
  await formatFiles(tree);
}

export default initGenerator;
