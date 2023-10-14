import { Tree, logger, readJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { initGenerator } from './generator';
import { InitGeneratorOptions } from './schema';

jest.mock('child_process'); // we need to mock 'execSync' so that it doesn't really run 'melos' (reserved to e2e testing) (see __mocks__/child_process.js)

import { NX_MELOS_PKG } from '../../index';

describe('init generator', () => {
  let tree: Tree;
  const options: InitGeneratorOptions = {};

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();

    jest.spyOn(logger, 'info');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it.each`
    sep
    ${'-'}
    ${':'}
  `(
    `should add melos scripts (with '$sep' separator) and nx targets to package.json`,
    async ({ sep }) => {
      await initGenerator(tree, { ...options, scriptNameSeparator: sep });
      const rootPackageJson = readJson(tree, 'package.json');

      const scripts = [
        { key: `melos${sep}bootstrap`, value: 'node nx-melos.mjs bootstrap' },
        { key: `melos${sep}clean`, value: 'node nx-melos.mjs clean' },
        { key: `melos${sep}exec`, value: 'node nx-melos.mjs exec' },
        { key: `melos${sep}list`, value: 'node nx-melos.mjs list' },
        { key: `melos${sep}publish`, value: 'node nx-melos.mjs publish' },
        { key: `melos${sep}run`, value: 'node nx-melos.mjs run' },
        { key: `melos${sep}version`, value: 'node nx-melos.mjs version' },
      ];

      scripts.forEach((s) => {
        expect(rootPackageJson.scripts[s.key]).toEqual(s.value);
      });
      expect(
        rootPackageJson.nx.targets[`melos${sep}bootstrap`].outputs
      ).toEqual([`{workspaceRoot}/.packages`]);
    }
  );

  it('should add plugin to nx.json', async () => {
    await initGenerator(tree, options);
    const nxJson = readJson(tree, 'nx.json');
    expect(nxJson.plugins).toEqual([NX_MELOS_PKG]);
  });
});
