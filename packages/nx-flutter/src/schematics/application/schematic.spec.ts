import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { readJsonInTree } from '@nrwl/workspace';
import { join } from 'path';

import { ApplicationSchematicSchema } from './schema';

jest.mock('child_process'); // we need to mock 'execSync' so that it doesn't really run 'flutter' ( reserved to e2e testing) (see __mocks__/child_process.js)

describe('application schematic', () => {
  let appTree: Tree;
  const options: ApplicationSchematicSchema = { name: 'testapp' };

  const testRunner = new SchematicTestRunner(
    '@nxrocks/nx-flutter',
    join(__dirname, '../../../collection.json')
  );

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty());
  });

  it('should update workspace.json', async () => {
    const tree = await testRunner
      .runSchematicAsync('app', options, appTree)
      .toPromise();

    const workspaceJson = readJsonInTree(tree, 'workspace.json');
    const root = 'apps/testapp';
    expect(workspaceJson.projects['testapp'].root).toBe(root);
    
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
      { key: 'format', value: `format ${root}/*` },
      { key: 'genL10n', value: 'gen-l10n' },
      { key: 'install', value: 'install' },
      { key: 'run', value: 'run' },
      { key: 'test', value: 'test' },
    ];

    const architect= workspaceJson.projects['testapp'].architect;

    commands.forEach(e => {
      expect(architect[e.key].builder).toBe('@nrwl/workspace:run-commands');
      expect(architect[e.key].options.command).toBe(`flutter ${e.value}`);
    });
  });

  it('should run successfully', async () => {
    await expect(
      testRunner.runSchematicAsync('application', options, appTree).toPromise()
    ).resolves.not.toThrowError();
  });
});
