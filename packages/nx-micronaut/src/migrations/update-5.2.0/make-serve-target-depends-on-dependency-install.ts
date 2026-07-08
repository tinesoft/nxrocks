import { Tree } from '@nx/devkit';
import { NX_MICRONAUT_PKG } from '../../index';
import { makeServeTargetsDependOnInstall } from '@nxrocks/common-jvm';

export default async function update(tree: Tree) {
  await makeServeTargetsDependOnInstall(tree, [
    `${NX_MICRONAUT_PKG}:run`,
    `${NX_MICRONAUT_PKG}:serve`,
  ]);
}
