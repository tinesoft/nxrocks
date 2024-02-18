/**
 * This script starts a local registry for e2e testing purposes.
 * It is meant to be called in jest's globalSetup.
 */
import { startLocalRegistry } from '@nx/js/plugins/jest/local-registry';
import { execFileSync } from 'child_process';

export default async () => {
  if(process.env.SKIP_LOCAL_REGISTRY_GLOBAL_SETUP && process.env.SKIP_LOCAL_REGISTRY_GLOBAL_SETUP !== 'false') {
    console.log("Environment variable 'SKIP_LOCAL_REGISTRY_GLOBAL_SETUP' is set. Skipping global setup of Verdaccio's Local Registry...");
    return;
  }

  // local registry target to run
  const localRegistryTarget = 'nxrocks:local-registry';
  // storage folder for the local registry
  const storage = './tmp/local-registry/storage';
  global.stopLocalRegistry = await startLocalRegistry({
    localRegistryTarget,
    storage,
    verbose: false,
  });
  const nx = require.resolve('nx');
  execFileSync(
    nx,
    ['affected', '--target', 'publish', '--ver', '0.0.0-e2e', '--tag', 'latest', '--output-style', 'stream'],
    { env: process.env, stdio: 'inherit' }
  );
};
