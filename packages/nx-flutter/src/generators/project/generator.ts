import { Tree, addProjectConfiguration, joinPathFragments } from '@nx/devkit';
import { addPluginToNxJson } from '@nxrocks/common';

import {
  normalizeOptions,
  promptAdditionalOptions,
  generateFlutterProject,
} from './lib';
import { ProjectGeneratorOptions } from './schema';
import { NX_FLUTTER_PKG } from '../../index';

export async function projectGenerator(
  tree: Tree,
  options: ProjectGeneratorOptions
) {
  const normalizedOptions = await normalizeOptions(tree, options);

  await promptAdditionalOptions(tree, normalizedOptions);

  const targets = {};
  const commands = [
    { key: 'analyze', value: 'analyze' },
    { key: 'clean', value: 'clean' },
    { key: 'format', value: `format ${joinPathFragments(normalizedOptions.projectRoot, '*')}` },
    { key: 'test', value: 'test' },
    { key: 'test', value: 'test' },
    { key: 'doctor', value: 'doctor' },
  ];

  if (normalizedOptions.template === 'app') {
    commands.push(
      { key: 'assemble', value: 'assemble' },
      { key: 'attach', value: 'attach' },
      { key: 'drive', value: 'drive' },
      { key: 'gen-l10n', value: 'gen-l10n' },
      { key: 'install', value: 'install' },
      { key: 'run', value: 'run' }
    );
  }

  if (normalizedOptions.platforms?.indexOf('android') != -1) {
    commands.push(
      { key: 'build-aar', value: 'build aar' },
      { key: 'build-apk', value: 'build apk' },
      { key: 'build-appbundle', value: 'build appbundle' },
      { key: 'build-bundle', value: 'build bundle' }
    );
  }

  if (normalizedOptions.platforms?.indexOf('ios') != -1) {
    commands.push(
      { key: 'build-ios', value: 'build ios' },
      { key: 'build-ios-framework', value: 'build ios-framework' },
      { key: 'build-ipa', value: 'build ipa' }
    );
  }

  for (const command of commands) {
    targets[command.key] = {
      executor: `nx:run-commands`,
      options: {
        command: `${normalizedOptions.useFvm === true ? 'fvm ' : ''}${command.key === 'format' ? 'dart' : 'flutter'} ${
          command.value
        }`,
        cwd: normalizedOptions.projectRoot,
      },
      ...(command.key.startsWith('build-')
        ? {
            outputs: [joinPathFragments('{workspaceRoot}', normalizedOptions.projectRoot, 'build')],
          }
        : {}),
    };
  }
  addProjectConfiguration(tree, normalizedOptions.projectName, {
    root: normalizedOptions.projectRoot,
    sourceRoot: joinPathFragments(normalizedOptions.projectRoot, 'src'),
    projectType:
      normalizedOptions.template === 'app' ? 'application' : 'library',
    targets: targets,
    tags: normalizedOptions.parsedTags,
  });

  await generateFlutterProject(tree, normalizedOptions);
  addPluginToNxJson(NX_FLUTTER_PKG, tree);
}

export default projectGenerator;
