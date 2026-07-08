import { Tree } from '@nx/devkit';
import { NX_QUARKUS_PKG } from '../../index';
import { makeServeTargetsDependOnInstall } from '@nxrocks/common-jvm';

export default async function update(tree: Tree) {
  await makeServeTargetsDependOnInstall(tree, [
    `${NX_QUARKUS_PKG}:run`,
    `${NX_QUARKUS_PKG}:serve`,
    `${NX_QUARKUS_PKG}:dev`,
    `${NX_QUARKUS_PKG}:remote-dev`,
  ]);
}
