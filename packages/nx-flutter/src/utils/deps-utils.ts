import { load } from 'js-yaml';
import * as path from 'path';
import * as fs from 'fs';

import { fileExists } from '@nrwl/workspace/src/utils/fileutils';

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
export interface PackageInfo {
  packageId: string;
  packageFile: string;
  dependencies?: PackageInfo[];
}

export function getPackageInfo(projectRoot: string): PackageInfo {

  if (fileExists(path.join(projectRoot, 'pubspec.yaml'))) { //flutterproject

    const packageFile = path.join(projectRoot, 'pubspec.yaml');
    const pubspec = load(fs.readFileSync(packageFile, 'utf8')) as Pubspec;

    const dependencies: PackageInfo[] = [];

    Object.keys(Object.assign({}, pubspec.dependencies, pubspec.dev_dependencies )).forEach(depId => {
      dependencies.push({packageId: depId, packageFile});
    });

    return { packageId: pubspec.name, packageFile: 'pubspec.yaml', dependencies: dependencies};
  }

  throw new Error(
    `Cannot inspect dependencies of Flutter projet at: '${projectRoot}'.\n` +
    `No 'pubspec.yaml' was found.`
  );
}