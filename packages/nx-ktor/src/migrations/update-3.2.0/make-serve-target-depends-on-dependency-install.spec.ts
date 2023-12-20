import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, addProjectConfiguration, readProjectConfiguration } from '@nx/devkit';

import update from './make-serve-target-depends-on-dependency-install';
import { NX_KTOR_PKG } from '../../index';

describe('make-serve-target-depends-on-dependency-install migration', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    addProjectConfiguration(tree, 'app1', {
      root: 'apps/app1',
      projectType: 'application',
      targets: {
        run: {
          executor: `${NX_KTOR_PKG}:run`,
          options: {},
          dependsOn: ['^install'],
          configurations: {},
        },
        serve: {
          executor: `${NX_KTOR_PKG}:serve`,
          options: {},
          configurations: {},
        },
      },
    });

    await update(tree);

    const project = readProjectConfiguration(tree, 'app1');
    expect(project.targets?.['run'].dependsOn).toContain('^install');
    expect(project.targets?.['serve'].dependsOn).toContain('^install');
  });
});
