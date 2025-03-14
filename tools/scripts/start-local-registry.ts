/**
 * This script starts a local registry for e2e testing purposes.
 * It is meant to be called in jest's globalSetup.
 */
import { startLocalRegistry } from '@nx/js/plugins/jest/local-registry';
import { releasePublish, releaseVersion } from 'nx/release';
import { readdirSync } from 'fs';
import { joinPathFragments, workspaceRoot } from '@nx/devkit';

function isFolderEmptySync(folderPath: string): boolean {
    try {
        const files = readdirSync(folderPath);
        const relevantFiles = files.filter(file => file !== '.verdaccio-db.json');
        return relevantFiles.length === 0;
    } catch (error) {
        return true; // we consider the folder empty if we cannot read it
    }
}

export default async () => {

  // local registry target to run
  const localRegistryTarget = 'nxrocks:local-registry';
  // storage folder for the local registry
  const storage = joinPathFragments(
    workspaceRoot,
    'tmp/local-registry/storage',
  );

  const isVerbose = process.env.NX_VERBOSE_LOGGING === 'true';

  /**
   * We populate the verdaccio storage up front, so we only need to start the local registry and serves that storage.
   * Otherwise, if the storage is empty, we do a full release to populate it again. This allows speeding up e2e tests
   */
  const requiresLocalRelease = isFolderEmptySync(storage) || process.env.FORCE_LOCAL_RELEASE === 'true';

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

export async function startLocalRelease(isVerbose=false) {

  await releaseVersion({
    specifier: '0.0.0-e2e',
    stageChanges: false,
    gitCommit: false,
    gitTag: false,
    firstRelease: true,
    generatorOptionsOverrides: {
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
