/**
 * This script starts a local registry, populates it by installing packages,then stop the registry.
 * It is meant to allows reusing that storage when running e2e tasks later on.
 */
import { startLocalRegistry } from '@nx/js/plugins/jest/local-registry';
import { releasePublish, releaseVersion } from 'nx/release';

(async () => {

  // local registry target to run
  const localRegistryTarget = 'nxrocks:local-registry';
  // storage folder for the local registry
  const storage = './tmp/local-registry/storage';

  const isVerbose = process.env.NX_VERBOSE_LOGGING === 'true';

  let stopLocalRegistry;

  try {
    stopLocalRegistry = await startLocalRegistry({
      localRegistryTarget,
      storage,
      verbose: isVerbose,
    });

    console.log('Publishing packages to local registry to populate storage...');
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

    stopLocalRegistry();
    console.log('Killed local registry process');
  } catch (err) {
    // Clean up registry if possible after setup related errors
    if (typeof stopLocalRegistry === 'function') {
      stopLocalRegistry();
      console.log('Killed local registry process due to an error during setup');
    }
    console.error('Error:', err);
    process.exit(1);
  }
})();