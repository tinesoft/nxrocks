import { Tree } from '@nx/devkit';
import { NX_KTOR_PKG } from '../../index';
import { makeServeTargetsDependOnInstall } from '@nxrocks/common-jvm';

export default async function update(tree: Tree) {
  await makeServeTargetsDependOnInstall(tree, [
    `${NX_KTOR_PKG}:run`,
    `${NX_KTOR_PKG}:serve`,
  ]);
}
