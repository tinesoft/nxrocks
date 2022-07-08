import { ExecutorContext } from '@nrwl/devkit'
import * as path from 'path'
import { runBootPluginCommand } from '../../utils/boot-utils';
import { FormatCheckExecutorOptions } from './schema'

export async function formatCheckExecutor(options: FormatCheckExecutorOptions, context: ExecutorContext){
  const root = path.resolve(context.root, options.root);
  return runBootPluginCommand('format-check', options.args, { cwd : root, ignoreWrapper: options.ignoreWrapper});
}

export default formatCheckExecutor;