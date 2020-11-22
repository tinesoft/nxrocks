import {
  chain,
  Rule,
} from '@angular-devkit/schematics';
import {
  addProjectToNxJsonInTree,
  ProjectType,
  updateWorkspace,
} from '@nrwl/workspace';
import { isFlutterInstalled } from '../../utils/flutter-utils';
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
        { key: 'assemble', value: 'assemble' },
        { key: 'attach', value: 'attach' },

        //build commands
        {key: 'buildApk', value: 'build apk'},
        {key: 'buildAppbundle', value: 'build appbundle'},
        {key: 'buildBundle', value: 'build bundle'},
        {key: 'buildIos', value: 'build ios'},
        {key: 'buildIosFramework', value: 'build ios-framework'},
        {key: 'buildIpa', value: 'build ipa'},
        
        { key: 'clean', value: 'clean' },
        { key: 'drive', value: 'drive' },
        { key: 'format', value: `format ${normalizedOptions.projectRoot}/*` },
        { key: 'genL10n', value: 'gen-l10n' },
        { key: 'install', value: 'install' },
        { key: 'run', value: 'run' },
        { key: 'test', value: 'test' },
      ];

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
