import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration, addProjectConfiguration } from '@nrwl/devkit';

import generator from './generator';
import { LinkGeneratorSchema } from './schema';

describe('link generator', () => {
  let tree: Tree;
  const options: LinkGeneratorSchema = { sourceProjectName: 'quarkusapp', targetProjectName: 'ngapp' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    addProjectConfiguration(tree, options.sourceProjectName, {
      projectType: 'application',
      sourceRoot: `apps/${options.sourceProjectName}/src`,
      root: `apps/${options.sourceProjectName}`,
    });
    addProjectConfiguration(tree, options.targetProjectName, {
      projectType: 'application',
      sourceRoot: `apps/${options.targetProjectName}/src`,
      root: `apps/${options.targetProjectName}`,
    });
  });

  it('should run successfully', async () => {
    await generator(tree, options);
    const targetProject = readProjectConfiguration(tree, options.targetProjectName);
    expect(targetProject.implicitDependencies).toEqual([options.sourceProjectName]);
  })
});
