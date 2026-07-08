import { ExecutorContext, logger } from '@nx/devkit';

import { join } from 'node:path';

import * as cp from 'node:child_process';

export function expectExecutorCommandRanWith(
  execute: string,
  context: ExecutorContext,
  options: { root: string }
) {
  expect(logger.info).toHaveBeenLastCalledWith(`Executing command: ${execute}`);
  expect(cp.execSync).toHaveBeenCalledWith(
    execute,
    expect.objectContaining({
      cwd: expect.stringContaining(join(context.root, options.root)),
      stdio: [0, 1, 2],
    })
  );
}
