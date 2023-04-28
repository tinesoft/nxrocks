import { ExecutorContext } from '@nx/devkit';
import * as path from 'path';
import { RemoteDevExecutorOptions } from './schema';
import { runQuarkusPluginCommand } from '../../utils/quarkus-utils';

export async function remoteDevExecutor(
  options: RemoteDevExecutorOptions,
  context: ExecutorContext
) {
  const root = path.resolve(context.root, options.root);
  return runQuarkusPluginCommand('remote-dev', options.args, {
    cwd: root,
    ignoreWrapper: options.ignoreWrapper,
  });
}

export default remoteDevExecutor;
