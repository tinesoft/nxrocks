import { Tree, addProjectConfiguration, } from '@nrwl/devkit';
import { ProjectGeneratorOptions } from './schema';
import { normalizeOptions, generateBootProject, addBuilInfoTask, removeBootMavenPlugin, addFormattingWithSpotless, addMavenPublishPlugin, disableBootGradlePlugin } from './lib';
import { addPluginToNxJson, BuilderCommandAliasType, NX_SPRING_BOOT_PKG } from '@nxrocks/common';



export async function projectGenerator(tree: Tree, options: ProjectGeneratorOptions) {
  const normalizedOptions = normalizeOptions(tree, options);

  const targets = {};
  const commands: BuilderCommandAliasType[] = ['build', 'install', 'test', 'clean'];
  const appOnlyCommands = ['run', 'serve', 'build-image', 'build-info'];

  if (options.projectType === 'application') { //only 'application' projects should have 'boot' related commands
    commands.push(...appOnlyCommands);
  }

  if(!options.skipFormat) {
    commands.push('format', 'apply-format', 'check-format');
  }

  for (const command of commands) {
    targets[command] = {
      executor: `${NX_SPRING_BOOT_PKG}:${command}`,
      options: {
        root: normalizedOptions.projectRoot
      },
      ...(command === 'build' ? { dependsOn: ['^install'] } : {}),
      ...( ['build', 'install'].includes(command) ? {outputs: [`${normalizedOptions.projectRoot}/${normalizedOptions.buildSystem === 'maven-project' ? 'target' : 'build'}`]}: {})
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

  if(normalizedOptions.projectType === 'library') { // 'library' projects should not be "spring-boot- executable"
    if(normalizedOptions.buildSystem === 'gradle-project') {
      disableBootGradlePlugin(tree, normalizedOptions);
    }
    else if (normalizedOptions.buildSystem === 'maven-project') {
      removeBootMavenPlugin(tree, normalizedOptions);
    }
  }

  addMavenPublishPlugin(tree, normalizedOptions);

  if(!options.skipFormat) { //if skipFormat is true, then we don't want to add Spotless plugin
    addFormattingWithSpotless(tree, normalizedOptions);
  }
  
  addPluginToNxJson(NX_SPRING_BOOT_PKG,tree);
}

export default projectGenerator;