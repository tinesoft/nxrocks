import { Tree, addProjectConfiguration, } from '@nrwl/devkit';
import { ProjectGeneratorOptions } from './schema';
import { normalizeOptions, generateBootProject, addBuilInfoTask, addPluginToNxJson } from './lib';


export async function projectGenerator(tree: Tree, options: ProjectGeneratorOptions) {
  const normalizedOptions = normalizeOptions(tree,options);

  const targets = {};
  const commands = ['run', 'serve', 'test', 'clean', 'buildJar', 'buildWar', 'buildImage', 'buildInfo'];
  for (const command of commands) {
    targets[command] = {
      executor: `@nxrocks/nx-spring-boot:${command}`,
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

  await generateBootProject(tree, normalizedOptions);
  addBuilInfoTask(tree, normalizedOptions);
  addPluginToNxJson(tree);
}

export default projectGenerator;