import { execFileSync } from "child_process";
import startLocalRegistry from "./start-local-registry";
import stopRegistry from './stop-local-registry';


(async () => {

    await startLocalRegistry();
    const nx = require.resolve('nx');
    execFileSync(
        nx,
        ['affected', '-t', 'e2e', '--runInBand', '--exclude', 'smoke'],
        {
            stdio: 'inherit'
        }
    );

    await stopRegistry();

})();

