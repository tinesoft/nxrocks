import { Tree, addProjectConfiguration, } from '@nrwl/devkit';
import { ProjectGeneratorOptions } from './schema';
import { normalizeOptions, generateBootProject, addBuilInfoTask, disableBootJarTask, removeBootMavenPlugin } from './lib';
import { addPluginToNxJson, NX_SPRING_BOOT_PKG } from '@nxrocks/common';


export async function projectGenerator(tree: Tree, options: ProjectGeneratorOptions) {
  const normalizedOptions = normalizeOptions(tree, options);

  const targets = {};
  const commands = ['test', 'clean'];
  const bootOnlyCommands = ['run', 'serve', 'buildJar', 'buildWar', 'buildImage', 'buildInfo'];

  if (options.projectType === 'application') { //only 'application' projects should have 'boot' related commands
    commands.push(...bootOnlyCommands);
  }

  for (const command of commands) {
    targets[command] = {
      executor: `${NX_SPRING_BOOT_PKG}:${command}`,
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

  disableBootJarTask(tree, normalizedOptions);
  removeBootMavenPlugin(tree, normalizedOptions);

  addPluginToNxJson(NX_SPRING_BOOT_PKG,tree);
}

export default projectGenerator;