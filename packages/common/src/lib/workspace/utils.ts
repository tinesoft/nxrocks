import { basename, dirname, isAbsolute, join, relative, resolve } from 'path';

import { normalizePath, workspaceRoot } from '@nx/devkit';
import { existsSync, readFileSync } from 'fs';

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


export function getProjectRootFromFile(filePath: string){

  const absoluteFilePath = isAbsolute(filePath) ? filePath : resolve(workspaceRoot, filePath);

  const projectRootFilePath = relative(workspaceRoot, absoluteFilePath);
  
  return normalizePath(dirname(projectRootFilePath));
}

export function isNxCrystalEnabled() {
  // should be on by default starting Nx 18
  return !(
    process.env['NX_PCV3'] === 'false' || process.env['NX_CRYSTAL'] === 'false'
  );
}