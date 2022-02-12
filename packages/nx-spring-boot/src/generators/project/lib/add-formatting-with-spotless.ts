import {
    Tree
} from '@nrwl/devkit';
import { addSpotlessGradlePlugin, addSpotlessMavenPlugin } from '@nxrocks/common';
import { NormalizedSchema } from '../schema';

export function addFormattingWithSpotless(tree: Tree, options: NormalizedSchema) {

    if (options.buildSystem === 'gradle-project') {
        addSpotlessGradlePlugin(tree, options.projectRoot, options.language, +(options.javaVersion));
    }
    else {
        addSpotlessMavenPlugin(tree, options.projectRoot, options.language, +(options.javaVersion));
    }

}
