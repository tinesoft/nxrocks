import { workspaceRoot } from '@nrwl/tao/src/utils/app-root';

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

   
// activate log in ensureNxProject() call hierarchy
const nxProjectJs = readFileSync(join(workspaceRoot, 'node_modules/@nrwl/nx-plugin/src/utils/testing-utils/nx-project.js'), 'utf8');
const patchedNxProjectJs = nxProjectJs
.replace('silent && false', 'silent')
.replace('silent = true', 'silent = false')
.replace(`runNxNewCommand('', true)`, `runNxNewCommand('', false)`);
writeFileSync(join(workspaceRoot, 'node_modules/@nrwl/nx-plugin/src/utils/testing-utils/nx-project.js'), patchedNxProjectJs);
