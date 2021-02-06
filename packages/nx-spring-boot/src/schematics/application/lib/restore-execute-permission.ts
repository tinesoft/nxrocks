import {
    Rule,
    Tree
} from '@angular-devkit/schematics';
import { appRootPath } from '@nrwl/workspace/src/utils/app-root';
import { NormalizedSchema } from '../schema';
import * as fs from 'fs';
import * as path from 'path';


export function restoreExecutePermission(options: NormalizedSchema): Rule {
    //workaround until issue https://github.com/ZJONSSON/node-unzipper/issues/216 is fixed
    return (tree: Tree) => {
        const executable = path.normalize(`${appRootPath}/${options.projectRoot}/${options.type === 'maven-project' ? 'mvnw' : 'gradlew'}`);
        fs.chmodSync(executable, 0o755);
        return tree;
    };
}
