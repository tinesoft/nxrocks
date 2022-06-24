import { ExecutorContext } from '@nrwl/devkit'
import * as path from 'path'
import { FormatExecutorOptions } from './schema'
import { runMicronautPluginCommand } from '../../utils/micronaut-utils'

export async function formatExecutor(options: FormatExecutorOptions, context: ExecutorContext){
  const root = path.resolve(context.root, options.root);
  const result = runMicronautPluginCommand('format', options.args, { cwd : root, ignoreWrapper: options.ignoreWrapper});
  
  if (!result.success) {
    throw new Error();
  }

  return result;
}

export default formatExecutor;