import {
  PackageManager,
  detectPackageManager,
  getPackageManagerCommand,
  joinPathFragments,
  readJsonFile,
  workspaceRoot,
} from '@nx/devkit';
import {
  checkFilesExist,
  fileExists,
  readFile,
  readJson,
  runCommand,
  runCommandAsync,
  tmpProjPath,
} from '@nx/plugin/testing';
import { rmSync, existsSync, ensureDirSync } from 'fs-extra';
import { dirname, basename, resolve } from 'path';
import { getPackageLatestNpmVersion } from '../../src';

export { checkFilesExist, readFile, readJson, tmpProjPath };
export const isWin = process.platform === 'win32';

/**
 * Creates a test project with create-nx-workspace and installs the plugin
 * @returns The directory where the test project was created
 */
export function createTestProject(
  projectName = 'test-project',
  pkgManager: PackageManager = detectPackageManager(),
  workspaceVersion: 'latest' | 'local' = 'local'
) {
  const projectDirectory = tmpProjPath(projectName);
  const workspaceName = basename(projectDirectory);
  const workspaceParentDir = dirname(projectDirectory);

  rmSync(projectDirectory, {
    recursive: true,
    force: true,
  });
  ensureDirSync(workspaceParentDir);

  const nxVersion =
    workspaceVersion === 'local' ? readLocalNxWorkspaceVersion() : 'latest';
  const flags = getForceFlags(pkgManager);

  const command = `${
    getPackageManagerCommand(pkgManager).dlx
  } ${flags} create-nx-workspace@${nxVersion} ${workspaceName} --preset apps --nxCloud=skip --no-interactive --pm ${pkgManager}`;

  console.log(
    `Creating a sandbox project in '${projectDirectory}' with command: '${command}'...`
  );

  try {
    const output = runCommand(command, {
      cwd: workspaceParentDir,
    });

    console.log(`Output: ${output}`);

    return projectDirectory;
  } catch (e) {
    console.error(
      `Original command: ${command}`,
      `stdout: ${e.stdout}\n\nstderr: ${e.stderr}`
    );
    throw e;
  }
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
  const projectDirectory = tmpProjPath(projectName);
  const workspaceParentDir = dirname(projectDirectory);

  rmSync(projectDirectory, {
    recursive: true,
    force: true,
  });
  ensureDirSync(workspaceParentDir);

  const flags = getForceFlags(pkgManager);

  const command = `${
    getPackageManagerCommand(pkgManager).dlx
  } ${flags} ${createPkgName}@${createPkgVersion} ${projectName} ${extraArgs} --presetVersion=${createPkgVersion}`;

  console.log(
    `Creating a sandbox project in '${projectDirectory}' with command: '${command}'...`
  );

  try {
    const output = runCommand(command, {
      cwd: workspaceParentDir,
    });

    console.log(`Output: ${output}`);

    return projectDirectory;
  } catch (e) {
    console.error(
      `Original command: ${command}`,
      `stdout: ${e.stdout}\n\nstderr: ${e.stderr}`
    );
    throw e;
  }
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

// taken from https://github.com/nrwl/nx/blob/master/e2e/utils/file-utils.ts#L76
// main diff: we use the `cwd` from either 'opts.cwd' or 'tmpProjPath()'
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
) {
  const cwd = opts.cwd ?? tmpProjPath();
  if (fileExists(resolve(cwd, 'package.json'))) {
    const pmc = getPackageManagerCommand(detectPackageManager(cwd));
    return runCommandAsync(`${pmc.exec} nx ${command}`, opts);
  } else if (isWin) {
    return runCommandAsync(`./nx.bat %${command}`, opts);
  } else {
    return runCommandAsync(`./nx ${command}`, opts);
  }
}
