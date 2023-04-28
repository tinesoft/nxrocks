import { logger } from '@nx/devkit';
import { spawnSync } from 'child_process';
import { isDartInstalled } from '../../../utils/melos-utils';

export async function installMelosPackageGlobally(): Promise<void> {
  logger.info(`Installing Melos as global package...`);

  if (!isDartInstalled()) {
    throw new Error(
      "'Dart SDK' was not found on your system's PATH.\nPlease make sure you have installed it correctly.\n👉🏾 https://dart.dev/get-dart"
    );
  }

  // install melos globally
  const silent = false; //can later come from a --verbose ption
  const execute = `dart pub global activate melos`;
  try {
    logger.info(`Executing command: ${execute}`);
    spawnSync(execute, {
      shell: false,
      ...(silent ? { stdio: ['ignore', 'ignore', 'ignore'] } : {}),
    });
    return;
  } catch (e) {
    logger.error(`Failed to execute command: ${execute}`);
    logger.error(e);
    return;
  }
}
