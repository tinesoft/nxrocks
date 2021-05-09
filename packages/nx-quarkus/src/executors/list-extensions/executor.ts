import { ExecutorContext } from '@nrwl/devkit'
import * as path from 'path'
import { ListExtensionsExecutorOptions } from './schema'
import { runQuarkusPluginCommand } from '../../utils/quarkus-utils'

export async function listExtensionsExecutor(options: ListExtensionsExecutorOptions, context: ExecutorContext){
  const root = path.resolve(context.root, options.root);
  const result = runQuarkusPluginCommand('listExtensions', options.args, { cwd : root, ignoreWrapper: options.ignoreWrapper});
  
  if (!result.success) {
    throw new Error();
  }

  return result;
}

export default listExtensionsExecutor;