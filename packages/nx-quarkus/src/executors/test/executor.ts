import { ExecutorContext } from '@nrwl/devkit'
import * as path from 'path'
import { TestExecutorOptions } from './schema'
import { runQuarkusPluginCommand } from '../../utils/quarkus-utils'

export async function testExecutor(options: TestExecutorOptions, context: ExecutorContext){
  const root = path.resolve(context.root, options.root);
  const result = runQuarkusPluginCommand('test', options.args, { cwd : root, ignoreWrapper: options.ignoreWrapper});
  
  if (!result.success) {
    throw new Error();
  }

  return result;
}

export default testExecutor;