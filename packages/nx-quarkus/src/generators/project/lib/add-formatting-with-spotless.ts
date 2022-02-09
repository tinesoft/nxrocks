import {
    readJson,
    Tree
} from '@nrwl/devkit';
import { addSpotlessMavenPlugin, applySpotlessGradlePlugin } from '@nxrocks/common';
import { NormalizedSchema } from '../schema';

export function addFormattingWithSpotless(tree: Tree, options: NormalizedSchema) {

    const nxJson = readJson(tree, 'nx.json');
    const gitBaseBranch = nxJson.affected?.defaultBase || 'master';

    if (options.buildSystem === 'MAVEN') {
        addSpotlessMavenPlugin(tree, options.projectRoot, 'java', 11, gitBaseBranch);
    }
    else {
        applySpotlessGradlePlugin(tree, options.projectRoot, 'java', 11, gitBaseBranch);
    }

}
