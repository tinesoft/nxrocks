import { ExecutorContext } from '@nrwl/devkit'
import * as path from 'path'
import { BuildInfoExecutorOptions } from './schema'
import { runBootPluginCommand } from '../../utils/boot-utils'

export async function buildInfoExecutor(options: BuildInfoExecutorOptions, context: ExecutorContext){
  const root = path.resolve(context.root, options.root);
  const result = await runBootPluginCommand('buildInfo', [], { cwd : root, ignoreWrapper: options.ignoreWrapper});
  
  if (!result.success) {
    throw new Error();
  }

  return result;
}

export default buildInfoExecutor;