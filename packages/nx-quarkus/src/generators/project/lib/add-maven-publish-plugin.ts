import { logger, Tree } from '@nx/devkit';
import { addGradlePlugin, stripIndent } from '@nxrocks/common';
import { NormalizedSchema } from '../schema';

export function addMavenPublishPlugin(tree: Tree, options: NormalizedSchema) {
  if (
    options.buildSystem === 'GRADLE' ||
    options.buildSystem === 'GRADLE_KOTLIN_DSL'
  ) {
    logger.debug(`Adding 'maven-publish' plugin...`);

    addGradlePlugin(
      tree,
      options.projectRoot,
      'java',
      'maven-publish',
      undefined,
      options.buildSystem === 'GRADLE_KOTLIN_DSL'
    );

    const artifactSource = 'jar';
    const publishing =
      options.buildSystem === 'GRADLE_KOTLIN_DSL'
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

    // https://quarkus.io/guides/gradle-tooling#publishing-your-application
    const disableEnforcedPlatformValidation =
      options.buildSystem === 'GRADLE_KOTLIN_DSL'
        ? stripIndent`
        tasks.withType<GenerateModuleMetadata>().configureEach {
        	suppressedValidationErrors.add("enforced-platform")
        }
        `
        : stripIndent`
        tasks.withType(GenerateModuleMetadata).configureEach {
        	suppressedValidationErrors.add('enforced-platform')
        }
        `;
    const ext = options.buildSystem === 'GRADLE_KOTLIN_DSL' ? '.kts' : '';
    const buildGradlePath = `${options.projectRoot}/build.gradle${ext}`;
    const content =
      tree.read(buildGradlePath, 'utf-8') +
      '\n' +
      publishing +
      '\n' +
      disableEnforcedPlatformValidation;
    tree.write(buildGradlePath, content);
  }
}
