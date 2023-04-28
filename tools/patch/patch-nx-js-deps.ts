
import { workspaceRoot } from '@nx/devkit';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

export function patchNxJsDeps() {
    // until https://github.com/nrwl/nx/issues/9371 is properly fixed, this patch reinstates the reverted fix that was provided in PR #10600
    const nxCheckDependenciesJs = readFileSync(join(workspaceRoot, 'node_modules/@nx/js/src/utils/check-dependencies.js'), 'utf8');
    const patched = nxCheckDependenciesJs
        .replace(' context.targetName, context.configurationName);', ' context.targetName, context.configurationName, true);')
    writeFileSync(join(workspaceRoot, 'node_modules/@nx/js/src/utils/check-dependencies.js'), patched);
}
