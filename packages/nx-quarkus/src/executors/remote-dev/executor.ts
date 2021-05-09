import { ExecutorContext } from '@nrwl/devkit'
import * as path from 'path'
import { RemoteDevExecutorOptions } from './schema'
import { runQuarkusPluginCommand } from '../../utils/quarkus-utils'

export async function remoteDevExecutor(options: RemoteDevExecutorOptions, context: ExecutorContext){
  const root = path.resolve(context.root, options.root);
  const result = runQuarkusPluginCommand('remoteDev', options.args, { cwd : root, ignoreWrapper: options.ignoreWrapper});
  
  if (!result.success) {
    throw new Error();
  }

  return result;
}

export default remoteDevExecutor;