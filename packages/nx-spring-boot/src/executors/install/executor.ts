import { ExecutorContext } from '@nrwl/devkit'
import * as path from 'path'
import { InstallExecutorOptions } from './schema'
import { runBootPluginCommand } from '../../utils/boot-utils'

export async function installExecutor(options: InstallExecutorOptions, context: ExecutorContext){
  const root = path.resolve(context.root, options.root);
  return runBootPluginCommand('install', options.args, { cwd : root, ignoreWrapper: options.ignoreWrapper});
}

export default installExecutor;