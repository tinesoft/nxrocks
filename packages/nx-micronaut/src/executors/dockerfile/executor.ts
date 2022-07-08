import { ExecutorContext } from '@nrwl/devkit'
import * as path from 'path'
import { DockerfileExecutorOptions } from './schema'
import { runMicronautPluginCommand } from '../../utils/micronaut-utils'

export async function buildExecutor(options: DockerfileExecutorOptions, context: ExecutorContext){
  const root = path.resolve(context.root, options.root);
  return runMicronautPluginCommand('dockerfile', options.args, { cwd : root, ignoreWrapper: options.ignoreWrapper});
}

export default buildExecutor;