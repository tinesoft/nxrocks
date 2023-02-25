import { ExecutorContext } from '@nrwl/devkit'
import * as path from 'path'
import { FormatExecutorOptions } from './schema'
import { runKtorPluginCommand } from '../../utils/ktor-utils'

export async function formatExecutor(options: FormatExecutorOptions, context: ExecutorContext){
  const root = path.resolve(context.root, options.root);
  return runKtorPluginCommand('format', options.args, { cwd : root, ignoreWrapper: options.ignoreWrapper});
}

export default formatExecutor;