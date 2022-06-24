import { workspaceRoot } from "@nrwl/workspace/src/utils/app-root";
import { fork, execSync, Serializable } from "child_process";
import path = require("path");

export function spawnVerdaccioRegistry(port = 4873) {
  return new Promise((resolve, reject) => {

    const pathVerdaccioModule = require.resolve("verdaccio/bin/verdaccio");
    const configPath = path.join(workspaceRoot, ".verdaccio", "config.yaml");

    const childFork = fork(
      pathVerdaccioModule,
      ["-c", configPath, '-l', `${port}`],
      { 
        silent: false,
      }
    );

    childFork
    .on("message", (msg:Serializable) => msg['verdaccio_started'] && resolve(childFork))
    .on("exit", (code) => reject(`exited with code: ${code}`))
    .on("error", (err: Error) => reject(`errored : ${err}`))
    .on("disconnect", () => reject(['disconnected']));

    console.log('starting local registry');

  });
}


export function enableVerdaccioRegistry(port = 4873) {
  try {
    console.log(`Enabling local registry on port ${port}...`);
    execSync(`npm config set registry http://localhost:${port}/`);
    execSync(`yarn config set registry http://localhost:${port}/`);
  } catch (e) {
    console.error(e);
  }
}

export function disableVerdaccioRegistry() {
  try {
    execSync(`npm config delete registry`);
    execSync(`yarn config delete registry`);

    const CURRENT_NPM_REGISTRY = execSync('npm config get registry').toString('utf-8').trim();
    const CURRENT_YARN_REGISTRY = execSync('yarn config get registry').toString('utf-8').trim();
  
    console.log(` Reverted registries`);
    console.log(` > NPM:  ${CURRENT_NPM_REGISTRY}`);
    console.log(` > YARN: ${CURRENT_YARN_REGISTRY}`);

  } catch (e) {
    console.error(e);
  }
}
