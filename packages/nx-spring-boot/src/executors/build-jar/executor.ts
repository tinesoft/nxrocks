import { ExecutorContext } from '@nrwl/devkit'
import * as path from 'path'
import { BuildJarExecutorOptions } from './schema'
import { runBootPluginCommand } from '../../utils/boot-utils'

export async function buildJarExecutor(options: BuildJarExecutorOptions, context: ExecutorContext){
  const root = path.resolve(context.root, options.root);
  const result = await runBootPluginCommand('buildJar', options.args, { cwd : root, ignoreWrapper: options.ignoreWrapper});
  
  if (!result.success) {
    throw new Error();
  }

  return result;
}

export default buildJarExecutor;