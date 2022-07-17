import {
    logger,
    Tree
} from '@nrwl/devkit';
import {  disableGradlePlugin, stripIndent } from '@nxrocks/common';
import { NormalizedSchema } from '../schema';

export function disableBootGradlePlugin(tree: Tree, options: NormalizedSchema) {
    if (options.projectType === 'library' && options.buildSystem === 'gradle-project') {
        logger.debug(`Disabling 'spring-boot' gradle plugin on a library project...`);

        const disabled = disableGradlePlugin(tree, options.projectRoot, options.language, 'org.springframework.boot');
        if(disabled) {

            const dependencyManagement = options.language === 'kotlin' ?
            stripIndent`
            dependencyManagement {
            	imports {
            		mavenBom(org.springframework.boot.gradle.plugin.SpringBootPlugin.BOM_COORDINATES)
            	}
            }
            `
            :
            stripIndent`
            dependencyManagement {
            	imports {
            		mavenBom org.springframework.boot.gradle.plugin.SpringBootPlugin.BOM_COORDINATES
            	}
            }
            `;
            
            const ext = options.language === 'kotlin' ? '.kts' : ''
            const buildGradlePath = `${options.projectRoot}/build.gradle${ext}`;
            let content = tree.read(buildGradlePath).toString();
    
            content += '\n' + dependencyManagement;
            tree.write(buildGradlePath, content);
        }
    }
    return false;
}
