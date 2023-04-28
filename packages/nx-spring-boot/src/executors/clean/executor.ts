import { ExecutorContext } from '@nx/devkit';
import * as path from 'path';
import { CleanExecutorOptions } from './schema';
import { runBootPluginCommand } from '../../utils/boot-utils';

export async function cleanExecutor(
  options: CleanExecutorOptions,
  context: ExecutorContext
) {
  const root = path.resolve(context.root, options.root);
  return runBootPluginCommand('clean', options.args, {
    cwd: root,
    ignoreWrapper: options.ignoreWrapper,
  });
}

export default cleanExecutor;
