import { ExecutorContext } from '@nx/devkit';
import * as path from 'path';
import { ListExtensionsExecutorOptions } from './schema';
import { runQuarkusPluginCommand } from '../../utils/quarkus-utils';

export async function listExtensionsExecutor(
  options: ListExtensionsExecutorOptions,
  context: ExecutorContext
) {
  const root = path.resolve(context.root, options.root);
  return runQuarkusPluginCommand('list-extensions', options.args, {
    cwd: root,
    ignoreWrapper: options.ignoreWrapper,
    runFromParentModule: options.runFromParentModule,
  });
}

export default listExtensionsExecutor;
