import { ExecutorContext } from '@nrwl/devkit'
import * as path from 'path'
import { TestExecutorOptions } from './schema'
import { runKtorPluginCommand } from '../../utils/ktor-utils'

export async function testExecutor(options: TestExecutorOptions, context: ExecutorContext){
  const root = path.resolve(context.root, options.root);
  return runKtorPluginCommand('test', options.args, { cwd : root, ignoreWrapper: options.ignoreWrapper});
}

export default testExecutor;