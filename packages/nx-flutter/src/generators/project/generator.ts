import { Tree, addProjectConfiguration, } from '@nrwl/devkit';
import { addPluginToNxJson, NX_FLUTTER_PKG } from '@nxrocks/common';

import { isFlutterInstalled } from '../../utils/flutter-utils';
import { normalizeOptions, promptAdditionalOptions, generateFlutterProject } from './lib';
import { ProjectGeneratorOptions } from './schema';

export async function projectGenerator(tree:Tree, options: ProjectGeneratorOptions) {

  if (!isFlutterInstalled()) {
    throw new Error("'flutter' was not found on your system's PATH.\nPlease make sure you have installed it correctly.\n👉🏾 https://flutter.dev/docs/get-started/install");
  }

  const normalizedOptions = normalizeOptions(tree,options);

    if(options.interactive )
      await promptAdditionalOptions(tree,normalizedOptions);

    const targets = {};
    const commands = [
      { key: 'analyze', value: 'analyze' },
      { key: 'clean', value: 'clean' },
      { key: 'format', value: `format ${normalizedOptions.projectRoot}/*` },
      { key: 'test', value: 'test' },
    ];
    
    if(normalizedOptions.template === 'app'){
      commands.push(
        { key: 'assemble', value: 'assemble' },
        { key: 'attach', value: 'attach' },
        { key: 'drive', value: 'drive' },
        { key: 'genL10n', value: 'gen-l10n' },
        { key: 'install', value: 'install' },
        { key: 'run', value: 'run' },
      )
    }

    if(normalizedOptions.platforms?.indexOf('android') != -1) {
      commands.push(
        {key: 'buildAar', value: 'build aar'},
        {key: 'buildApk', value: 'build apk'},
        {key: 'buildAppbundle', value: 'build appbundle'},
        {key: 'buildBundle', value: 'build bundle'},
      )
    }

    if(normalizedOptions.platforms?.indexOf('ios') != -1) {
      commands.push(
        {key: 'buildIos', value: 'build ios'},
        {key: 'buildIosFramework', value: 'build ios-framework'},
        {key: 'buildIpa', value: 'build ipa'},
      )
    }
    
    for (const command of commands) {
      targets[command.key] = {
        executor: `@nrwl/workspace:run-commands`,
        options: {
          command: `flutter ${command.value}`,
          cwd: normalizedOptions.projectRoot
        }
      };
    }
    addProjectConfiguration(tree, normalizedOptions.projectName, {
      root: normalizedOptions.projectRoot,
      sourceRoot: `${normalizedOptions.projectRoot}/src`,
      projectType: normalizedOptions.template === 'app' ? 'application' : 'library',
      targets: targets,
      tags: normalizedOptions.parsedTags,
    });
   await generateFlutterProject(tree,normalizedOptions)
   addPluginToNxJson(NX_FLUTTER_PKG, tree);
}

export default projectGenerator;