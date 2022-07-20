import { ExecutorContext } from '@nrwl/devkit'
import * as path from 'path'
import { InstallExecutorOptions } from './schema'
import { runMicronautPluginCommand } from '../../utils/micronaut-utils'

export async function installExecutor(options: InstallExecutorOptions, context: ExecutorContext){
  const root = path.resolve(context.root, options.root);
  return runMicronautPluginCommand('install', options.args, { cwd : root, ignoreWrapper: options.ignoreWrapper});
}

export default installExecutor;