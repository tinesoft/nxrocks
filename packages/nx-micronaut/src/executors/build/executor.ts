import { ExecutorContext } from '@nx/devkit';
import * as path from 'path';
import { BuildExecutorOptions } from './schema';
import { runMicronautPluginCommand } from '../../utils/micronaut-utils';

export async function buildExecutor(
  options: BuildExecutorOptions,
  context: ExecutorContext
) {
  const root = path.resolve(context.root, options.root);
  return runMicronautPluginCommand('build', options.args, {
    cwd: root,
    ignoreWrapper: options.ignoreWrapper,
    runFromParentModule: options.runFromParentModule,
  });
}

export default buildExecutor;
