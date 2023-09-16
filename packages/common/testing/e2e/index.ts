import { JsonParseOptions, joinPathFragments, parseJson, readJsonFile, workspaceRoot } from '@nx/devkit';
import { getPackageLatestNpmVersion } from '../../src/';
import { ExecSyncOptions, execSync } from 'child_process';
import { rmSync, mkdirSync, statSync, readFileSync, existsSync } from 'fs-extra';
import { join, dirname, isAbsolute } from 'path';


export const isWin = process.platform === 'win32';

/**
 * Creates a test project with create-nx-workspace and installs the plugin
 * @returns The directory where the test project was created
 */
export function createTestProject(createCommand='npx --yes create-nx-workspace', projectName='test-project', workspaceVersion: 'latest' | 'local' = 'local') {
  const projectDirectory = join(process.cwd(), 'tmp', projectName);

  // Ensure projectDirectory is empty
  rmSync(projectDirectory, {
    recursive: true,
    force: true,
  });
  mkdirSync(dirname(projectDirectory), {
    recursive: true,
  });

  const nxVersion = workspaceVersion === 'local' ? readLocalNxWorkspaceVersion(): 'latest';
  execSync(
    `${createCommand.trim()}@${nxVersion} ${projectName} --preset apps --no-nxCloud --no-interactive`,
    {
      cwd: dirname(projectDirectory),
      stdio: 'inherit',
      env: process.env,
    }
  );
  console.log(`Created test project in "${projectDirectory}"`);

  return projectDirectory;
}


// Temporary utilities from @nx/plugin/testing package, like `runNxCommandAsync`, `readJson`, etc
// Adapted to support the new 'test-project' folder, instead of the default 'nx-e2e' used internally by those methods
// (until properly updated/published By Nx ?)

export function checkFilesExist(...expectedFiles: string[]) {
  expectedFiles.forEach((f) => {
    const ff = f.startsWith('/') ? f : tmpProjPath(f);
    if (!exists(ff)) {
      throw new Error(`File '${ff}' does not exist`);
    }
  });
}
export function tmpProjPath(path = '', projectName = 'test-project') {
  return join(process.cwd(), 'tmp', projectName, path);
}

function directoryExists(filePath: string): boolean {
  try {
    return statSync(filePath).isDirectory();
  } catch (err) {
    return false;
  }
}

function fileExists(filePath: string): boolean {
  try {
    return statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
}

function exists(filePath: string): boolean {
  return directoryExists(filePath) || fileExists(filePath);
}

export function runNxCommand(command: string, pkgManagerExec = 'npx', opts: ExecSyncOptions = { cwd: tmpProjPath(), env: process.env, stdio: 'pipe' }) {
  return {
    stdout: execSync(`${pkgManagerExec} nx ${command}`, {
      cwd: opts.cwd,
      env: opts.env,
      stdio: opts.stdio
    })?.toString()
  };
}

export async function runNxCommandAsync(command: string, pkgManagerExec = 'npx', opts: ExecSyncOptions = { cwd: tmpProjPath(), env: process.env, stdio: 'pipe' }) {
  return runNxCommand(command, pkgManagerExec, opts);
}

export function readJson<T extends object = any>(path: string, options?: JsonParseOptions): T{
  return parseJson<T>(readFile(path), options);
}

export function readFile(path: string): string {
  const filePath = isAbsolute(path) ? path : tmpProjPath(path);
  return readFileSync(filePath, 'utf-8');
}

export function getLatestNxWorkspaceVersion():string{
  return getPackageLatestNpmVersion("nx");
}

export function readLocalNxWorkspaceVersion():string{
  const pkgJsonPath = joinPathFragments(workspaceRoot, 'package.json');
  if (!existsSync(pkgJsonPath)) {
    throw new Error(
      'Could not find root package.json to determine dependency versions.'
    );
  }
  
  return readJsonFile(pkgJsonPath).devDependencies["nx"];
}

/**
 * Checks if local Nx version matches latest feature version of Nx
 * @returns `true` if on same feature version, `false` otherwise
 */
export function isLocalNxMatchingLatestFeatureVersion(){
  const localNxVersion = readLocalNxWorkspaceVersion().split('.');
  const latestNxVersion = getLatestNxWorkspaceVersion().split('.');

  return localNxVersion[0] === latestNxVersion[0] && localNxVersion[1] === latestNxVersion?.[1];
}