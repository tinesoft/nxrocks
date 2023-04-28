import { Tree, logger, generateFiles, getWorkspaceLayout } from '@nx/devkit';
import { readPackageJson } from 'nx/src/project-graph/file-utils';
import { getDartSDKVersion } from '../../../utils/melos-utils';
import { join } from 'path';

export async function generateMelosConfigurationFile(
  tree: Tree
): Promise<void> {
  logger.info(`Generating Melos configuration file...`);

  const { appsDir, libsDir, npmScope } = getWorkspaceLayout(tree);
  const pkgRepositoryUrl = readPackageJson()?.repository?.url;

  const dartVersions = getDartSDKVersion()?.split('.');

  // setting usePubspecOverrides to true, if on Dart 2.17.0 or greater, as recommnend by Melos
  const usePubspecOverrides =
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
