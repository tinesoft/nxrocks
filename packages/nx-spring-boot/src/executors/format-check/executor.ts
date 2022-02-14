import { ExecutorContext } from '@nrwl/devkit'
import * as path from 'path'
import { runBootPluginCommand } from '../../utils/boot-utils';
import { FormatCheckExecutorOptions } from './schema'

export async function formatCheckExecutor(options: FormatCheckExecutorOptions, context: ExecutorContext){
  const root = path.resolve(context.root, options.root);
  const result = runBootPluginCommand('format-check', options.args, { cwd : root, ignoreWrapper: options.ignoreWrapper});
  
  if (!result.success) {
    throw new Error();
  }

  return result;
}

export default formatCheckExecutor;