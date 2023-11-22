import { logger, Tree } from '@nx/devkit';
import { stripIndent } from '@nxrocks/common-jvm';
import { disableGradlePlugin } from '@nxrocks/common-jvm';
import { NormalizedSchema } from '../schema';

export function disableBootGradlePlugin(tree: Tree, options: NormalizedSchema) {
  if (
    options.projectType === 'library' &&
    (options.buildSystem === 'gradle-project' ||
      options.buildSystem === 'gradle-project-kotlin')
  ) {
    logger.debug(
      `Disabling 'spring-boot' gradle plugin on a library project...`
    );

    const disabled = disableGradlePlugin(
      tree,
      options.projectRoot,
      options.language,
      'org.springframework.boot',
      options.buildSystem === 'gradle-project-kotlin'
    );
    if (disabled) {
      const dependencyManagement =
        options.buildSystem === 'gradle-project-kotlin'
          ? stripIndent`
            dependencyManagement {
            	imports {
            		mavenBom(org.springframework.boot.gradle.plugin.SpringBootPlugin.BOM_COORDINATES)
            	}
            }
            `
          : stripIndent`
            dependencyManagement {
            	imports {
            		mavenBom org.springframework.boot.gradle.plugin.SpringBootPlugin.BOM_COORDINATES
            	}
            }
            `;

      const ext = options.buildSystem === 'gradle-project-kotlin' ? '.kts' : '';
      const buildGradlePath = `${options.projectRoot}/build.gradle${ext}`;
      let content = tree.read(buildGradlePath).toString();

      content += '\n' + dependencyManagement;
      tree.write(buildGradlePath, content);
    }
  }
  return false;
}
