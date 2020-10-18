import {
    Rule,
    SchematicContext,
    Tree
} from '@angular-devkit/schematics';
import { NormalizedSchema } from '../schema';
import { generateBootProject } from '../../../utils/boot-utils';


export function generateSpringBootProject(options: NormalizedSchema): Rule {
    return (tree: Tree, context: SchematicContext) => {
        return generateBootProject(options, tree, context);
    };
}
