import {logger, Tree} from '@nrwl/devkit';
import { appRootPath } from '@nrwl/workspace/src/utils/app-root';
import { NormalizedSchema } from '../schema';
import * as fs from 'fs';

export function restoreExecutePermission(tree: Tree, options: NormalizedSchema) {
    //workaround until issue https://github.com/ZJONSSON/node-unzipper/issues/216 is fixed

    const executable = `${appRootPath}/${options.projectRoot}/${options.buildSystem === 'maven-project' ? 'mvnw' : 'gradlew'}`;
    logger.debug(`Restoring write permission on wrapper executable at '${executable}'...`);

    fs.chmodSync(executable, 0o755);
}
