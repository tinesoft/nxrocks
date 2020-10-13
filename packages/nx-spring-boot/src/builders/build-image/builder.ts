import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect'
import { of, Observable } from 'rxjs'
import { BuildImageBuilderSchema } from './schema'
import { runBootPluginCommand } from '../../utils/boot-utils'

export function runBuilder(options: BuildImageBuilderSchema, context: BuilderContext): Observable<BuilderOutput> {
  return of(runBootPluginCommand(context, 'buildImage', []));
}

export default createBuilder(runBuilder);