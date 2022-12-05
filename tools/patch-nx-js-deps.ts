
import { workspaceRoot } from '@nrwl/devkit';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

   
// until https://github.com/nrwl/nx/issues/9371 is properly fixed, this patch reinstates the reverted fix that was provided in PR #10600
const nxCheckDependenciesJs = readFileSync(join(workspaceRoot, 'node_modules/@nrwl/js/src/utils/check-dependencies.js'), 'utf8');
const patched = nxCheckDependenciesJs
.replace(' context.targetName, context.configurationName);', ' context.targetName, context.configurationName, true);')
writeFileSync(join(workspaceRoot, 'node_modules/@nrwl/js/src/utils/check-dependencies.js'), patched);
