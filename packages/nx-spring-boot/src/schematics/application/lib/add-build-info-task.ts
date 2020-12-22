import {
    noop,
    Rule,
    Tree
} from '@angular-devkit/schematics';
import { NormalizedSchema } from '../schema';

export function addBuilInfoTask(options: NormalizedSchema): Rule {
    return options.type === 'maven-project' ? noop() : (tree: Tree) => {

        const buildInfoTask = `
springBoot {
    buildInfo()
}
  `;
        const ext = options.language === 'kotlin' ? '.kts' : ''
        const buildGradlePath = `${options.projectRoot}/build.gradle${ext}`;
        const content = tree.read(buildGradlePath).toString() + buildInfoTask;
        tree.overwrite(buildGradlePath, content);

        return tree;
    };
}
