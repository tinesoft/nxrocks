import { ExecutorContext } from '@nx/devkit';
import * as path from 'path';
import { InstallExecutorOptions } from './schema';
import { runKtorPluginCommand } from '../../utils/ktor-utils';

export async function installExecutor(
  options: InstallExecutorOptions,
  context: ExecutorContext
) {
  const root = path.resolve(context.root, options.root);
  return runKtorPluginCommand('install', options.args, {
    cwd: root,
    ignoreWrapper: options.ignoreWrapper,
    runFromParentModule: options.runFromParentModule,
  });
}

export default installExecutor;
