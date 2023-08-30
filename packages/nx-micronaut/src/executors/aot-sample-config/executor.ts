import { ExecutorContext } from '@nx/devkit';
import * as path from 'path';
import { AotSampleConfigExecutorOptions } from './schema';
import { runMicronautPluginCommand } from '../../utils/micronaut-utils';

export async function aotSampleConfigExecutor(
  options: AotSampleConfigExecutorOptions,
  context: ExecutorContext
) {
  const root = path.resolve(context.root, options.root);
  return runMicronautPluginCommand('aot-sample-config', options.args, {
    cwd: root,
    ignoreWrapper: options.ignoreWrapper,
    runFromParentModule: options.runFromParentModule,
  });
}

export default aotSampleConfigExecutor;
