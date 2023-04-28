import { ExecutorContext } from '@nx/devkit';
import * as path from 'path';
import { TestExecutorOptions } from './schema';
import { runMicronautPluginCommand } from '../../utils/micronaut-utils';

export async function testExecutor(
  options: TestExecutorOptions,
  context: ExecutorContext
) {
  const root = path.resolve(context.root, options.root);
  return runMicronautPluginCommand('test', options.args, {
    cwd: root,
    ignoreWrapper: options.ignoreWrapper,
  });
}

export default testExecutor;
