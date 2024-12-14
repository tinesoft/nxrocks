import { Tree } from '@nx/devkit';
import { PresetGeneratorSchema } from './schema';
import projectGenerator from '../project/generator';

export async function presetGenerator(
  tree: Tree,
  options: PresetGeneratorSchema
) {
  if (options.prjName) {
    options.directory = options.prjName;
    delete options['name']; // remove 'name' set from create-nx-workspace, where it refers to the workspace name and not project name
  }

  await projectGenerator(tree, options);
}

export default presetGenerator;
