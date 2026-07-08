import { Tree } from '@nx/devkit';
import { NX_SPRING_BOOT_PKG } from '../../index';
import { makeServeTargetsDependOnInstall } from '@nxrocks/common-jvm';

export default async function update(tree: Tree) {
  await makeServeTargetsDependOnInstall(tree, [
    `${NX_SPRING_BOOT_PKG}:run`,
    `${NX_SPRING_BOOT_PKG}:serve`,
  ]);
}
