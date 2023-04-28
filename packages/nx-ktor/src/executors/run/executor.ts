import { ExecutorContext } from '@nx/devkit';
import * as path from 'path';
import { RunExecutorOptions } from './schema';
import { runKtorPluginCommand } from '../../utils/ktor-utils';

export async function runExecutor(
  options: RunExecutorOptions,
  context: ExecutorContext
) {
  const root = path.resolve(context.root, options.root);
  return runKtorPluginCommand('run', options.args, {
    cwd: root,
    ignoreWrapper: options.ignoreWrapper,
  });
}

export default runExecutor;
