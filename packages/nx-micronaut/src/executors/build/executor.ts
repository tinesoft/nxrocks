import { ExecutorContext } from '@nrwl/devkit'
import * as path from 'path'
import { BuildExecutorOptions } from './schema'
import { runMicronautPluginCommand } from '../../utils/micronaut-utils'

export async function buildExecutor(options: BuildExecutorOptions, context: ExecutorContext){
  const root = path.resolve(context.root, options.root);
  const result = runMicronautPluginCommand('build', options.args, { cwd : root, ignoreWrapper: options.ignoreWrapper});
  
  if (!result.success) {
    throw new Error();
  }

  return result;
}

export default buildExecutor;