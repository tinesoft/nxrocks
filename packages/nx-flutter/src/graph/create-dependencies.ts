import { CreateDependencies } from '@nx/devkit';

import { createDependenciesIf } from '@nxrocks/common';
import { NX_FLUTTER_PKG } from '../index';
import { isFlutterProject } from '../utils/flutter-utils';
import { getPackageInfo } from '../utils/deps-utils';

export const createDependencies: CreateDependencies = (_, ctx) =>
  createDependenciesIf(
    NX_FLUTTER_PKG,
    ['pubspec.yaml'],
    isFlutterProject,
    getPackageInfo,
    ctx
  );
