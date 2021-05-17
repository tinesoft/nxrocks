import { ExecutorContext } from '@nrwl/devkit'
import * as path from 'path'
import { CleanExecutorOptions } from './schema'
import { runQuarkusPluginCommand } from '../../utils/quarkus-utils'

export async function cleanExecutor(options: CleanExecutorOptions, context: ExecutorContext){
  const root = path.resolve(context.root, options.root);
  const result = runQuarkusPluginCommand('clean', options.args, { cwd : root, ignoreWrapper: options.ignoreWrapper});
  
  if (!result.success) {
    throw new Error();
  }

  return result;
}

export default cleanExecutor;