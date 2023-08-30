import { ExecutorContext } from '@nx/devkit';
import * as path from 'path';
import { RunExecutorOptions } from './schema';
import { runMicronautPluginCommand } from '../../utils/micronaut-utils';

export async function runExecutor(
  options: RunExecutorOptions,
  context: ExecutorContext
) {
  const root = path.resolve(context.root, options.root);
  return runMicronautPluginCommand('run', options.args, {
    cwd: root,
    ignoreWrapper: options.ignoreWrapper,
    runFromParentModule: options.runFromParentModule,
  });
}

export default runExecutor;
