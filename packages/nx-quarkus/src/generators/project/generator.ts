import { Tree, addProjectConfiguration, } from '@nrwl/devkit';
import { ProjectGeneratorOptions } from './schema';
import { normalizeOptions, generateQuarkusProject, addMavenPublishPlugin, addFormattingWithSpotless } from './lib';
import { addPluginToNxJson, BuilderCommandAliasType, NX_QUARKUS_PKG,  } from '@nxrocks/common';



export async function projectGenerator(tree: Tree, options: ProjectGeneratorOptions) {
  const normalizedOptions = normalizeOptions(tree,options);

  const targets = {};
  const commands:BuilderCommandAliasType[] = ['dev', 'remote-dev', 'test', 'clean', 'build', 'install', 'package', 'add-extension', 'list-extensions'];

  if(!options.skipFormat) {
    commands.push('format', 'format-check');
  }

  for (const command of commands) {
    targets[command] = {
      executor: `${NX_QUARKUS_PKG}:${command}`,
      options: {
        root: normalizedOptions.projectRoot
      },
      ...(command === 'build' ? { dependsOn: ['^install'] } : {}),
      ...( ['build', 'install'].includes(command) ? {outputs: [`${normalizedOptions.projectRoot}/${normalizedOptions.buildSystem === 'MAVEN' ? 'target' : 'build'}`]}: {})
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

  addMavenPublishPlugin(tree, normalizedOptions);

  if(!options.skipFormat) { //if skipFormat is true, then we don't want to add Spotless plugin
    addFormattingWithSpotless(tree, normalizedOptions);
  }

  addPluginToNxJson(NX_QUARKUS_PKG, tree);
}

export default projectGenerator;