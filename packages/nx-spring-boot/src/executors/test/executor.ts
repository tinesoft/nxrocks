import { ExecutorContext } from '@nx/devkit';
import * as path from 'path';
import { TestExecutorOptions } from './schema';
import { runBootPluginCommand } from '../../utils/boot-utils';

export async function testExecutor(
  options: TestExecutorOptions,
  context: ExecutorContext
) {
  const root = path.resolve(context.root, options.root);
  return runBootPluginCommand('test', options.args, {
    cwd: root,
    ignoreWrapper: options.ignoreWrapper,
    runFromParentModule: options.runFromParentModule,
  });
}

export default testExecutor;
