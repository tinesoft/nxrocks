import { basename, dirname, isAbsolute, join, relative, resolve } from 'path';

import { normalizePath, workspaceRoot } from '@nx/devkit';
import { readFileSync } from 'fs';

export function getProjectRoot(project: { root: string }) {
  return resolve(workspaceRoot, project.root);
}

export function getProjectFilePath(
  project: { root: string },
  relativeFile: string
) {
  return join(getProjectRoot(project), ...relativeFile.split(/[/\\]/));
}

export function getProjectFileContent(
  project: { root: string },
  relativeFile: string
) {
  const filePath = getProjectFilePath(project, relativeFile);
  return readFileSync(filePath, 'utf8');
}

export function getNameAndRoot(file: string) {
  const root = dirname(file);

  // eslint-disable-next-line no-useless-escape -- eslint's wrong
  const parts = root.split(/[\/\\]/g);
  const name = parts[parts.length - 1].toLowerCase();

  return { root, name };
}


export function getCurrentAndParentFolder(cwd: string) {
  const currentFolder = basename(resolve(cwd));
  const parentFolder = dirname(cwd);

  return { currentFolder, parentFolder };
}


export function getProjectRootFromFile(filePath: string){

  const absoluteFilePath = isAbsolute(filePath) ? filePath : resolve(workspaceRoot, filePath);

  const projectRootFilePath = relative(workspaceRoot, absoluteFilePath);
  
  return normalizePath(dirname(projectRootFilePath));
}