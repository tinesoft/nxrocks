import {
    Tree
} from '@nrwl/devkit';
import { addSpotlessGradlePlugin, addSpotlessMavenPlugin } from '@nxrocks/common';
import { NormalizedSchema } from '../schema';

export function addFormattingWithSpotless(tree: Tree, options: NormalizedSchema) {

    if (options.buildSystem === 'MAVEN') {
        addSpotlessMavenPlugin(tree, options.projectRoot, 'kotlin', 11);
    }
    else {
        addSpotlessGradlePlugin(tree, options.projectRoot, 'kotlin', 11, null, options.buildSystem === 'GRADLE_KTS');
    }

}
