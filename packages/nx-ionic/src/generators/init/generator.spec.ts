import { readJson, readNxJson, Tree, updateNxJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { initIonic } from './generator';
import { InitGeneratorSchema } from './schema';

// Mock the plugin import to avoid circular dependencies
jest.mock('../../plugins/plugin', () => ({
  createNodesV2: jest.fn(),
}));

// Mock the utils
jest.mock('../../utils/plugin', () => ({
  hasIonicPlugin: jest.fn(),
}));

jest.mock('../../utils/versions', () => ({
  ionicCliVersion: '^7.0.0',
  nxVersion: '18.0.0',
}));

// Mock addPlugin to avoid creating project graphs
jest.mock('@nx/devkit/src/utils/add-plugin', () => ({
  addPlugin: jest.fn(() =>
    Promise.resolve(() => {
      /* noop */
    })
  ),
}));

// Mock createProjectGraphAsync to avoid heavy operations
jest.mock('@nx/devkit', () => ({
  ...jest.requireActual('@nx/devkit'),
  createProjectGraphAsync: jest.fn(() =>
    Promise.resolve({ nodes: {}, dependencies: {} })
  ),
}));

import { hasIonicPlugin } from '../../utils/plugin';

const mockHasIonicPlugin = hasIonicPlugin as jest.MockedFunction<
  typeof hasIonicPlugin
>;

describe('init generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    tree.write('.gitignore', '');
    jest.clearAllMocks();
  });

  describe('default behavior', () => {
    it('should add ionic dependencies to package.json', async () => {
      mockHasIonicPlugin.mockReturnValue(false);

      await initIonic(tree, {});

      const packageJson = readJson(tree, 'package.json');
      expect(packageJson.devDependencies['@nxrocks/nx-ionic']).toBeDefined();
      expect(packageJson.devDependencies['@ionic/cli']).toBeDefined();
    });

    it('should add gitignore entries for Ionic files and directories', async () => {
      mockHasIonicPlugin.mockReturnValue(false);

      tree.write('/.gitignore', '/node_modules\\n');
      await initIonic(tree, {});

      const content = tree.read('/.gitignore')?.toString();
      expect(content).toMatch(/# Ionic/);
      expect(content).toMatch(/www\//);
      expect(content).toMatch(/platforms\//);
      expect(content).toMatch(/plugins\//);
      expect(content).toMatch(/\.DS_Store/);
      expect(content).toMatch(/\$IONIC_LOG_FILE/);
    });

    it('should not duplicate gitignore entries', async () => {
      mockHasIonicPlugin.mockReturnValue(false);

      tree.write(
        '/.gitignore',
        `
/node_modules

# Ionic
www/
platforms/
`
      );
      await initIonic(tree, {});

      const content = tree.read('/.gitignore')?.toString();
      const ionicSections = (content?.match(/# Ionic/g) || []).length;
      expect(ionicSections).toBe(1);
    });

    it('should update production fileset in nx.json', async () => {
      mockHasIonicPlugin.mockReturnValue(false);

      const nxJson = readNxJson(tree);
      nxJson.namedInputs = {
        production: ['default'],
      };
      updateNxJson(tree, nxJson);

      await initIonic(tree, {});

      const updatedNxJson = readNxJson(tree);
      expect(updatedNxJson.namedInputs?.production).toContain(
        '!{projectRoot}/ionic.config.json'
      );
      expect(updatedNxJson.namedInputs?.production).toContain(
        '!{projectRoot}/capacitor.config.json'
      );
      expect(updatedNxJson.namedInputs?.production).toContain(
        '!{projectRoot}/capacitor.config.ts'
      );
      expect(updatedNxJson.namedInputs?.production).toContain(
        '!{projectRoot}/config.xml'
      );
      expect(updatedNxJson.namedInputs?.production).toContain(
        '!{projectRoot}/.ionic'
      );
      expect(updatedNxJson.namedInputs?.production).toContain(
        '!{projectRoot}/platforms'
      );
      expect(updatedNxJson.namedInputs?.production).toContain(
        '!{projectRoot}/plugins'
      );
    });

    it('should add VS Code extension recommendation', async () => {
      mockHasIonicPlugin.mockReturnValue(false);

      tree.write(
        '.vscode/extensions.json',
        JSON.stringify({ recommendations: [] })
      );
      await initIonic(tree, {});

      const extensionsJson = readJson(tree, '.vscode/extensions.json');
      expect(extensionsJson.recommendations).toContain('ionic.ionic');
    });

    it('should not duplicate VS Code extension recommendation', async () => {
      mockHasIonicPlugin.mockReturnValue(false);

      tree.write(
        '.vscode/extensions.json',
        JSON.stringify({
          recommendations: ['ionic.ionic', 'ms-vscode.vscode-typescript-next'],
        })
      );
      await initIonic(tree, {});

      const extensionsJson = readJson(tree, '.vscode/extensions.json');
      const ionicExtensions = extensionsJson.recommendations.filter(
        (ext: string) => ext === 'ionic.ionic'
      );
      expect(ionicExtensions).toHaveLength(1);
    });
  });

  describe('with options', () => {
    it('should skip package.json updates when skipPackageJson is true', async () => {
      mockHasIonicPlugin.mockReturnValue(false);

      const options: InitGeneratorSchema = {
        skipPackageJson: true,
      };

      await initIonic(tree, options);

      const packageJson = readJson(tree, 'package.json');
      expect(
        packageJson.devDependencies?.['@nxrocks/nx-ionic']
      ).toBeUndefined();
      expect(packageJson.devDependencies?.['@ionic/cli']).toBeUndefined();
    });

    it('should keep existing versions when keepExistingVersions is true', async () => {
      mockHasIonicPlugin.mockReturnValue(false);

      // Add existing dependency with different version
      const packageJson = readJson(tree, 'package.json');
      packageJson.devDependencies = packageJson.devDependencies || {};
      packageJson.devDependencies['@ionic/cli'] = '^6.0.0';
      tree.write('package.json', JSON.stringify(packageJson, null, 2));

      const options: InitGeneratorSchema = {
        keepExistingVersions: true,
      };

      await initIonic(tree, options);

      const updatedPackageJson = readJson(tree, 'package.json');
      expect(updatedPackageJson.devDependencies['@ionic/cli']).toBe('^6.0.0');
    });

    it('should add target defaults when addPlugin is false', async () => {
      mockHasIonicPlugin.mockReturnValue(false);

      const options: InitGeneratorSchema = {
        addPlugin: false,
      };

      await initIonic(tree, options);

      const nxJson = readNxJson(tree);
      expect(nxJson.targetDefaults?.['@nxrocks/nx-ionic:ionic']).toBeDefined();
      expect(nxJson.targetDefaults?.['@nxrocks/nx-ionic:ionic']?.cache).toBe(
        true
      );
      expect(
        nxJson.targetDefaults?.['@nxrocks/nx-ionic:ionic']?.inputs
      ).toContain('default');
      expect(
        nxJson.targetDefaults?.['@nxrocks/nx-ionic:ionic']?.inputs
      ).toContain('{projectRoot}/ionic.config.json');
    });

    it('should return early when plugin is already added and addPlugin is true', async () => {
      mockHasIonicPlugin.mockReturnValue(true);

      const options: InitGeneratorSchema = {
        addPlugin: true,
      };

      const packageJsonBefore = readJson(tree, 'package.json');
      await initIonic(tree, options);
      const packageJsonAfter = readJson(tree, 'package.json');

      // Should not modify package.json when plugin already exists
      expect(packageJsonBefore).toEqual(packageJsonAfter);
    });
  });

  describe('environment variables', () => {
    beforeEach(() => {
      delete process.env.NX_ADD_PLUGINS;
    });

    afterEach(() => {
      delete process.env.NX_ADD_PLUGINS;
    });

    it('should default addPlugin to true when NX_ADD_PLUGINS is not false', async () => {
      mockHasIonicPlugin.mockReturnValue(false);

      const nxJson = readNxJson(tree);
      nxJson.useInferencePlugins = undefined; // Default behavior
      updateNxJson(tree, nxJson);

      await initIonic(tree, {});

      // The function should have attempted to add the plugin (default behavior)
      // We can verify this by checking that target defaults were NOT added
      // (because addPlugin defaults to true)
      const updatedNxJson = readNxJson(tree);
      expect(
        updatedNxJson.targetDefaults?.['@nxrocks/nx-ionic:ionic']
      ).toBeUndefined();
    });

    it('should respect NX_ADD_PLUGINS=false environment variable', async () => {
      process.env.NX_ADD_PLUGINS = 'false';
      mockHasIonicPlugin.mockReturnValue(false);

      await initIonic(tree, {});

      // When NX_ADD_PLUGINS=false, should add target defaults instead of plugin
      const nxJson = readNxJson(tree);
      expect(nxJson.targetDefaults?.['@nxrocks/nx-ionic:ionic']).toBeDefined();
    });

    it('should respect useInferencePlugins=false in nx.json', async () => {
      mockHasIonicPlugin.mockReturnValue(false);

      const nxJson = readNxJson(tree);
      nxJson.useInferencePlugins = false;
      updateNxJson(tree, nxJson);

      await initIonic(tree, {});

      // When useInferencePlugins=false, should add target defaults
      const updatedNxJson = readNxJson(tree);
      expect(
        updatedNxJson.targetDefaults?.['@nxrocks/nx-ionic:ionic']
      ).toBeDefined();
    });
  });

  describe('file handling', () => {
    it('should not create .vscode/extensions.json if it does not exist', async () => {
      mockHasIonicPlugin.mockReturnValue(false);

      await initIonic(tree, {});

      expect(tree.exists('.vscode/extensions.json')).toBe(false);
    });

    it('should not modify .gitignore if it does not exist', async () => {
      mockHasIonicPlugin.mockReturnValue(false);
      tree.delete('.gitignore');

      await initIonic(tree, {});

      expect(tree.exists('.gitignore')).toBe(false);
    });

    it('should handle empty .vscode/extensions.json', async () => {
      mockHasIonicPlugin.mockReturnValue(false);

      tree.write('.vscode/extensions.json', '{}');
      await initIonic(tree, {});

      const extensionsJson = readJson(tree, '.vscode/extensions.json');
      expect(extensionsJson.recommendations).toEqual(['ionic.ionic']);
    });
  });

  describe('formatting', () => {
    it('should skip formatting when skipFormat is true', async () => {
      mockHasIonicPlugin.mockReturnValue(false);

      const options: InitGeneratorSchema = {
        skipFormat: true,
      };

      // This test mainly ensures no errors are thrown
      // The actual formatting behavior is handled by the formatFiles function
      const result = await initIonic(tree, options);
      expect(result).toBeDefined();
    });
  });
});
