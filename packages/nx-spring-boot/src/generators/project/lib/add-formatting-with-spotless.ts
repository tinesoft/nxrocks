import {
    readJson,
    Tree
} from '@nrwl/devkit';
import { addSpotlessGradlePlugin, addSpotlessMavenPlugin } from '@nxrocks/common';
import { NormalizedSchema } from '../schema';

export function addFormattingWithSpotless(tree: Tree, options: NormalizedSchema) {

    const nxJson = readJson(tree, 'nx.json');
    const gitBaseBranch = nxJson.affected?.defaultBase || 'master';

    if (options.buildSystem === 'gradle-project') {
        addSpotlessGradlePlugin(tree, options.projectRoot, options.language, +(options.javaVersion), gitBaseBranch);
    }
    else {
        addSpotlessMavenPlugin(tree, options.projectRoot, options.language, +(options.javaVersion), gitBaseBranch);
    }

}
