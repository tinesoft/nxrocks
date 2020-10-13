import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect'
import { of, Observable } from 'rxjs'
import { BuildJarBuilderSchema } from './schema'
import { runBootPluginCommand } from '../../utils/boot-utils'

export function runBuilder(options: BuildJarBuilderSchema, context: BuilderContext): Observable<BuilderOutput> {
  return of(runBootPluginCommand(context, 'buildJar', []));
}

export default createBuilder(runBuilder);