import {
    noop,
    Rule,
    Tree
} from '@angular-devkit/schematics';
import { NormalizedSchema } from '../schema';
import * as fs from 'fs';
import * as path from 'path';


export function restoreExecutePermission(options: NormalizedSchema): Rule {
    //workaround until issue https://github.com/ZJONSSON/node-unzipper/issues/216 is fixed
    const isWin = process.platform === "win32";
    return isWin ? noop() : (tree: Tree) => {
        const executable = path.normalize(`${process.cwd()}/${options.projectRoot}/${options.type === 'maven-project' ? 'mvnw' : 'gradlew'}`);
        fs.chmodSync(executable, 0o755);
        return tree;
    };
}
