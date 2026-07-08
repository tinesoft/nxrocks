import {
  Tree,
  logger,
  generateFiles,
  getWorkspaceLayout,
  workspaceRoot,
  readJsonFile,
  readJson,
} from '@nx/devkit';
import { getDartSDKVersion } from '../../../utils/melos-utils';
import { join } from 'node:path';

/**
 * Read the npm scope that a workspace should use by default.
 * Inlined from the former `@nx/workspace/src/utilities/get-import-path`,
 * which is no longer exposed as of Nx v23.
 */
function getNpmScope(tree: Tree): string | undefined {
  const { name } = tree.exists('package.json')
    ? readJson<{ name?: string }>(tree, 'package.json')
    : { name: null };
  if (name?.startsWith('@')) {
    return name.split('/')[0].substring(1);
  }
  return undefined;
}

export async function generateMelosConfigurationFile(
  tree: Tree
): Promise<void> {
  logger.info(`Generating Melos configuration file...`);

  const { appsDir, libsDir } = getWorkspaceLayout(tree);
  const pkgJson = readJsonFile(`${workspaceRoot}/package.json`);
  const npmScope = getNpmScope(tree);
  const pkgRepositoryUrl = pkgJson?.repository?.url;

  const dartVersions = getDartSDKVersion()?.split('.');

  // setting usePubspecOverrides to true, if on Dart 2.17.0 or greater, as recommnend by Melos
  const usePubspecOverrides =
    dartVersions &&
    +dartVersions?.[0] >= 2 &&
    +dartVersions?.[1] >= 17 &&
    +dartVersions?.[2] >= 0;

  const templateOptions = {
    tmpl: '',
    appsDir,
    libsDir,
    npmScope,
    pkgRepositoryUrl,
    usePubspecOverrides,
  };
  generateFiles(
    tree,
    join(__dirname, '..', 'root-files'),
    '.',
    templateOptions
  );
}
