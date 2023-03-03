
import { workspaceRoot } from '@nrwl/devkit';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';


export function patchEnquirer() {
    // Until https://github.com/enquirer/enquirer/pull/419 is merged and released
    const indexdTs = readFileSync(join(workspaceRoot, 'node_modules/enquirer/index.d.ts'), 'utf8');
    const patchedIndexdTs = indexdTs
        .replace('muliple', 'multiple')
    writeFileSync(join(workspaceRoot, 'node_modules/enquirer/index.d.ts'), patchedIndexdTs);
}
