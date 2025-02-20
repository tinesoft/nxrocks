import { type NxJsonConfiguration, type PackageManager } from '@nx/devkit';
import { execSync } from 'child_process';
import {
  ensureDirSync,
  existsSync,
  readJSONSync,
  rmSync,
  writeJsonSync,
} from 'fs-extra';
import { join, resolve } from 'path';
import { runNxSync } from 'nx/src/utils/child-process';

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
    runNxSync(`add ${pkgName}@${presetVersion}`, {
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

  runNxSync(`g ${pkgName}:preset ${extraArgs}`, {
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
