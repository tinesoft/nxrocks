import { ExecutorContext } from '@nrwl/devkit'
import * as path from 'path'
import { AotSampleConfigExecutorOptions } from './schema'
import { runMicronautPluginCommand } from '../../utils/micronaut-utils'

export async function aotSampleConfigExecutor(options: AotSampleConfigExecutorOptions, context: ExecutorContext){
  const root = path.resolve(context.root, options.root);
  const result = runMicronautPluginCommand('aotSampleConfig', options.args, { cwd : root, ignoreWrapper: options.ignoreWrapper});
  
  if (!result.success) {
    throw new Error();
  }

  return result;
}

export default aotSampleConfigExecutor;