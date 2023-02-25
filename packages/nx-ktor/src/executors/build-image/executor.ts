import { ExecutorContext } from '@nrwl/devkit'
import * as path from 'path'
import { BuildImageExecutorOptions } from './schema'
import { runKtorPluginCommand } from '../../utils/ktor-utils'

export async function buildImageExecutor(options: BuildImageExecutorOptions, context: ExecutorContext){
  const root = path.resolve(context.root, options.root);
  return runKtorPluginCommand('build-image', options.args, { cwd : root, ignoreWrapper: options.ignoreWrapper});
}

export default buildImageExecutor;