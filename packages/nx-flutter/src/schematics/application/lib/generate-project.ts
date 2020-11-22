import {
    Rule,
    SchematicContext,
    Tree
} from '@angular-devkit/schematics';
import { NormalizedSchema } from '../schema';
import { generateFlutterProject } from '../../../utils/flutter-utils';


export function generateProject(options: NormalizedSchema): Rule {
    return (tree: Tree, context: SchematicContext) => {
        return generateFlutterProject(options, tree, context);
    };
}
