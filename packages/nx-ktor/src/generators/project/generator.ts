import { Tree, addProjectConfiguration } from '@nx/devkit';
import { ProjectGeneratorOptions } from './schema';
import {
  normalizeOptions,
  generateKtorProject,
  addMavenPublishPlugin,
  addFormattingWithSpotless,
  promptKtorFeatures,
  addDockerfile,
} from './lib';
import {
  addPluginToNxJson,
  BuilderCommandAliasType,
  NX_KTOR_PKG,
} from '@nxrocks/common';

export async function projectGenerator(
  tree: Tree,
  options: ProjectGeneratorOptions
) {
  const normalizedOptions = normalizeOptions(tree, options);

  await promptKtorFeatures(normalizedOptions);

  const targets = {};
  const commands: BuilderCommandAliasType[] = [
    'run',
    'serve',
    'test',
    'clean',
    'build',
    'build-image',
    'publish-image',
    'publish-image-locally',
    'run-docker',
  ];

  if (!options.skipFormat) {
    commands.push('format', 'apply-format', 'check-format');
  }

  for (const command of commands) {
    targets[command] = {
      executor: `${NX_KTOR_PKG}:${command}`,
      options: {
        root: normalizedOptions.projectRoot,
      },
      ...(command === 'build' ? { dependsOn: ['^install'] } : {}),
      ...(['publish-image', 'publish-image-locally', 'run-docker'].includes(
        command
      )
        ? { dependsOn: ['build-image'] }
        : {}),
      ...(['build', 'build-image', 'install', 'test'].includes(command)
        ? {
            outputs: [
              `{workspaceRoot}/${normalizedOptions.projectRoot}/${
                normalizedOptions.buildSystem === 'MAVEN' ? 'target' : 'build'
              }`,
            ],
          }
        : {}),
    };
  }
  addProjectConfiguration(tree, normalizedOptions.projectName, {
    root: normalizedOptions.projectRoot,
    sourceRoot: `${normalizedOptions.projectRoot}/src`,
    projectType: 'application',
    targets: targets,
    tags: normalizedOptions.parsedTags,
  });

  await generateKtorProject(tree, normalizedOptions);

  addMavenPublishPlugin(tree, normalizedOptions);

  addDockerfile(tree, normalizedOptions);

  if (!options.skipFormat) {
    //if skipFormat is true, then we don't want to add Spotless plugin
    addFormattingWithSpotless(tree, normalizedOptions);
  }

  addPluginToNxJson(NX_KTOR_PKG, tree);
}

export default projectGenerator;
