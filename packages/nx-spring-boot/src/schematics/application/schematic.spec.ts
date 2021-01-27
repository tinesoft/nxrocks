import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { readJsonInTree } from '@nrwl/workspace';
import { join } from 'path';

import { ApplicationSchematicSchema } from './schema';

describe('application schematic', () => {
  let appTree: Tree;
  const options: ApplicationSchematicSchema = { name: 'testapp' };

  const testRunner = new SchematicTestRunner(
    '@nxrocks/nx-spring-boot',
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
    expect(workspaceJson.projects['testapp'].root).toBe('apps/testapp');

    const commands = ['run', 'serve', 'test', 'buildJar', 'buildWar', 'buildImage', 'buildInfo'];
    const architect = workspaceJson.projects['testapp'].architect;
    commands.forEach(cmd => {
      expect(architect[cmd].builder).toBe(`@nxrocks/nx-spring-boot:${cmd}`);
    });



  });

  it('should run successfully', async () => {
    await expect(
      testRunner
        .runSchematicAsync('application', options, appTree)
        .toPromise()
    ).resolves.not.toThrowError();
  });
});
