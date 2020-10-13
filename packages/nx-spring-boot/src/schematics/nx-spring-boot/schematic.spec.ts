import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { join } from 'path';

import { NxSpringBootSchematicSchema } from './schema';

describe('nx-spring-boot schematic', () => {
  let appTree: Tree;
  const options: NxSpringBootSchematicSchema = { name: 'test' };

  const testRunner = new SchematicTestRunner(
    '@nxrocks/nx-spring-boot',
    join(__dirname, '../../../collection.json')
  );

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty());
  });

  it('should run successfully', async () => {
    await expect(
      testRunner
        .runSchematicAsync('nx-spring-boot', options, appTree)
        .toPromise()
    ).resolves.not.toThrowError();
  });
});
