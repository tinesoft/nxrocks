import { Tree, addProjectConfiguration, } from '@nrwl/devkit';
import { ProjectGeneratorOptions } from './schema';
import { normalizeOptions, generateMicronautProject, addMavenPublishPlugin, addFormattingWithSpotless } from './lib';
import { addPluginToNxJson, BuilderCommandAliasType, NX_MICRONAUT_PKG,  } from '@nxrocks/common';


export async function projectGenerator(tree: Tree, options: ProjectGeneratorOptions) {
  const normalizedOptions = normalizeOptions(tree,options);

  const targets = {};
  const commands:BuilderCommandAliasType[] = ['run', 'serve', 'dockerfile', 'test', 'clean','build', 'aot-sample-config'];

  if(!options.skipFormat) {
    commands.push('format', 'apply-format', 'check-format');
  }

  for (const command of commands) {
    targets[command] = {
      executor: `${NX_MICRONAUT_PKG}:${command}`,
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
    projectType: 'application',
    targets: targets,
    tags: normalizedOptions.parsedTags,
  });

  await generateMicronautProject(tree, normalizedOptions);

  addMavenPublishPlugin(tree, normalizedOptions);

  if(!options.skipFormat) { //if skipFormat is true, then we don't want to add Spotless plugin
    addFormattingWithSpotless(tree, normalizedOptions);
  }

  addPluginToNxJson(NX_MICRONAUT_PKG, tree);
}

export default projectGenerator;