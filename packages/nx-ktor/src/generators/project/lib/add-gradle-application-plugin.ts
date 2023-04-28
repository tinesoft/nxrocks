import { logger, Tree } from '@nx/devkit';
import { addGradlePlugin, stripIndent } from '@nxrocks/common';
import { NormalizedSchema } from '../schema';

export function addGradleApplicationPlugin(
  tree: Tree,
  options: NormalizedSchema
) {
  if (
    options.buildSystem === 'GRADLE' ||
    options.buildSystem === 'GRADLE_KTS'
  ) {
    logger.debug(`Adding 'application' plugin...`);

    addGradlePlugin(
      tree,
      options.projectRoot,
      'kotlin',
      'application',
      undefined,
      options.buildSystem === 'GRADLE_KTS'
    );

    const application =
      options.buildSystem === 'GRADLE_KTS'
        ? stripIndent`
        application {
        	mainClass.set("${options.groupId}.ApplicationKt")
        }
        `
        : stripIndent`
        application {
        	mainClass = '${options.groupId}.ApplicationKt'
        }
        `;

    const ext = options.buildSystem === 'GRADLE_KTS' ? '.kts' : '';
    const buildGradlePath = `${options.projectRoot}/build.gradle${ext}`;
    const content = tree.read(buildGradlePath, 'utf-8') + '\n' + application;
    tree.write(buildGradlePath, content);
  }
}
