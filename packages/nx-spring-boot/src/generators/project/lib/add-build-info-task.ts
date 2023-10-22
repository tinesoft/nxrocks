import { logger, Tree } from '@nx/devkit';
import { stripIndent } from '@nxrocks/common-jvm';
import { NormalizedSchema } from '../schema';

export function addBuilInfoTask(tree: Tree, options: NormalizedSchema) {
  if (
    options.projectType === 'application' &&
    (options.buildSystem === 'gradle-project' ||
      options.buildSystem === 'gradle-project-kotlin')
  ) {
    const ext = options.buildSystem === 'gradle-project-kotlin' ? '.kts' : '';
    logger.debug(`Adding 'buildInfo' task to the build.gradle${ext} file...`);

    const buildInfoTask = stripIndent`
        springBoot {
        	buildInfo()
        }
        `;
    const buildGradlePath = `${options.projectRoot}/build.gradle${ext}`;
    const content = tree.read(buildGradlePath, 'utf-8') + buildInfoTask;
    tree.write(buildGradlePath, content);
  }
}
