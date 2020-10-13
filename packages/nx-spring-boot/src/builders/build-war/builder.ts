import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect'
import { of, Observable } from 'rxjs'
import { BuildWarBuilderSchema as BuildWarBuilderSchema } from './schema'
import { runBootPluginCommand } from '../../utils/boot-utils'

export function runBuilder(options: BuildWarBuilderSchema, context: BuilderContext): Observable<BuilderOutput> {
  return of(runBootPluginCommand(context, 'buildWar', []));
}

export default createBuilder(runBuilder);