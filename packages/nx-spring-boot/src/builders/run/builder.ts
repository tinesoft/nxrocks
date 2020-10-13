import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect'
import { of, Observable } from 'rxjs'
import { RunBuilderSchema } from './schema'
import { runBootPluginCommand } from '../../utils/boot-utils'

export function runBuilder(options: RunBuilderSchema, context: BuilderContext): Observable<BuilderOutput> {
  return of(runBootPluginCommand(context, 'run', []));
}

export default createBuilder(runBuilder);