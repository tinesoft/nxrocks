import { ExecutorContext } from '@nx/devkit';
import * as path from 'path';
import { BuildInfoExecutorOptions } from './schema';
import { runBootPluginCommand } from '../../utils/boot-utils';

export async function buildInfoExecutor(
  options: BuildInfoExecutorOptions,
  context: ExecutorContext
) {
  const root = path.resolve(context.root, options.root);
  return runBootPluginCommand('build-info', [], {
    cwd: root,
    ignoreWrapper: options.ignoreWrapper,
  });
}

export default buildInfoExecutor;
