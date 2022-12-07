import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration, addProjectConfiguration } from '@nrwl/devkit';

import generator from './generator';
import { LinkGeneratorSchema } from './schema';
import { isBootProject } from '../../utils/boot-utils';

jest.mock('../../utils/boot-utils');

describe('link generator', () => {
  let tree: Tree;
  const options: LinkGeneratorSchema = { sourceProjectName: 'bootapp', targetProjectName: 'ngapp' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
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

    jest.resetAllMocks();
  });

  it('should run successfully', async () => {
    // mock the function that checks if the project is a Spring-Boot project
    (isBootProject as jest.Mock).mockImplementation(() => true);
    await generator(tree, options);
    const targetProject = readProjectConfiguration(tree, options.targetProjectName);
    expect(targetProject.implicitDependencies).toEqual([options.sourceProjectName]);
  });

  it('should fail if source project is not a Spring boot project', async () => {
    await expect(generator(tree, options)).rejects.toThrow(`The source project (1st argument of this 'link' generator) must be a Spring-Boot project`) ;
  })
});
