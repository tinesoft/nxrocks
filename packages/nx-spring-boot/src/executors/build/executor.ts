import { ExecutorContext } from '@nx/devkit';
import * as path from 'path';
import { BuildExecutorOptions } from './schema';
import { runBootPluginCommand } from '../../utils/boot-utils';

export async function buildExecutor(
  options: BuildExecutorOptions,
  context: ExecutorContext
) {
  const root = path.resolve(context.root, options.root);
  return runBootPluginCommand('build', options.args, {
    cwd: root,
    ignoreWrapper: options.ignoreWrapper,
  });
}

export default buildExecutor;
