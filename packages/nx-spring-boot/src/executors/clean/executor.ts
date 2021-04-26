import { ExecutorContext } from '@nrwl/devkit'
import * as path from 'path'
import { CleanExecutorOptions } from './schema'
import { runBootPluginCommand } from '../../utils/boot-utils'

export async function cleanExecutor(options: CleanExecutorOptions, context: ExecutorContext){
  const root = path.resolve(context.root, options.root);
  const result = runBootPluginCommand('clean', options.args, { cwd : root, ignoreWrapper: options.ignoreWrapper});
  
  if (!result.success) {
    throw new Error();
  }

  return result;
}

export default cleanExecutor;