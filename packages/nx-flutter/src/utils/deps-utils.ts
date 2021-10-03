import { load } from 'js-yaml';

import { fileExists } from '@nrwl/workspace/src/utils/fileutils';
import { getProjectFileContent, getProjectFilePath, getProjectRoot, PackageInfo } from '@nxrocks/common';
import { ProjectConfiguration } from '@nrwl/devkit';

interface Pubspec {
  name: string;
  version: string;
  description: string;
  homepage?: string
  documentation?: string
  environment?: Record<string, string>
  dependencies?: Record<string, string>,
  dev_dependencies?: Record<string, string>
}

export function getPackageInfo(project: ProjectConfiguration): PackageInfo {

  if (fileExists(getProjectFilePath(project, 'pubspec.yaml'))) { //

    const pubspec = load(getProjectFileContent(project, 'pubspec.yaml')) as Pubspec;

    const dependencies: PackageInfo[] = [];

    Object.keys(Object.assign({}, pubspec.dependencies, pubspec.dev_dependencies )).forEach(depId => {
      dependencies.push({packageId: depId, packageFile: 'pubspec.yaml'});
    });

    return { packageId: pubspec.name, packageFile: 'pubspec.yaml', dependencies: dependencies};
  }

  throw new Error(
    `Cannot inspect dependencies of Flutter projet at: '${getProjectRoot(project)}'.\n` +
    `No 'pubspec.yaml' was found.`
  );
}