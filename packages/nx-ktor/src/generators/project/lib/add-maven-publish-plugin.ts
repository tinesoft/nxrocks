import { logger, Tree } from '@nx/devkit';
import { stripIndent } from '@nxrocks/common';
import { addGradlePlugin } from '@nxrocks/common-jvm';
import { NormalizedSchema } from '../schema';

export function addMavenPublishPlugin(tree: Tree, options: NormalizedSchema) {
  if (
    options.buildSystem === 'GRADLE' ||
    options.buildSystem === 'GRADLE_KTS'
  ) {
    logger.debug(`Adding 'maven-publish' plugin...`);

    addGradlePlugin(
      tree,
      options.projectRoot,
      'kotlin',
      'maven-publish',
      undefined,
      options.buildSystem === 'GRADLE_KTS'
    );

    const artifactSource = 'jar';
    const publishing =
      options.buildSystem === 'GRADLE_KTS'
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

    const ext = options.buildSystem === 'GRADLE_KTS' ? '.kts' : '';
    const buildGradlePath = `${options.projectRoot}/build.gradle${ext}`;
    const content = tree.read(buildGradlePath, 'utf-8') + '\n' + publishing;
    tree.write(buildGradlePath, content);
  }
}
