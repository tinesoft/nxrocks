import { Tree, addProjectConfiguration, } from '@nrwl/devkit';
import { ApplicationGeneratorOptions } from './schema';
import { normalizeOptions, generateBootProject, restoreExecutePermission, addBuilInfoTask } from './lib';

/**
 * Depending on your needs, you can change this to either `Library` or `Application`
 */
const projectType = 'application';


export async function applicationGenerator(tree: Tree, options: ApplicationGeneratorOptions) {
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
    projectType: projectType,
    targets: targets,
    tags: normalizedOptions.parsedTags,
  });

  await generateBootProject(tree, normalizedOptions);
  restoreExecutePermission(tree, normalizedOptions);
  addBuilInfoTask(tree, normalizedOptions);

}

export default applicationGenerator;