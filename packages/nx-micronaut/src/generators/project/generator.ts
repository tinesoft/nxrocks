import { Tree, addProjectConfiguration, } from '@nrwl/devkit';
import { ProjectGeneratorOptions } from './schema';
import { normalizeOptions, generateMicronautProject } from './lib';
import { addPluginToNxJson, BuilderCommandAliasType, NX_MICRONAUT_PKG,  } from '@nxrocks/common';
import { addFormattingWithSpotless } from './lib/add-formatting-with-spotless';


export async function projectGenerator(tree: Tree, options: ProjectGeneratorOptions) {
  const normalizedOptions = normalizeOptions(tree,options);

  const targets = {};
  const commands:BuilderCommandAliasType[] = ['run', 'dockerfile', 'test', 'clean', 'format', 'build', 'aotConfigSample'];
  for (const command of commands) {
    targets[command] = {
      executor: `${NX_MICRONAUT_PKG}:${command}`,
      options: {
        root: normalizedOptions.projectRoot
      }
    };
  }
  addProjectConfiguration(tree, normalizedOptions.projectName, {
    root: normalizedOptions.projectRoot,
    sourceRoot: `${normalizedOptions.projectRoot}/src`,
    projectType: 'application',
    targets: targets,
    tags: normalizedOptions.parsedTags,
  });

  await generateMicronautProject(tree, normalizedOptions);

  addFormattingWithSpotless(tree, normalizedOptions);

  addPluginToNxJson(NX_MICRONAUT_PKG, tree);
}

export default projectGenerator;