import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { NxJsonConfiguration, Tree, readJson } from '@nx/devkit';

import update from './add-install-to-cacheable-operations';

describe('add-install-to-cacheable-operations migration', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await update(tree);
    const nxJson = readJson<NxJsonConfiguration>(tree, 'nx.json');
    expect(nxJson.targetDefaults?.['install'].cache).toBe(true)

  });
});
