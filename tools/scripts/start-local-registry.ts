/**
 * This script starts a local registry for e2e testing purposes.
 * It is meant to be called in jest's globalSetup.
 */
import { startLocalRegistry } from '@nx/js/plugins/jest/local-registry';
import { releasePublish, releaseVersion } from 'nx/release';
import { joinPathFragments, workspaceRoot } from '@nx/devkit';

const setupLocalRegistry = async () => {

  // local registry target to run
  const localRegistryTarget = 'nxrocks:local-registry';
  // storage folder for the local registry
  const storage = joinPathFragments(
    workspaceRoot,
    'tmp/local-registry/storage',
  );

  const isVerbose = process.env.NX_VERBOSE_LOGGING === 'true';

    /**
     * For e2e-ci we populate the verdaccio storage up front, but for other workflows we need
     * to run the full local release process before running tests.
     */
  const requiresLocalRelease = !process.env.NX_TASK_TARGET_TARGET?.startsWith('e2e-ci');

  global.stopLocalRegistry = await startLocalRegistry({
    localRegistryTarget,
    storage,
    verbose: isVerbose,
    clearStorage: requiresLocalRelease,
    listenAddress: '0.0.0.0',
  });

  if (requiresLocalRelease) {
    console.log('>>> Started the local registry, with local release');

    await startLocalRelease(isVerbose);
  }
  else {
    console.log('>>> Started the local registry, but no local release was perfomed')
  }
};

export default setupLocalRegistry;

export async function startLocalRelease(isVerbose=false) {

  await releaseVersion({
    specifier: '0.0.0-e2e',
    stageChanges: false,
    gitCommit: false,
    gitTag: false,
    firstRelease: true,
    versionActionsOptionsOverrides: {
      skipLockFileUpdate: true
    },
    verbose: isVerbose,
  });

  return await releasePublish({
    tag: 'e2e',
    firstRelease: true,
    verbose: isVerbose,
  });
}
