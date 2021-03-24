import { ExecutorContext } from '@nrwl/devkit'
import * as path from 'path'
import { BuildWarExecutorOptions } from './schema'
import { runBootPluginCommand } from '../../utils/boot-utils'

export async function buildWarExecutor(options: BuildWarExecutorOptions, context: ExecutorContext){
  const root = path.resolve(context.root, options.root);
  const result = await runBootPluginCommand('buildWar', options.args, { cwd : root, ignoreWrapper: options.ignoreWrapper});
  
  if (!result.success) {
    throw new Error();
  }

  return result;
}

export default buildWarExecutor;