import {
    noop,
    Rule,
    SchematicContext,
    Tree
} from '@angular-devkit/schematics';
import { NormalizedSchema } from '../schema';

export function addBuilInfoTask(options: NormalizedSchema): Rule {
    return options.type === 'maven-project' ? noop() : (tree: Tree, _context: SchematicContext) => {

        const buildInfoTask = `
springBoot {
    buildInfo()
}
  `;
        const buildGradlePath = `${options.projectRoot}/build.gradle`;
        const content = tree.read(buildGradlePath).toString() + buildInfoTask;
        tree.overwrite(buildGradlePath, content);

        return tree;
    };
}
