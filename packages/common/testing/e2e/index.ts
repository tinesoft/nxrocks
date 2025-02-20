import {
  JsonParseOptions,
  PackageManager,
  detectPackageManager,
  getPackageManagerCommand,
  joinPathFragments,
  parseJson,
  readJsonFile,
  workspaceRoot,
} from '@nx/devkit';
import { getPackageLatestNpmVersion } from '../../src/';
import { exec, ExecOptions, execSync, spawn } from 'child_process';
import {
  rmSync,
  mkdirSync,
  statSync,
  readFileSync,
  existsSync,
} from 'fs-extra';
import { join, dirname, isAbsolute } from 'path';
import { isCI } from 'nx/src/utils/is-ci';
import { dirSync } from 'tmp';

let projName: string;

export const isWin = process.platform === 'win32';

/**
 * Creates a test project with create-nx-workspace and installs the plugin
 * @returns The directory where the test project was created
 */
export function createTestProject(
  pkgManager: PackageManager = detectPackageManager(),
  projectName = 'test-project',
  workspaceVersion: 'latest' | 'local' = 'local'
) {
  const projectDirectory = join(process.cwd(), 'tmp', projectName);

  // Ensure projectDirectory is empty
  rmSync(projectDirectory, {
    recursive: true,
    force: true,
  });
  mkdirSync(dirname(projectDirectory), {
    recursive: true,
  });

  const nxVersion =
    workspaceVersion === 'local' ? readLocalNxWorkspaceVersion() : 'latest';
  const flags = getForceFlags(pkgManager);
  execSync(
    `${
      getPackageManagerCommand(pkgManager).dlx
    } ${flags} create-nx-workspace@${nxVersion} ${projectName} --preset apps --nxCloud=skip --no-interactive --pm ${pkgManager}`,
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
export function createCLITestProject(
  createPkgName: string,
  extraArgs = '',
  projectName = 'test-project',
  createPkgVersion = '0.0.0-e2e',
  pkgManager: PackageManager = detectPackageManager()
) {
  const projectDirectory = join(process.cwd(), 'tmp', projectName);
  const flags = getForceFlags(pkgManager);

  // Ensure projectDirectory is empty
  rmSync(projectDirectory, {
    recursive: true,
    force: true,
  });
  mkdirSync(dirname(projectDirectory), {
    recursive: true,
  });

  const command = `${
    getPackageManagerCommand(pkgManager).dlx
  } ${flags} ${createPkgName}@${createPkgVersion} ${projectName} ${extraArgs} --presetVersion=${createPkgVersion}`;

  try {
    const create = execSync(`${command}${isVerbose() ? ' --verbose' : ''}`, {
      cwd: dirname(projectDirectory),
      stdio: 'inherit',
      env: {
        CI: 'true',
        NX_VERBOSE_LOGGING: isCI ? 'true' : 'false',
        ...process.env,
      },
      encoding: 'utf-8',
    });

    if (isVerbose()) {
      console.log({
        title: `Command: ${command}`,
        bodyLines: [create as string],
        color: 'green',
      });
    }
    console.log(`Created test project in "${projectDirectory}"`);

    return projectDirectory;
  } catch (e) {
    console.error(`Original command: ${command}`, `${e.stdout}\n\n${e.stderr}`);
    throw e;
  }
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
  return join(workspaceRoot, 'tmp', projectName, path);
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

//https://github.com/nrwl/nx/blob/master/packages/plugin/src/utils/testing-utils/async-commands.ts

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
    const childProcess = exec(
      command,
      {
        cwd: opts.cwd ?? tmpProjPath(),
        env: { ...process.env, ...opts.env },
        windowsHide: false,
      },
      (err, stdout, stderr) => {
        if (!opts.silenceError && err) {
          reject(err);
        }
        resolve({ stdout, stderr });
      }
    );

    // Add real-time logging
    childProcess.stdout?.on('data', (data) => {
      console.log(data.toString());
    });

    childProcess.stderr?.on('data', (data) => {
      console.error(data.toString());
    });
  });
}

/**
 * Run a nx command asynchronously inside the e2e directory
 * @param command
 * @param opts
 */
export function runNxCommandAsync(
  command: string,
  opts: { silenceError?: boolean; env?: NodeJS.ProcessEnv; cwd?: string } = {
    silenceError: false,
  }
): Promise<{ stdout: string; stderr: string }> {
  const cwd = opts.cwd ?? tmpProjPath();
  if (fileExists(tmpProjPath('package.json'))) {
    const pmc = getPackageManagerCommand(detectPackageManager(cwd));
    return runCommandAsync(`${pmc.exec} nx ${command}`, opts);
  } else if (process.platform === 'win32') {
    return runCommandAsync(`./nx.bat %${command}`, opts);
  } else {
    return runCommandAsync(`./nx %${command}`, opts);
  }
}

//https://github.com/nrwl/nx/blob/master/packages/plugin/src/utils/testing-utils/commands.ts
/**
 * Run a nx command inside the e2e directory
 * @param command
 * @param opts
 *
 * @see tmpProjPath
 */
export function runNxCommand(
  command?: string,
  opts: { silenceError?: boolean; env?: NodeJS.ProcessEnv; cwd?: string } = {
    silenceError: false,
  }
): string {
  function _runNxCommand(c) {
    const cwd = opts.cwd ?? tmpProjPath();
    const execSyncOptions: ExecOptions = {
      cwd,
      env: { ...process.env, ...opts.env },
      windowsHide: false,
    };
    if (fileExists(tmpProjPath('package.json'))) {
      const pmc = getPackageManagerCommand(detectPackageManager(cwd));
      return execSync(`${pmc.exec} nx ${command}`, execSyncOptions);
    } else if (process.platform === 'win32') {
      return execSync(`./nx.bat %${command}`, execSyncOptions);
    } else {
      return execSync(`./nx %${command}`, execSyncOptions);
    }
  }

  try {
    return _runNxCommand(command)
      .toString()
      .replace(
        /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
        ''
      );
  } catch (e) {
    if (opts.silenceError) {
      return e.stdout.toString();
    } else {
      console.log(e.stdout.toString(), e.stderr.toString());
      throw e;
    }
  }
}

export function runCommand(
  command: string,
  opts: { env?: NodeJS.ProcessEnv; cwd?: string }
): string {
  try {
    return execSync(command, {
      cwd: opts.cwd ?? tmpProjPath(),
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, ...opts?.env },
    }).toString();
  } catch (e) {
    return e.stdout.toString() + e.stderr.toString();
  }
}

export function readJson<T extends object = any>(
  path: string,
  options?: JsonParseOptions
): T {
  return parseJson<T>(readFile(path), options);
}

export function readFile(path: string): string {
  const filePath = isAbsolute(path) ? path : tmpProjPath(path);
  return readFileSync(filePath, 'utf-8');
}

export function getLatestNxWorkspaceVersion(): string {
  return getPackageLatestNpmVersion('nx');
}

export function readLocalNxWorkspaceVersion(): string {
  const pkgJsonPath = joinPathFragments(workspaceRoot, 'package.json');
  if (!existsSync(pkgJsonPath)) {
    throw new Error(
      'Could not find root package.json to determine dependency versions.'
    );
  }

  return readJsonFile(pkgJsonPath).devDependencies['nx'];
}

/**
 * Checks if local Nx version matches latest feature version of Nx
 * @returns `true` if on same feature version, `false` otherwise
 */
export function isLocalNxMatchingLatestFeatureVersion() {
  const localNxVersion = readLocalNxWorkspaceVersion().split('.');
  const latestNxVersion = getLatestNxWorkspaceVersion().split('.');

  return (
    localNxVersion[0] === latestNxVersion[0] &&
    localNxVersion[1] === latestNxVersion?.[1]
  );
}

export function isVerbose() {
  return (
    process.env.NX_VERBOSE_LOGGING === 'true' ||
    process.argv.includes('--verbose')
  );
}

function getForceFlags(packageManager: PackageManager): string {
  switch (packageManager.toLowerCase()) {
    case 'npm':
    case 'npx':
      // Using full form of flags for better clarity
      return '--ignore-existing --yes';
    case 'yarn':
      // yarn doesn't need a no-prompt flag for dlx
      return '--prefer-offline=false';
    case 'pnpm':
      // Using full form of flags for better clarity
      return '--ignore-existing --yes';
    case 'bun':
      // bunx doesn't show prompts by default
      return '--force';
    default:
      throw new Error(`Unsupported package manager: ${packageManager}`);
  }
}
