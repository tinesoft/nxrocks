import { ExecutorContext } from '@nx/devkit';
import * as path from 'path';
import { FormatCheckExecutorOptions } from './schema';
import { runMicronautPluginCommand } from '../../utils/micronaut-utils';

export async function formatCheckExecutor(
  options: FormatCheckExecutorOptions,
  context: ExecutorContext
) {
  const root = path.resolve(context.root, options.root);
  return runMicronautPluginCommand('check-format', options.args, {
    cwd: root,
    ignoreWrapper: options.ignoreWrapper,
  });
}

export default formatCheckExecutor;
