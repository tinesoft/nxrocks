import { ExecutorContext } from '@nx/devkit';
import * as path from 'path';
import { FormatCheckExecutorOptions } from './schema';
import { runKtorPluginCommand } from '../../utils/ktor-utils';

export async function formatCheckExecutor(
  options: FormatCheckExecutorOptions,
  context: ExecutorContext
) {
  const root = path.resolve(context.root, options.root);
  return runKtorPluginCommand('check-format', options.args, {
    cwd: root,
    ignoreWrapper: options.ignoreWrapper,
  });
}

export default formatCheckExecutor;
