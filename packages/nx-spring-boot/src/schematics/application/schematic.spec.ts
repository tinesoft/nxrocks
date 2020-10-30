import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { readJsonInTree } from '@nrwl/workspace';
import { join } from 'path';

import { ApplicationSchematicSchema } from './schema';

describe('application schematic', () => {
  let appTree: Tree;
  const options: ApplicationSchematicSchema = { name: 'test' };

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
    const { run, serve, buildJar, buildWar, buildImage, buildInfo } = workspaceJson.projects[
      'test'
    ].architect;
    expect(workspaceJson.projects['test'].root).toBe('apps/test');
    expect(run.builder).toBe('@nxrocks/nx-spring-boot:run');
    expect(serve.builder).toBe('@nxrocks/nx-spring-boot:serve');
    expect(buildJar.builder).toBe('@nxrocks/nx-spring-boot:buildJar');
    expect(buildWar.builder).toBe('@nxrocks/nx-spring-boot:buildWar');
    expect(buildImage.builder).toBe('@nxrocks/nx-spring-boot:buildImage');
    expect(buildInfo.builder).toBe('@nxrocks/nx-spring-boot:buildInfo');

  });

  it('should run successfully', async () => {
    await expect(
      testRunner
        .runSchematicAsync('application', options, appTree)
        .toPromise()
    ).resolves.not.toThrowError();
  });
});
