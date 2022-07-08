import { ExecutorContext } from '@nrwl/devkit'
import * as path from 'path'
import { AddExtensionExecutorOptions } from './schema'
import { runQuarkusPluginCommand } from '../../utils/quarkus-utils'

export async function addExtensionExecutor(options: AddExtensionExecutorOptions, context: ExecutorContext){
  const root = path.resolve(context.root, options.root);
  return runQuarkusPluginCommand('addExtension', options.args, { cwd : root, ignoreWrapper: options.ignoreWrapper});
}

export default addExtensionExecutor;