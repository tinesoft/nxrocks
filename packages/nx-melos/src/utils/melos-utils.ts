import { ProjectConfiguration } from '@nx/devkit';
import { fileExists } from '@nx/workspace/src/utils/fileutils';
import { getProjectFilePath } from '@nxrocks/common';
import { execSync } from 'child_process';

export function isDartInstalled(): boolean {
  try {
    execSync('dart --version', { stdio: ['ignore', 'ignore', 'ignore'] });
    return true;
  } catch (e) {
    return false;
  }
}

export function getDartSDKVersion(): string | null {
  try {
    const rawVersion = execSync('dart --version', {
      stdio: ['ignore', 'ignore', 'ignore'],
    }).toString();
    return /Dart SDK version: (\d+\.\d+\.\d+)/.exec(rawVersion).groups?.[1];
  } catch (e) {
    return null;
  }
}

export function isDartProject(project: ProjectConfiguration): boolean {
  return fileExists(getProjectFilePath(project, 'pubspec.yaml'));
}
