import { Tree, logger, generateFiles, getWorkspaceLayout, workspaceRoot, readJsonFile} from '@nx/devkit';
import { getNpmScope } from '@nx/workspace/src/utilities/get-import-path';
import { getDartSDKVersion } from '../../../utils/melos-utils';
import { join } from 'path';

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
  const usePubspecOverrides = dartVersions && 
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
