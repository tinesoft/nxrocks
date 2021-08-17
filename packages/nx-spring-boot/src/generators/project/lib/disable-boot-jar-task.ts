import {
    logger,
    Tree
} from '@nrwl/devkit';
import { NormalizedSchema } from '../schema';

export function disableBootJarTask(tree: Tree, options: NormalizedSchema) {
    if (options.projectType === 'library' && options.buildSystem === 'gradle-project') {
        logger.debug(`Disabling 'bootJar' task on a library project...`);

        const bootJarDisabledTask = `
// spring boot library projects don't need an executable jar, so we disable it
bootJar {
    enabled = false
}
`;
        const jarEnabledTask = `
jar {
    enabled = true
}
`;
        const ext = options.language === 'kotlin' ? '.kts' : ''
        const buildGradlePath = `${options.projectRoot}/build.gradle${ext}`;
        let content = tree.read(buildGradlePath).toString();

        content += bootJarDisabledTask + '\n' + jarEnabledTask;
        tree.write(buildGradlePath, content);
    }
}
