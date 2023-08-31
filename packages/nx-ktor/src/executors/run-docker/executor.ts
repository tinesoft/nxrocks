import { ExecutorContext } from '@nx/devkit';
import * as path from 'path';
import { RunDockerExecutorOptions } from './schema';
import { runKtorPluginCommand } from '../../utils/ktor-utils';

export async function runDockerExecutor(
  options: RunDockerExecutorOptions,
  context: ExecutorContext
) {
  const root = path.resolve(context.root, options.root);
  return runKtorPluginCommand('run-docker', options.args, {
    cwd: root,
    ignoreWrapper: options.ignoreWrapper,
    runFromParentModule: options.runFromParentModule,
  });
}

export default runDockerExecutor;
