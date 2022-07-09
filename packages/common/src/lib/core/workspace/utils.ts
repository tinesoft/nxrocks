import { join } from 'path';
import { workspaceRoot } from '@nrwl/workspace/src/utils/app-root';

import { getWorkspaceLayout, ProjectConfiguration, Tree } from '@nrwl/devkit';
import { readFileSync } from 'fs';

export function getProjectRoot(project: ProjectConfiguration) {
  return join(workspaceRoot, project.root);
}

export function getProjectFilePath(
  project: ProjectConfiguration,
  relativeFile: string
) {
  return join(getProjectRoot(project), ...relativeFile.split(/[/\\]/));
}

export function getProjectFileContent(
  project: ProjectConfiguration,
  relativeFile: string
) {
  const filePath = getProjectFilePath(project, relativeFile);
  return readFileSync(filePath, 'utf8');
}

export function getProjectRootDir(tree:Tree, projectType: 'application' | 'library') {
  const { appsDir, libsDir } = getWorkspaceLayout(tree);
  return projectType === 'application' ? appsDir : libsDir;
}