import { basename, dirname, isAbsolute, join, relative, resolve } from 'path';

import {
  NX_VERSION,
  NxJsonConfiguration,
  normalizePath,
  readJsonFile,
  workspaceRoot,
} from '@nx/devkit';
import { existsSync, readFileSync } from 'fs';
import { lt } from 'semver';

export function getProjectRoot(project: { root: string }) {
  return resolve(workspaceRoot, project.root);
}

export function getProjectFilePath(
  project: { root: string },
  relativeFile: string
) {
  return join(getProjectRoot(project), ...relativeFile.split(/[/\\]/));
}

export function hasProjectFile(
  project: { root: string },
  relativeFile: string
) {
  const filePath = getProjectFilePath(project, relativeFile);
  return existsSync(filePath);
}

export function getProjectFileContent(
  project: { root: string },
  relativeFile: string
) {
  const filePath = getProjectFilePath(project, relativeFile);
  return readFileSync(filePath, 'utf8');
}

export function getNameAndRoot(cwd: string) {
  const name = basename(resolve(cwd));
  const root = dirname(cwd);

  return { name, root };
}

export function getProjectRootFromFile(filePath: string) {
  const absoluteFilePath = isAbsolute(filePath)
    ? filePath
    : resolve(workspaceRoot, filePath);

  const projectRootFilePath = relative(workspaceRoot, absoluteFilePath);

  return normalizePath(dirname(projectRootFilePath));
}

export function isNxCrystalEnabled() {
  const nxJson = readJsonFile<NxJsonConfiguration>(`${workspaceRoot}/nx.json`);

  if (lt(NX_VERSION, '18.1.0')) {
    return process.env['NX_ADD_PLUGINS'] !== 'false';
  }
  return (
    process.env['NX_ADD_PLUGINS'] !== 'false' &&
    nxJson.useInferencePlugins !== false
  );
}
