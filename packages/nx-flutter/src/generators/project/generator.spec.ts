import { Tree, logger, readProjectConfiguration, readJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { projectGenerator } from './generator';
import { ProjectGeneratorOptions } from './schema';
import { NX_FLUTTER_PKG } from '@nxrocks/common';

jest.mock('child_process'); // we need to mock 'execSync' so that it doesn't really run 'flutter' (reserved to e2e testing) (see __mocks__/child_process.js)

//jest.mock('enquirer'); // we mock 'enquirer' to bypass the interactive prompt
import * as enquirer from 'enquirer';

process.env.NX_INTERACTIVE = 'true'; // simulate normal cli interactive mode (the prompt is mocked anyway)

const appCommands = [
  { key: 'assemble', value: 'assemble' },
  { key: 'attach', value: 'attach' },
  { key: 'drive', value: 'drive' },
  { key: 'gen-l10n', value: 'gen-l10n' },
  { key: 'install', value: 'install' },
  { key: 'run', value: 'run' },
];

const pluginOrModOnlyCommands = [{ key: 'build-aar', value: 'build aar' }];

const androidOnlyCommands = [
  { key: 'build-aar', value: 'build aar' },
  { key: 'build-apk', value: 'build apk' },
  { key: 'build-appbundle', value: 'build appbundle' },
  { key: 'build-bundle', value: 'build bundle' },
];

const iOsOnlyCommands = [
  { key: 'build-ios', value: 'build ios' },
  { key: 'build-ios-framework', value: 'build ios-framework' },
  { key: 'build-ipa', value: 'build ipa' },
];

describe('application generator', () => {
  let tree: Tree;
  const options: ProjectGeneratorOptions = {
    name: 'testapp',
    template: 'app',
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    jest.spyOn(enquirer,'prompt').mockResolvedValue(
      {
        androidLanguage: 'kotlin',
        iosLanguage: 'swift',
        platforms: ['android', 'ios', 'web', 'linux', 'windows', 'macos'],
      }
    );
    jest.spyOn(logger, 'info');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should update workspace.json', async () => {
    await projectGenerator(tree, options);
    const project = readProjectConfiguration(tree, options.name);
    expect(project.root).toBe(`apps/${options.name}`);

    const commonCommands = [
      { key: 'analyze', value: 'analyze' },
      { key: 'clean', value: 'clean' },
      { key: 'format', value: `format ${project.root}/*` },
      { key: 'test', value: 'test' },
      { key: 'doctor', value: 'doctor' },
    ];

    const commands = [
      ...commonCommands,
      ...appCommands,
      ...pluginOrModOnlyCommands,
      ...androidOnlyCommands,
      ...iOsOnlyCommands,
    ];
    commands.forEach((e) => {
      expect(project.targets[e.key].executor).toBe('nx:run-commands');
      expect(project.targets[e.key].options.command).toBe(`${e.key === 'format' ? 'dart' : 'flutter'} ${e.value}`);
      if (e.key.startsWith('build-')) {
        expect(project.targets[e.key].outputs).toEqual([
          `{workspaceRoot}/${project.root}/build`,
        ]);
      }
    });
  });

  it.each`
    template     | rootDir
    ${'app'}     | ${'apps'}
    ${'plugin'}  | ${'libs'}
    ${'package'} | ${'libs'}
    ${'module'}  | ${'libs'}
  `(
    'should generate the flutter project of type "$template" in "$rootDir"',
    async ({ template, rootDir }) => {
      await projectGenerator(tree, { ...options, template: template });

    if(['app', 'plugin'].includes(template)){
      expect(logger.info).toHaveBeenNthCalledWith(1,`Generating Flutter project with following options : --project-name=${options.name} --android-language=kotlin --ios-language=swift --template=${template} --platforms="android,ios,web,linux,windows,macos" ...`);
      expect(logger.info).toHaveBeenNthCalledWith(2, `Executing command: flutter create --project-name=${options.name} --android-language=kotlin --ios-language=swift --template=${template} --platforms="android,ios,web,linux,windows,macos"  ${rootDir}/${options.name}`);
    }
    else {
      expect(logger.info).toHaveBeenNthCalledWith(1,`Generating Flutter project with following options : --project-name=${options.name} --template=${template} ...`);
      expect(logger.info).toHaveBeenNthCalledWith(2, `Executing command: flutter create --project-name=${options.name} --template=${template}  ${rootDir}/${options.name}`);
    }

  });

  it.each`
    template    
    ${'app'}    
    ${'plugin'} 
    ${'package'}
    ${'module'} 
    `('should prompt user to select "platforms" when generating "$template": $shouldPromptTempate', async ({ template }) => {

    await projectGenerator(tree, { ...options, template });

    if(!['app', 'plugin'].includes(template)){
      expect(enquirer.prompt).not.toHaveBeenCalled();
      return;
    }

    expect(enquirer.prompt).toHaveBeenNthCalledWith(1,
      expect.arrayContaining([
        expect.objectContaining({
          name: 'platforms',
          type: 'multiselect',
          choices: expect.arrayContaining([
            {
              name: "android",
              value: "Android platform",
            },
            {
              name: "ios",
              value: "iOS platform",
            },
            {
              name: "linux",
              value: "Linux platform",
            },
            {
              name: "windows",
              value: "Windows platform",
            },
            {
              name: "macos",
              value: "MacOS platform",
            },
            {
              name: "web",
              value: "Web platform",
            }
          ]),
        })
      ])
    );

      expect(enquirer.prompt).toHaveBeenNthCalledWith(
        2,
        expect.arrayContaining([
          expect.objectContaining({
            name: 'androidLanguage',
            type: 'select',
            initial: 1,
            choices: expect.arrayContaining([
              {
                name: 'java',
                value: 'Java',
              },
              {
                name: 'kotlin',
                value: 'Kotlin',
              },
            ]),
            message: 'Which Android language would you like to use?',
          }),
          expect.objectContaining({
            name: 'iosLanguage',
            type: 'select',
            initial: 1,
            choices: expect.arrayContaining([
              {
                name: 'objc',
                value: 'Objective-C',
              },
              {
                name: 'swift',
                value: 'Swift',
              },
            ]),
            message: 'Which iOS language would you like to use?',
          }),
        ])
      );
    }
  );

  it('should add plugin to nx.json', async () => {
    await projectGenerator(tree, options);
    const nxJson = readJson(tree, 'nx.json');
    expect(nxJson.plugins).toEqual([NX_FLUTTER_PKG]);
  });
});
