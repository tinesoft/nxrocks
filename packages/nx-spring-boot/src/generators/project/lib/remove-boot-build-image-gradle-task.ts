import { logger, Tree } from '@nx/devkit';
import { NormalizedSchema } from '../schema';
import { stripIndent } from '@nxrocks/common-jvm';

export function removeBootBuildImageGradleTask(tree: Tree, options: NormalizedSchema) {
  if (
    options.projectType === 'library' &&
    (options.buildSystem === 'gradle-project' ||
      options.buildSystem === 'gradle-project-kotlin')
  ) {
    logger.debug(
      `Removing 'bootBuildImage' gradle task on a library project...`
    );

    const taskToRemove = options.buildSystem === 'gradle-project-kotlin' ?
      stripIndent`
      tasks.bootBuildImage {
      	builder.set("paketobuildpacks/builder-jammy-base:latest")
      }
      `
      :
      stripIndent`
      tasks.named('bootBuildImage') {
      	builder = 'paketobuildpacks/builder-jammy-base:latest'
      }
      `;

    const ext = options.buildSystem === 'gradle-project-kotlin' ? '.kts' : '';
    const buildGradlePath = `${options.projectRoot}/build.gradle${ext}`;
    let content = tree.read(buildGradlePath).toString();

    content = content.replace(taskToRemove, '');
    tree.write(buildGradlePath, content);
  }
}
