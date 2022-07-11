import {
    logger,
    Tree
} from '@nrwl/devkit';
import { addGradlePlugin, stripIndent } from '@nxrocks/common';
import { NormalizedSchema } from '../schema';

export function addMavenPublishPlugin(tree: Tree, options: NormalizedSchema) {
    if (options.buildSystem === 'gradle-project') {
        logger.debug(`Adding 'maven-publish' plugin...`);

        addGradlePlugin(tree, options.projectRoot, options.language, 'maven-publish');

        const artifactSource = options.projectType === 'application' ? 'bootJar' : 'jar';
        const publishing = options.language === 'kotlin' ?
        stripIndent`
        publishing {
        	publications {
        		create<MavenPublication>("mavenJava") {
        			artifact(tasks.getByName("${artifactSource}"))
        		}
        	}
        }
        `
        :
        stripIndent`
        publishing {
        	publications {
        		mavenJava(MavenPublication) {
        			artifact ${artifactSource}
        		}
        	}
        }
        `;
        const ext = options.language === 'kotlin' ? '.kts' : '';
        const buildGradlePath = `${options.projectRoot}/build.gradle${ext}`;
        const content = tree.read(buildGradlePath, 'utf-8') + '\n' + publishing;
        tree.write(buildGradlePath, content);
    }
}
