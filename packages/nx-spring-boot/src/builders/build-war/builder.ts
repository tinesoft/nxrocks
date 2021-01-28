import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect'
import { of, Observable } from 'rxjs'
import * as path from 'path'
import { BuildWarBuilderSchema as BuildWarBuilderSchema } from './schema'
import { runBootPluginCommand } from '../../utils/boot-utils'

export function builder(options: BuildWarBuilderSchema, context: BuilderContext): Observable<BuilderOutput> {
  const root = path.resolve(context.workspaceRoot, options.root);
  return of(runBootPluginCommand(context, 'buildWar', options.args, { cwd : root, ignoreWrapper: options.ignoreWrapper}));
}

export default createBuilder(builder);