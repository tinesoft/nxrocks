import { Tree, logger } from '@nrwl/devkit';
import { execSync } from 'child_process'
import { buildFlutterCreateOptions } from '../../../utils/flutter-utils';

import { NormalizedSchema } from '../schema';


export async function generateFlutterProject(tree: Tree, options: NormalizedSchema): Promise<void> {
    const opts = buildFlutterCreateOptions(options);

    logger.info(`Generating Flutter project with following options : ${opts}...`);

    // Create the command to execute
    const execute = `flutter create ${opts} ${options.projectRoot}`;
    try {
        logger.info(`Executing command: ${execute}`);
        execSync(execute, { stdio: [0, 1, 2] });
        return;
    } catch (e) {
        logger.error(`Failed to execute command: ${execute}`);
        logger.error(e);
        return;
    }
}
