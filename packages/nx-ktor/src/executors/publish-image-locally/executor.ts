import { ExecutorContext } from '@nx/devkit';
import * as path from 'path';
import { PublishImageLocallyExecutorOptions } from './schema';
import { runKtorPluginCommand } from '../../utils/ktor-utils';

export async function publishImageLocallyExecutor(
  options: PublishImageLocallyExecutorOptions,
  context: ExecutorContext
) {
  const root = path.resolve(context.root, options.root);
  return runKtorPluginCommand('publish-image-locally', options.args, {
    cwd: root,
    ignoreWrapper: options.ignoreWrapper,
  });
}

export default publishImageLocallyExecutor;
