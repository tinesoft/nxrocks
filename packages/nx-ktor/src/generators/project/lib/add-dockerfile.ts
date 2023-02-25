import {
    generateFiles,
    logger,
    Tree
} from '@nrwl/devkit';
import { join } from 'path';
import { NormalizedSchema } from '../schema';

export function addDockerfile(tree: Tree, options: NormalizedSchema) {
    if (options.buildSystem === 'MAVEN') { //not necessary for gradle buils thanks to the ktor-gradle-plugin
        logger.debug(`Adding 'Dockerfile'...`);

        const templateOptions = {
            tmpl: ''
        }
        generateFiles(
            tree,
            join(__dirname, '..', 'maven-files'),
            options.projectRoot,
            templateOptions
        );

    }
}
