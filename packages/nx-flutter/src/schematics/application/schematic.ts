import {
  noop,
  chain,
  Rule,
} from '@angular-devkit/schematics';
import {
  addProjectToNxJsonInTree,
  ProjectType,
  updateWorkspace,
} from '@nrwl/workspace';
import { isFlutterInstalled } from '../../utils/flutter-utils';
import { promptAdditionalOptions } from './lib/prompt-options';
import { generateProject } from './lib/generate-project';
import { normalizeOptions } from './lib/normalize-options';
import { ApplicationSchematicSchema } from './schema';

/**
 * Depending on your needs, you can change this to either `Library` or `Application`
 */
const projectType = ProjectType.Application;

export default function (options: ApplicationSchematicSchema): Rule {

  if (!isFlutterInstalled()) {
    throw new Error("'flutter' was not found on your system's PATH.\nPlease make sure you have installed it correctly.\n👉🏾 https://flutter.dev/docs/get-started/install");
  }

  const normalizedOptions = normalizeOptions(options);
  return chain([
    options.interactive ? promptAdditionalOptions(normalizedOptions): noop(),
    updateWorkspace((workspace) => {
      const project = workspace.projects
        .add({
          name: normalizedOptions.projectName,
          root: normalizedOptions.projectRoot,
          sourceRoot: `${normalizedOptions.projectRoot}/src`,
          projectType,
        });

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

      if(normalizedOptions.platforms.indexOf('android') != -1) {
        commands.push(
          {key: 'buildApk', value: 'build apk'},
          {key: 'buildAppbundle', value: 'build appbundle'},
          {key: 'buildBundle', value: 'build bundle'},
        )
      }

      if(normalizedOptions.platforms.indexOf('ios') != -1) {
        commands.push(
          {key: 'buildIos', value: 'build ios'},
          {key: 'buildIosFramework', value: 'build ios-framework'},
          {key: 'buildIpa', value: 'build ipa'},
        )
      }

      commands.forEach(e => {
        project.targets.add({
          name: `${e.key}`,
          builder: '@nrwl/workspace:run-commands',
          options: {
            command: `flutter ${e.value}`,
            cwd : normalizedOptions.projectRoot
          }
        });
      });
    }),
    addProjectToNxJsonInTree(normalizedOptions.projectName, {
      tags: normalizedOptions.parsedTags,
    }),
    generateProject(normalizedOptions)
  ]);
}
