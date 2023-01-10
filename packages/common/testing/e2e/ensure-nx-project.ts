
import { ensureDirSync } from "fs-extra";
import { execSync } from 'child_process';
import { dirname, join } from 'path';
import {
  cleanup,
  patchPackageJsonForPlugin,
  runPackageManagerInstall,
  tmpProjPath
} from '@nrwl/nx-plugin/testing';
import { readJsonFile, workspaceRoot, writeJsonFile } from "@nrwl/devkit";
import { getPackageManagerCommand } from "@nrwl/devkit";
import { detectPackageManager } from "@nrwl/devkit";


function patchDependencyOfPlugin(
  pluginDistPath: string,
  dependencyPackageName: string,
  dependencyDistPath: string, 
  root = workspaceRoot
) {
  const path = join(root, pluginDistPath, 'package.json');
  const json = readJsonFile(path);
  json.dependencies[dependencyPackageName] = `file:${root}/${dependencyDistPath}`;
  writeJsonFile(path, json);
}

function patchPackageJsonForLocalPlugin(
  npmPackageName: string,
  distPath: string,
  root = workspaceRoot
) {
  const path = join(root, 'package.json');
  const json = readJsonFile(path);
  json.devDependencies[npmPackageName] = `file:${root}/${distPath}`;
  writeJsonFile(path, json);
}

function runPackageManagerInstallLocally( root:string = workspaceRoot, silent = false) {
  const pmc = getPackageManagerCommand(detectPackageManager(root));
  const install = execSync(pmc.install, {
    cwd: root,
    ...(silent ? { stdio: ['ignore', 'ignore', 'ignore'] } : {}),
  });
  return install ? install.toString() : '';
}

/**
 * Same as https://github.com/nrwl/nx/blob/master/packages/nx-plugin/src/utils/testing-utils/nx-project.ts#L13
 * But as the original method is not exported, we need to add it here and patch it.
 */
function runNxNewCommand(args?: string, silent?: boolean) {
  const localTmpDir = dirname(tmpProjPath());
  return execSync(
    `node ${require.resolve(
      'nx'
    )} new proj --nx-workspace-root=${localTmpDir} --no-interactive --skip-install --collection=@nrwl/workspace --npmScope=proj --preset=empty ${args || ''
    }`,
    {
      cwd: localTmpDir,
      ...(silent ? { stdio: ['ignore', 'ignore', 'ignore'] } : {}),
    }
  );
}

export type NpmPackage= {name: string,path: string};

/**
 * Ensures that a project (and the internal packages it depends on) has been setup in the e2e directory
 * It will also copy `@nrwl` packages to the e2e directory
 */
export function ensureNxProjectWithDeps(
  npmPackageName?: string,
  pluginDistPath?: string,
  dependencies?: NpmPackage[]
): void {
  ensureDirSync(tmpProjPath());
  cleanup();
  runNxNewCommand('', false);

  patchPackageJsonForPlugin(npmPackageName, pluginDistPath);

  dependencies?.forEach(depPkg => {
    patchPackageJsonForPlugin(depPkg.name, depPkg.path);
    patchDependencyOfPlugin(pluginDistPath, depPkg.name, depPkg.path);
  });

  runPackageManagerInstall();
}

/**
 * Ensures that all local plugins (and the internal packages they depend on) are installed locally in the workspace
 */
export function ensureLocalPluginsWithDeps(
  plugins: NpmPackage[],
  dependencies?: NpmPackage[],
  root = workspaceRoot,
): void {

  plugins.forEach(pkg=>{
    patchPackageJsonForLocalPlugin(pkg.name, pkg.path, root);

    dependencies?.forEach(depPkg => {
      //patchPackageJsonForLocalPlugin(depPkg.name, depPkg.path, root);
      patchDependencyOfPlugin(pkg.path, depPkg.name, depPkg.path, root);
    });
  });

  runPackageManagerInstallLocally(root);
}
