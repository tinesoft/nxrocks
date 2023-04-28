import { ExecutorContext } from '@nx/devkit';
import * as path from 'path';
import { BuildImageExecutorOptions } from './schema';
import { runBootPluginCommand } from '../../utils/boot-utils';

export async function buildImageExecutor(
  options: BuildImageExecutorOptions,
  context: ExecutorContext
) {
  const root = path.resolve(context.root, options.root);
  return runBootPluginCommand('build-image', options.args, {
    cwd: root,
    ignoreWrapper: options.ignoreWrapper,
  });
}

export default buildImageExecutor;
