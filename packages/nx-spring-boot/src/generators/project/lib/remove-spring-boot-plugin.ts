import { logger, Tree } from '@nx/devkit';
import { removeMavenPlugin } from '@nxrocks/common-jvm';
import { NormalizedSchema } from '../schema';

export function removeBootMavenPlugin(tree: Tree, options: NormalizedSchema) {
  if (
    options.projectType === 'library' &&
    options.buildSystem === 'maven-project'
  ) {
    logger.debug(`Removing 'spring-boot' maven plugin on a library project...`);

    return removeMavenPlugin(
      tree,
      options.projectRoot,
      'org.springframework.boot',
      'spring-boot-maven-plugin'
    );
  }
  return false;
}
