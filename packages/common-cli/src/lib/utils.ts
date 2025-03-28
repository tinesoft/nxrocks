import { type NxJsonConfiguration, type PackageManager } from '@nx/devkit';
import { execSync, ExecSyncOptions } from 'child_process';
import {
  ensureDirSync,
  existsSync,
  readJSONSync,
  rmSync,
  writeJsonSync,
} from 'fs-extra';
import { dirname, join, relative, resolve } from 'path';

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const createNxWorkspaceVersion =
  require('../../package.json')?.devDependencies['create-nx-workspace'] ||
  'latest';

export function createWorkspaceWithNxWrapper(
  name: string,
  pkgName: string,
  extraArgs = '',
  nxCloud = 'skip',
  useGitHub = false,
  presetVersion = 'latest',
  nxVersion = createNxWorkspaceVersion,
  silent = true
) {
  const directory = resolve(process.cwd(), name);
  rmSync(directory, {
    recursive: true,
    force: true,
  });

  ensureDirSync(directory);

  execSync(
    `npx --yes nx@${nxVersion} init --nxCloud=${
      nxCloud !== 'skip'
    } --useGitHub=${useGitHub} --useDotNxInstallation --no-interactive`,
    {
      cwd: directory,
      ...(silent ? { stdio: ['ignore', 'ignore', 'ignore'] } : {}),
      env: process.env,
    }
  );

  const nxJsonPath = resolve(directory, 'nx.json');
  const nxJson: NxJsonConfiguration = readJSONSync(nxJsonPath);

  if (isNxCrystalEnabled(nxJson)) {
    runNxWrapperSync(`add ${pkgName}@${presetVersion}`, {
      cwd: directory,
      stdio: 'inherit',
      env: process.env,
    });
  } else {
    nxJson.installation = nxJson.installation ?? {
      version: 'latest',
      plugins: {},
    };
    nxJson.installation.plugins = nxJson.installation.plugins ?? {};
    nxJson.installation.plugins[pkgName] = presetVersion;
    writeJsonSync(nxJsonPath, nxJson, { spaces: 2 });
  }

  runNxWrapperSync(`g ${pkgName}:preset ${extraArgs}`, {
    cwd: directory,
    stdio: 'inherit',
    env: process.env,
  });

  return directory;
}

export function hasNxWrapper(cwd: string) {
  return ['nx', 'nx.bat', 'nx.json', '.nx/nxw.js'].every((file) =>
    existsSync(join(cwd, file))
  );
}

export function getNxCommand(
  useNxWrapper = true,
  pkgManager: PackageManager = 'npm'
) {
  if (!useNxWrapper) {
    switch (pkgManager) {
      case 'npm':
        return 'npx nx';
      default:
        return `$(pkgManager} nx`;
    }
  }
  return process.platform === 'win32' ? '.\\nx.bat' : './nx';
}

export function isNxWrapperInstalled(cwd: string) {
  return (
    hasNxWrapper(cwd) &&
    ['.nx/installation/package.json', '.nx/installation/node_modules'].every(
      (file) => existsSync(join(cwd, file))
    )
  );
}

export function isNxCrystalEnabled(nxJson: NxJsonConfiguration) {
  return (
    process.env['NX_ADD_PLUGINS'] !== 'false' &&
    nxJson.useInferencePlugins !== false
  );
}

// Inspired from https://github.com/nrwl/nx/blob/master/packages/nx/src/utils/child-process.ts#runNxSync()
export function runNxWrapperSync(
  cmd: string,
  options?: ExecSyncOptions & { cwd?: string }
) {
  let baseCmd: string;

  options ??= {};
  options.cwd ??= process.cwd();
  const offsetFromRoot = relative(
    options.cwd,
    workspaceRootInner(options.cwd, null) ?? ''
  );
  if (process.platform === 'win32') {
    baseCmd = '.\\' + join(`${offsetFromRoot}`, 'nx.bat');
  } else {
    baseCmd = './' + join(`${offsetFromRoot}`, 'nx');
  }

  execSync(`${baseCmd} ${cmd}`, options);
}

// Copied from https://github.com/nrwl/nx/blob/master/packages/nx/src/utils/workspace-root.ts
// Mainly because workspaceRootInner is not exported by @nx/devkit
function workspaceRootInner(
  dir: string,
  candidateRoot: string | null
): string | null {
  if (process.env['NX_WORKSPACE_ROOT_PATH'])
    return process.env['NX_WORKSPACE_ROOT_PATH'];
  if (dirname(dir) === dir) return candidateRoot;

  const matches = [join(dir, 'nx.json'), join(dir, 'nx'), join(dir, 'nx.bat')];

  if (matches.some((x) => existsSync(x))) {
    return dir;

    // This handles the case where we have a workspace which uses npm / yarn / pnpm
    // workspaces, and has a project which contains Nx in its dependency tree.
    // e.g. packages/my-lib/package.json contains @nx/devkit, which references Nx and is
    // thus located in //packages/my-lib/node_modules/nx/package.json
  } else if (existsSync(join(dir, 'node_modules', 'nx', 'package.json'))) {
    return workspaceRootInner(dirname(dir), dir);
  } else {
    return workspaceRootInner(dirname(dir), candidateRoot);
  }
}
