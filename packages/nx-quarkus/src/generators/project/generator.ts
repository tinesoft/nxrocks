import { Tree, addProjectConfiguration, } from '@nrwl/devkit';
import { ProjectGeneratorOptions } from './schema';
import { normalizeOptions, generateQuarkusProject, addPluginToNxJson } from './lib';
import { BuildCommandAliasType } from '../../core/build-core.class';


export async function projectGenerator(tree: Tree, options: ProjectGeneratorOptions) {
  const normalizedOptions = normalizeOptions(tree,options);

  const targets = {};
  const commands:BuildCommandAliasType[] = ['dev', 'remoteDev', 'test', 'clean', 'build', 'package', 'addExtension', 'listExtensions'];
  for (const command of commands) {
    targets[command] = {
      executor: `@nxrocks/nx-quarkus:${command}`,
      options: {
        root: normalizedOptions.projectRoot
      }
    };
  }
  addProjectConfiguration(tree, normalizedOptions.projectName, {
    root: normalizedOptions.projectRoot,
    sourceRoot: `${normalizedOptions.projectRoot}/src`,
    projectType: options.projectType,
    targets: targets,
    tags: normalizedOptions.parsedTags,
  });

  await generateQuarkusProject(tree, normalizedOptions);
  addPluginToNxJson(tree);
}

export default projectGenerator;