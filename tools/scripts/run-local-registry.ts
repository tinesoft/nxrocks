import { execSync } from "child_process";
import startLocalRegistry from "./start-local-registry";
import stopRegistry from './stop-local-registry';


(async () => {

    await startLocalRegistry();
    const nx = require.resolve('nx');
    execSync('bunx create-nx-ktor@0.0.0-e2e test-org --prjName=ktapp --useNxWrapper=false --nxCloud=skip --useGitHub=false --no-interactive --presetVersion=0.0.0-e2e',
        {
            stdio: 'inherit'
        }
    );

    await stopRegistry();

})();

