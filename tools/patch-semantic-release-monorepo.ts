import { workspaceRoot } from '@nrwl/tao/src/utils/app-root';

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

   
// patch the check from `semantic-release-monorepo` to also include scopeless commits 
const fileToPatch = 'node_modules/semantic-release-monorepo/src/only-package-commits.js';
const onlyPackageCommitsJs = readFileSync(join(workspaceRoot, fileToPatch), 'utf8');
const patchedFile = onlyPackageCommitsJs
.replace('    if (packageFile) {',`
    const isScopelessCommit = /^[a-z]+\:/.test(subject);
    if (packageFile || isScopelessCommit) {`)
.replace(`Including commit "%s" because it modified package file "%s".`,`Including commit "%s" either because it has no scope or it modified package file "%s".`)
.replace(`    return !!packageFile;`,`    return !!packageFile || isScopelessCommit;`);

writeFileSync(join(workspaceRoot, fileToPatch), patchedFile);
