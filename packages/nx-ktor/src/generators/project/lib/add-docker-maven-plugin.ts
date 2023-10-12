import { logger, Tree } from '@nx/devkit';
import { addMavenPlugin } from '@nxrocks/common-jvm';
import { NormalizedSchema } from '../schema';

export function addDockerMavenPlugin(tree: Tree, options: NormalizedSchema) {
  if (options.buildSystem === 'MAVEN') {
    logger.debug(`Adding 'docker-maven' plugin...`);

    addMavenPlugin(
      tree,
      options.projectRoot,
      'io.fabric8',
      'docker-maven-plugin',
      '0.42.0',
      '<!-- More information can be found here: http://dmp.fabric8.io/ -->'
    );
  }
}
