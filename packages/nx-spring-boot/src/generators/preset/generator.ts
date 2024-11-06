import { Tree } from '@nx/devkit';
import { PresetGeneratorSchema } from './schema';
import projectGenerator from '../project/generator';

export async function presetGenerator(
  tree: Tree,
  options: PresetGeneratorSchema
) {
  const { prjName } = options;

  await projectGenerator(tree, {
    ...options,
    name: prjName,
    directory: options.directory ?? prjName,
  });
}

export default presetGenerator;
