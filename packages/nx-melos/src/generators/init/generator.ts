import { Tree, formatFiles} from '@nrwl/devkit';
import { addPluginToNxJson, NX_MELOS_PKG } from '@nxrocks/common';
import { installMelosPackageGlobally, generateMelosConfigurationFile, addMelosScriptsToPackageJson } from './lib';
import { InitGeneratorOptions } from './schema';

export async function initGenerator(tree:Tree, options: InitGeneratorOptions) {

  await installMelosPackageGlobally();
  await generateMelosConfigurationFile(tree);
  addMelosScriptsToPackageJson(tree, options);
  addPluginToNxJson(NX_MELOS_PKG, tree);
  await formatFiles(tree);
}

export default initGenerator;