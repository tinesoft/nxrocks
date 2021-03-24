import { ExecutorContext } from '@nrwl/devkit'
import * as path from 'path'
import { TestExecutorOptions } from './schema'
import { runBootPluginCommand } from '../../utils/boot-utils'

export async function testExecutor(options: TestExecutorOptions, context: ExecutorContext){
  const root = path.resolve(context.root, options.root);
  const result = await runBootPluginCommand('test', options.args, { cwd : root, ignoreWrapper: options.ignoreWrapper});
  
  if (!result.success) {
    throw new Error();
  }

  return result;
}

export default testExecutor;