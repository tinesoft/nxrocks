import { execFileSync } from "child_process";
import startLocalRegistry from "./start-local-registry";
import stopRegistry from './stop-local-registry';


(async () => {
    
    process.env.LOCAL_REGISTRY_PUBLISH_ALL = 'true';

    await startLocalRegistry();
    const nx = require.resolve('nx');
    execFileSync(
        nx,
        ['affected', '-t', 'e2e', '--runInBand'],
        {
            env: {
                ...process.env,
                'SKIP_LOCAL_REGISTRY_GLOBAL_SETUP': 'true',
            }, stdio: 'inherit'
        }
    );

    await stopRegistry();

})();

