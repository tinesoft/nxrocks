import { ExecutorContext } from '@nx/devkit';
import * as path from 'path';
import { PublishImageExecutorOptions } from './schema';
import { runKtorPluginCommand } from '../../utils/ktor-utils';

export async function publishImageExecutor(
  options: PublishImageExecutorOptions,
  context: ExecutorContext
) {
  const root = path.resolve(context.root, options.root);
  return runKtorPluginCommand('publish-image', options.args, {
    cwd: root,
    ignoreWrapper: options.ignoreWrapper,
    runFromParentModule: options.runFromParentModule,
  });
}

export default publishImageExecutor;
