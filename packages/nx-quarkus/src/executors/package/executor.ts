import { ExecutorContext } from '@nrwl/devkit'
import * as path from 'path'
import { PackageExecutorOptions } from './schema'
import { runQuarkusPluginCommand } from '../../utils/quarkus-utils'

export async function packageExecutor(options: PackageExecutorOptions, context: ExecutorContext){
  const root = path.resolve(context.root, options.root);
  const result = runQuarkusPluginCommand('package', options.args, { cwd : root, ignoreWrapper: options.ignoreWrapper});
  
  if (!result.success) {
    throw new Error();
  }

  return result;
}

export default packageExecutor;