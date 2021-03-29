import { Tree, logger, readProjectConfiguration } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

import each from 'jest-each';

import { applicationGenerator } from './generator';
import { ApplicationGeneratorOptions } from './schema';

jest.mock('child_process'); // we need to mock 'execSync' so that it doesn't really run 'flutter' (reserved to e2e testing) (see __mocks__/child_process.js)

jest.mock('inquirer'); // we mock 'inquirer' to bypass the interactive prompt
import * as inquirer from 'inquirer';


const appCommands = [
  { key: 'assemble', value: 'assemble' },
  { key: 'attach', value: 'attach' },
  { key: 'drive', value: 'drive' },
  { key: 'genL10n', value: 'gen-l10n' },
  { key: 'install', value: 'install' },
  { key: 'run', value: 'run' },
];

const pluginOrModOnlyCommands = [
  { key: 'buildAar', value: 'build aar' },
];

const androidOnlyCommands = [
  { key: 'buildAar', value: 'build aar' },
  { key: 'buildApk', value: 'build apk' },
  { key: 'buildAppbundle', value: 'build appbundle' },
  { key: 'buildBundle', value: 'build bundle' },
];

const iOsOnlyCommands = [
  { key: 'buildIos', value: 'build ios' },
  { key: 'buildIosFramework', value: 'build ios-framework' },
  { key: 'buildIpa', value: 'build ipa' },
];

describe('application generator', () => {
  let tree: Tree;
  const options: ApplicationGeneratorOptions = {
    name: 'testapp',
    template: 'app',
    platforms: ['android', 'ios', 'web', 'linux', 'windows', 'macos'],
    interactive: true
  };


  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();

    jest.spyOn(inquirer, 'prompt').mockResolvedValue({
      platforms: options.platforms,
      androidLanguage: 'kotlin',
      iosLanguage: 'swift'
    });
    jest.spyOn(logger, 'info');
  });

  afterEach(() => {
    jest.resetAllMocks();
  }
  );

  it('should update workspace.json', async () => {

    await applicationGenerator(tree, options);
    const project = readProjectConfiguration(tree, options.name);
    expect(project.root).toBe(`apps/${options.name}`);

    const commonCommands = [
      { key: 'analyze', value: 'analyze' },
      { key: 'clean', value: 'clean' },
      { key: 'format', value: `format ${project.root}/*` },
      { key: 'test', value: 'test' },
    ];

    const commands = [...commonCommands, ...appCommands, ...pluginOrModOnlyCommands, ...androidOnlyCommands, ...iOsOnlyCommands];
    commands.forEach(e => {
      expect(project.targets[e.key].executor).toBe('@nrwl/workspace:run-commands');
      expect(project.targets[e.key].options.command).toBe(`flutter ${e.value}`);
    });
  });

  each`
    template    | shouldPromptTempate
    ${'app'}    | ${true}
    ${'plugin'} | ${true}
    ${'package'}| ${false}
    ${'module'} | ${false}
    `.it('should prompt user to select "platforms" when generating "$template": $shouldPromptTempate', async ({ template, shouldPromptTempate }) => {

    await applicationGenerator(tree, { ...options, template: template });

    expect(inquirer.prompt).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          when: shouldPromptTempate,
          name: 'platforms',
          type: 'checkbox',
          choices: expect.arrayContaining([
            {
              value: "android",
              name: "Android platform",
              checked: true,
            },
            {
              value: "ios",
              name: "iOS platform",
              checked: true,
            },
            {
              value: "linux",
              name: "Linux platform",
              checked: true,
            },
            {
              value: "windows",
              name: "Windows platform",
              checked: true,
            },
            {
              value: "macos",
              name: "MacOS platform",
              checked: true,
            },
            {
              value: "web",
              name: "Web platform",
              checked: true,
            }
          ]),
        }),
        expect.objectContaining({
          name: 'androidLanguage',
          type: 'list',
          default: 'kotlin',
          choices: expect.arrayContaining([
            {
              value: "java",
              name: "Java"
            },
            {
              value: "kotlin",
              name: "Kotlin"
            }
          ]),
          message: "Which Android language would you like to use?",
        }),
        expect.objectContaining({
          name: 'iosLanguage',
          type: 'list',
          default: 'swift',
          choices: expect.arrayContaining([
            {
              value: "objc",
              name: "Objective-C"
            },
            {
              value: "swift",
              name: "Swift"
            }
          ]),
          message: "Which iOS language would you like to use?",
        })
      ])
    );
  });
});
