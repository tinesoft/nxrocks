import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { readJsonInTree } from '@nrwl/workspace';
import { join } from 'path';
import * as inquirer from 'inquirer';
import { ApplicationSchematicSchema } from './schema';

jest.mock('child_process'); // we need to mock 'execSync' so that it doesn't really run 'flutter' (reserved to e2e testing) (see __mocks__/child_process.js)

jest.mock('inquirer'); // we mock 'inquirer' to bypass the interactive prompt


const appCommands = [
  { key: 'assemble', value: 'assemble' },
  { key: 'attach', value: 'attach' },
  { key: 'drive', value: 'drive' },
  { key: 'genL10n', value: 'gen-l10n' },
  { key: 'install', value: 'install' },
  { key: 'run', value: 'run' },
];

const pluginOrModOnlyCommands = [
  { key: 'buildAar', value: 'build aar'},
];

const androidOnlyCommands = [
  { key: 'buildAar', value: 'build aar'},
  { key: 'buildApk', value: 'build apk' },
  { key: 'buildAppbundle', value: 'build appbundle' },
  { key: 'buildBundle', value: 'build bundle' },
];

const iOsOnlyCommands = [
  { key: 'buildIos', value: 'build ios' },
  { key: 'buildIosFramework', value: 'build ios-framework' },
  { key: 'buildIpa', value: 'build ipa' },
];

describe('application schematic', () => {
  let appTree: Tree;
  const defaultOptions: ApplicationSchematicSchema = { name: 'testapp' };

  const testRunner = new SchematicTestRunner(
    '@nxrocks/nx-flutter',
    join(__dirname, '../../../collection.json')
  );

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty());

    jest.spyOn(inquirer, 'prompt').mockResolvedValue({
      platforms: ['android', 'ios', 'web', 'linux', 'windows', 'macos'],
      androidLanguage: 'kotlin',
      iosLanguage: 'swift'
    });
  });

  afterEach(() =>
    (inquirer.prompt as jest.MockedFunction<
      typeof inquirer.prompt
    >).mockRestore()
  );

  it('should update workspace.json', async () => {
    const tree = await testRunner
      .runSchematicAsync('create', defaultOptions, appTree)
      .toPromise();

    const workspaceJson = readJsonInTree(tree, 'workspace.json');
    const root = 'apps/testapp';
    expect(workspaceJson.projects['testapp'].root).toBe(root);

    const commonCommands = [
      { key: 'analyze', value: 'analyze' },
      { key: 'clean', value: 'clean' },
      { key: 'format', value: `format ${root}/*` },
      { key: 'test', value: 'test' },
    ];

    const commands = [...commonCommands, ...appCommands, ...pluginOrModOnlyCommands, ...androidOnlyCommands, ...iOsOnlyCommands];
    const architect = workspaceJson.projects['testapp'].architect;

    commands.forEach(e => {
      expect(architect[e.key].builder).toBe('@nrwl/workspace:run-commands');
      expect(architect[e.key].options.command).toBe(`flutter ${e.value}`);
    });
  });

  it('should run successfully', async () => {
    await expect(
      testRunner.runSchematicAsync('application', defaultOptions, appTree).toPromise()
    ).resolves.not.toThrowError();
  });

  describe('generating flutter "app"', () => {

    it('should prompt user to select "platforms", "androidLanguage" and "iosLanguage"', async () => {
      const tree = await testRunner
        .runSchematicAsync('create', { ...defaultOptions, template: 'app' }, appTree)
        .toPromise();

      const workspaceJson = readJsonInTree(tree, 'workspace.json');
      const root = 'apps/testapp';
      expect(workspaceJson.projects['testapp'].root).toBe(root);

      expect(inquirer.prompt).toBeCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            when: true,
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

  describe('generating flutter "plugin"', () => {

    it('should prompt user to select "platforms", "androidLanguage" and "iosLanguage"', async () => {
      const tree = await testRunner
        .runSchematicAsync('create', { ...defaultOptions, template: 'plugin' }, appTree)
        .toPromise();

      const workspaceJson = readJsonInTree(tree, 'workspace.json');
      const root = 'apps/testapp';
      expect(workspaceJson.projects['testapp'].root).toBe(root);

      expect(inquirer.prompt).toBeCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            when: true,
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

  describe('generating flutter "module"', () => {

    it('should prompt user to select "platforms", "androidLanguage" and "iosLanguage"', async () => {
      const tree = await testRunner
        .runSchematicAsync('create', { ...defaultOptions, template: 'module' }, appTree)
        .toPromise();

      const workspaceJson = readJsonInTree(tree, 'workspace.json');
      const root = 'apps/testapp';
      expect(workspaceJson.projects['testapp'].root).toBe(root);

      expect(inquirer.prompt).toBeCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            when: false,
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

  describe('generating flutter "package"', () => {

    it('should prompt user to select "platforms", "androidLanguage" and "iosLanguage"', async () => {
      const tree = await testRunner
        .runSchematicAsync('create', { ...defaultOptions, template: 'package' }, appTree)
        .toPromise();

      const workspaceJson = readJsonInTree(tree, 'workspace.json');
      const root = 'apps/testapp';
      expect(workspaceJson.projects['testapp'].root).toBe(root);

      expect(inquirer.prompt).toBeCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            when: false,
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
});
