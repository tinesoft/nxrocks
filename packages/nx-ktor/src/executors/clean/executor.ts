import { ExecutorContext } from '@nrwl/devkit'
import * as path from 'path'
import { CleanExecutorOptions } from './schema'
import { runKtorPluginCommand } from '../../utils/ktor-utils'

export async function cleanExecutor(options: CleanExecutorOptions, context: ExecutorContext){
  const root = path.resolve(context.root, options.root);
  return runKtorPluginCommand('clean', options.args, { cwd : root, ignoreWrapper: options.ignoreWrapper});
}

export default cleanExecutor;