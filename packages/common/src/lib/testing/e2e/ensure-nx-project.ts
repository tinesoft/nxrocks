
import { ensureDirSync } from "fs-extra";
import { execSync } from 'child_process';
import { dirname, join } from 'path';
import {
  cleanup,
  patchPackageJsonForPlugin,
  runPackageManagerInstall,
  tmpProjPath
} from '@nrwl/nx-plugin/testing';
import { readJsonFile, writeJsonFile } from "@nrwl/devkit";
import { appRootPath } from "@nrwl/tao/src/utils/app-root";


function patchDependencyOfPlugin(
  pluginDistPath: string,
  dependencyPackageName: string,
  dependencyDistPath: string
) {
  const path = join(appRootPath, pluginDistPath, 'package.json');
  const json = readJsonFile(path);
  json.dependencies[dependencyPackageName] = `file:${appRootPath}/${dependencyDistPath}`;
  writeJsonFile(path, json);
}

/**
 * Same as https://github.com/nrwl/nx/blob/master/packages/nx-plugin/src/utils/testing-utils/nx-project.ts#L13
 * But as the original method is not exported, we need to add it here and patch it.
 */
function runNxNewCommand(args?: string, silent?: boolean) {
  const localTmpDir = dirname(tmpProjPath());
  return execSync(
    `node ${require.resolve(
      '@nrwl/tao'
    )} new proj --nx-workspace-root=${localTmpDir} --no-interactive --skip-install --collection=@nrwl/workspace --npmScope=proj --preset=empty ${args || ''
    }`,
    {
      cwd: localTmpDir,
      ...(silent ? { stdio: ['ignore', 'ignore', 'ignore'] } : {}),
    }
  );
}

/**
 * Ensures that a project (and the internal packages it depends on) has been setup in the e2e directory
 * It will also copy `@nrwl` packages to the e2e directory
 */
export function ensureNxProjectWithDeps(
  npmPackageName?: string,
  pluginDistPath?: string,
  dependencies?: { depPkgName: string, depDistPath: string }[]
): void {
  ensureDirSync(tmpProjPath());
  cleanup();
  runNxNewCommand('', false);

  patchPackageJsonForPlugin(npmPackageName, pluginDistPath);

  dependencies?.forEach(({ depPkgName, depDistPath }) => {
    patchPackageJsonForPlugin(depPkgName, depDistPath);
    patchDependencyOfPlugin(pluginDistPath, depPkgName, depDistPath);
  });

  runPackageManagerInstall();
}
