import { logger, Tree } from '@nx/devkit';
import { stripIndent } from '@nxrocks/common';
import { addGradlePlugin } from '@nxrocks/common-jvm';
import { NormalizedSchema } from '../schema';

export function addMavenPublishPlugin(tree: Tree, options: NormalizedSchema) {
  if (
    options.buildSystem === 'gradle-project' ||
    options.buildSystem === 'gradle-project-kotlin'
  ) {
    logger.debug(`Adding 'maven-publish' plugin...`);

    addGradlePlugin(
      tree,
      options.projectRoot,
      options.language,
      'maven-publish',
      undefined,
      options.buildSystem === 'gradle-project-kotlin'
    );

    const artifactSource =
      options.projectType === 'application' ? 'bootJar' : 'jar';
    const publishing =
      options.buildSystem === 'gradle-project-kotlin'
        ? stripIndent`
        publishing {
        	publications {
        		create<MavenPublication>("mavenJava") {
        			artifact(tasks.getByName("${artifactSource}"))
        		}
        	}
        }
        `
        : stripIndent`
        publishing {
        	publications {
        		mavenJava(MavenPublication) {
        			artifact ${artifactSource}
        		}
        	}
        }
        `;
    const ext = options.buildSystem === 'gradle-project-kotlin' ? '.kts' : '';
    const buildGradlePath = `${options.projectRoot}/build.gradle${ext}`;
    const content = tree.read(buildGradlePath, 'utf-8') + '\n' + publishing;
    tree.write(buildGradlePath, content);
  }
}
