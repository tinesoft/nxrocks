import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect'
import { of, Observable } from 'rxjs'
import { BuildInfoBuilderSchema } from './schema'
import { runBootPluginCommand } from '../../utils/boot-utils'

export function runBuilder(options: BuildInfoBuilderSchema, context: BuilderContext): Observable<BuilderOutput> {
  return of(runBootPluginCommand(context, 'buildInfo', []));
}

export default createBuilder(runBuilder);