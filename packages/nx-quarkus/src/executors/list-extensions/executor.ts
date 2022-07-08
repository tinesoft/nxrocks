import { ExecutorContext } from '@nrwl/devkit'
import * as path from 'path'
import { ListExtensionsExecutorOptions } from './schema'
import { runQuarkusPluginCommand } from '../../utils/quarkus-utils'

export async function listExtensionsExecutor(options: ListExtensionsExecutorOptions, context: ExecutorContext){
  const root = path.resolve(context.root, options.root);
  return runQuarkusPluginCommand('listExtensions', options.args, { cwd : root, ignoreWrapper: options.ignoreWrapper});
}

export default listExtensionsExecutor;