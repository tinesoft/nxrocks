/**
 * This script starts a local registry for e2e testing purposes.
 * It is meant to be called in jest's globalSetup.
 */
import { startLocalRegistry } from '@nx/js/plugins/jest/local-registry';
import { directoryExists } from '@nx/workspace/src/utilities/fileutils';
import { releasePublish, releaseVersion } from 'nx/release';

export default async () => {
  if (
    process.env.SKIP_LOCAL_REGISTRY_GLOBAL_SETUP &&
    process.env.SKIP_LOCAL_REGISTRY_GLOBAL_SETUP !== 'false'
  ) {
    console.log(
      "Environment variable 'SKIP_LOCAL_REGISTRY_GLOBAL_SETUP' is set. Skipping global setup of Verdaccio's Local Registry..."
    );
    return;
  }

  // local registry target to run
  const localRegistryTarget = 'nxrocks:local-registry';
  // storage folder for the local registry
  const storage = './tmp/local-registry/storage';

  const isVerbose = process.env.NX_VERBOSE_LOGGING === 'true';

  /**
   * For e2e-ci we populate the verdaccio storage up front, but for other workflows we need
   * to run the full local release process before running tests.
   */
  const requiresLocalRelease =
    !process.env.NX_TASK_TARGET_TARGET?.startsWith('e2e-ci') && !directoryExists(storage);

  global.stopLocalRegistry = await startLocalRegistry({
    localRegistryTarget,
    storage,
    verbose: isVerbose,
    clearStorage: requiresLocalRelease
  });

  if (requiresLocalRelease) {
    await releaseVersion({
      specifier: '0.0.0-e2e',
      stageChanges: false,
      gitCommit: false,
      gitTag: false,
      firstRelease: true,
      generatorOptionsOverrides: {
        skipLockFileUpdate: true,
      },
    });
    await releasePublish({
      tag: 'e2e',
      firstRelease: true,
    });
  }
};
