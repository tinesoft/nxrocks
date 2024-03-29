import { JsonParseOptions, PackageManager, detectPackageManager, getPackageManagerCommand, joinPathFragments, parseJson, readJsonFile, workspaceRoot } from '@nx/devkit';
import { getPackageLatestNpmVersion } from '../../src/';
import { exec, execSync } from 'child_process';
import { rmSync, mkdirSync, statSync, readFileSync, existsSync } from 'fs-extra';
import { join, dirname, isAbsolute } from 'path';


export const isWin = process.platform === 'win32';

/**
 * Creates a test project with create-nx-workspace and installs the plugin
 * @returns The directory where the test project was created
 */
export function createTestProject(pkgManager: PackageManager = 'npm', projectName = 'test-project', workspaceVersion: 'latest' | 'local' = 'local') {
  const projectDirectory = join(process.cwd(), 'tmp', projectName);

  // Ensure projectDirectory is empty
  rmSync(projectDirectory, {
    recursive: true,
    force: true,
  });
  mkdirSync(dirname(projectDirectory), {
    recursive: true,
  });

  const nxVersion = workspaceVersion === 'local' ? readLocalNxWorkspaceVersion() : 'latest';

  const confirm = pkgManager === 'npm' ? ' --yes' : '';
  execSync(
    `${getPackageManagerCommand(pkgManager).dlx}${confirm} create-nx-workspace@${nxVersion} ${projectName} --preset apps --nxCloud=skip --no-interactive --pm ${pkgManager}`,
    {
      cwd: dirname(projectDirectory),
      stdio: 'inherit',
      env: process.env,
    }
  );

  console.log(`Created test project in "${projectDirectory}"`);

  return projectDirectory;
}

/**
 * Creates a test project with create-nx-workspace and installs the plugin
 * @returns The directory where the test project was created
 */
export function createCLITestProject(createPkgName: string, extraArgs = '', createPkgVersion = '0.0.0-e2e', pkgManager: PackageManager = 'npm', projectName = 'test-project') {

  const projectDirectory = join(process.cwd(), 'tmp', projectName);

  // Ensure projectDirectory is empty
  rmSync(projectDirectory, {
    recursive: true,
    force: true,
  });
  mkdirSync(dirname(projectDirectory), {
    recursive: true,
  });

  execSync(`${getPackageManagerCommand(pkgManager).dlx} --yes ${createPkgName}@${createPkgVersion} ${projectName} ${extraArgs}`, {
    cwd: dirname(projectDirectory),
    stdio: 'inherit',
    env: process.env,
  });
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


//https://github.com/nrwl/nx/blob/master/e2e/utils/create-project-utils.ts#L628

/**
 * Run a command asynchronously inside the e2e directory.
 *
 * @param command
 * @param opts
 */
export function runCommandAsync(
  command: string,
  opts: { silenceError?: boolean; env?: NodeJS.ProcessEnv; cwd?: string } = {
    silenceError: false,
  }
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    exec(
      command,
      {
        cwd: opts.cwd ?? tmpProjPath(),
        env: { ...process.env, ...opts.env },
      },
      (err, stdout, stderr) => {
        if (!opts.silenceError && err) {
          reject(err);
        }
        resolve({ stdout, stderr });
      }
    );
  });
}

/**
 * Run a nx command asynchronously inside the e2e directory
 * @param command
 * @param opts
 */
export function runNxCommandAsync(
  command: string,
  pkgManager?: PackageManager,
  opts: { silenceError?: boolean; env?: NodeJS.ProcessEnv; cwd?: string } = {
    silenceError: false,
  }
): Promise<{ stdout: string; stderr: string }> {
  const cwd = opts.cwd ?? tmpProjPath();
  if (fileExists(tmpProjPath('package.json'))) {
    const pmc = getPackageManagerCommand(pkgManager || detectPackageManager(cwd));
    return runCommandAsync(`${pmc.exec} nx ${command}`, opts);
  } else if (process.platform === 'win32') {
    return runCommandAsync(`./nx.bat %${command}`, opts);
  } else {
    return runCommandAsync(`./nx %${command}`, opts);
  }
}

/**
 * Run a nx command synchronously inside the e2e directory
 * @param command
 * @param opts
 */
export async function runNxCommand(
  command: string,
  pkgManager?: PackageManager,
  opts: { silenceError?: boolean; env?: NodeJS.ProcessEnv; cwd?: string } = {
    silenceError: false,
  }
): Promise<{ stdout: string; stderr: string; }> {

  return await runNxCommandAsync(command,pkgManager, opts);

}

export function readJson<T extends object = any>(path: string, options?: JsonParseOptions): T {
  return parseJson<T>(readFile(path), options);
}

export function readFile(path: string): string {
  const filePath = isAbsolute(path) ? path : tmpProjPath(path);
  return readFileSync(filePath, 'utf-8');
}

export function getLatestNxWorkspaceVersion(): string {
  return getPackageLatestNpmVersion("nx");
}

export function readLocalNxWorkspaceVersion(): string {
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
export function isLocalNxMatchingLatestFeatureVersion() {
  const localNxVersion = readLocalNxWorkspaceVersion().split('.');
  const latestNxVersion = getLatestNxWorkspaceVersion().split('.');

  return localNxVersion[0] === latestNxVersion[0] && localNxVersion[1] === latestNxVersion?.[1];
}