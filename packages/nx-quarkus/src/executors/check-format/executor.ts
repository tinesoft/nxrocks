import { ExecutorContext } from '@nx/devkit';
import * as path from 'path';
import { FormatCheckExecutorOptions } from './schema';
import { runQuarkusPluginCommand } from '../../utils/quarkus-utils';

export async function formatCheckExecutor(
  options: FormatCheckExecutorOptions,
  context: ExecutorContext
) {
  const root = path.resolve(context.root, options.root);
  return runQuarkusPluginCommand('check-format', options.args, {
    cwd: root,
    ignoreWrapper: options.ignoreWrapper,
    runFromParentModule: options.runFromParentModule,
  });
}

export default formatCheckExecutor;
