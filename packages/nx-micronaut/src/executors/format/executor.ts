import { ExecutorContext } from '@nx/devkit';
import * as path from 'path';
import { FormatExecutorOptions } from './schema';
import { runMicronautPluginCommand } from '../../utils/micronaut-utils';

export async function formatExecutor(
  options: FormatExecutorOptions,
  context: ExecutorContext
) {
  const root = path.resolve(context.root, options.root);
  return runMicronautPluginCommand('format', options.args, {
    cwd: root,
    ignoreWrapper: options.ignoreWrapper,
  });
}

export default formatExecutor;
