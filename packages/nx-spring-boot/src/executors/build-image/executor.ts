import { ExecutorContext } from '@nrwl/devkit'
import * as path from 'path'
import { BuildImageExecutorOptions } from './schema'
import { runBootPluginCommand } from '../../utils/boot-utils'

export async function buildImageExecutor(options: BuildImageExecutorOptions, context: ExecutorContext){
  const root = path.resolve(context.root, options.root);
  const result = runBootPluginCommand('buildImage', options.args, { cwd : root, ignoreWrapper: options.ignoreWrapper});
  
  if (!result.success) {
    throw new Error();
  }

  return result;
}

export default buildImageExecutor;