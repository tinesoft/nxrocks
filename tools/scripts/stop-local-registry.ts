/**
 * This script stops the local registry for e2e testing purposes.
 * It is meant to be called in jest's globalTeardown.
 */

export default () => { 
  if(process.env.SKIP_LOCAL_REGISTRY_GLOBAL_SETUP && process.env.SKIP_LOCAL_REGISTRY_GLOBAL_SETUP !== 'false') {
    console.log("\nEnvironment variable 'SKIP_LOCAL_REGISTRY_GLOBAL_SETUP' is set. Skipping global teardown of Verdaccio's Local Registry...");
    return;
  }

  if (global.stopLocalRegistry) {
    global.stopLocalRegistry();
  }
};
