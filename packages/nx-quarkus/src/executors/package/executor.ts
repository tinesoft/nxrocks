import { ExecutorContext } from '@nrwl/devkit'
import * as path from 'path'
import { PackageExecutorOptions } from './schema'
import { runQuarkusPluginCommand } from '../../utils/quarkus-utils'

export async function packageExecutor(options: PackageExecutorOptions, context: ExecutorContext){
  const root = path.resolve(context.root, options.root);
  return runQuarkusPluginCommand('package', options.args, { cwd : root, ignoreWrapper: options.ignoreWrapper});
}

export default packageExecutor;