import { ExecutorContext } from '@nx/devkit';
import * as path from 'path';
import { InstallExecutorOptions } from './schema';
import { runQuarkusPluginCommand } from '../../utils/quarkus-utils';

export async function installExecutor(
  options: InstallExecutorOptions,
  context: ExecutorContext
) {
  const root = path.resolve(context.root, options.root);
  return runQuarkusPluginCommand('install', options.args, {
    cwd: root,
    ignoreWrapper: options.ignoreWrapper,
  });
}

export default installExecutor;
