import { logger, Tree } from '@nx/devkit';
import {  stripIndent , addGradlePlugin } from '@nxrocks/common-jvm';
import { NormalizedSchema } from '../schema';

export function addMavenPublishPlugin(tree: Tree, options: NormalizedSchema) {
  if (
    options.buildSystem === 'GRADLE' ||
    options.buildSystem === 'GRADLE_KOTLIN'
  ) {
    logger.debug(`Adding 'maven-publish' plugin...`);

    let language: 'java' | 'groovy' | 'kotlin';
    switch (options.language) {
      case 'JAVA':
        language = 'java';
        break;
      case 'GROOVY':
        language = 'groovy';
        break;
      case 'KOTLIN':
        language = 'kotlin';
        break;
      default:
        language = 'java';
    }

    addGradlePlugin(
      tree,
      options.projectRoot,
      language,
      'maven-publish',
      undefined,
      options.buildSystem === 'GRADLE_KOTLIN'
    );

    const artifactSource = 'jar';
    const publishing =
      options.buildSystem === 'GRADLE_KOTLIN'
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

    const ext = options.buildSystem === 'GRADLE_KOTLIN' ? '.kts' : '';
    const buildGradlePath = `${options.projectRoot}/build.gradle${ext}`;
    const content = tree.read(buildGradlePath, 'utf-8') + '\n' + publishing;
    tree.write(buildGradlePath, content);
  }
}
