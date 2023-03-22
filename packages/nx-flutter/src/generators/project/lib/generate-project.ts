import { Tree, logger } from '@nrwl/devkit';
import { execSync } from 'child_process'
import { buildFlutterCreateOptions, isFlutterInstalled } from '../../../utils/flutter-utils';

import { NormalizedSchema } from '../schema';


export async function generateFlutterProject(tree: Tree, options: NormalizedSchema): Promise<void> {
    const opts = buildFlutterCreateOptions(options);

    logger.info(`Generating Flutter project with following options : ${opts}...`);

    if (!isFlutterInstalled(options.useFvm)) {
        throw new Error(options.useFvm ?
            "'fvm' was not found on your system's PATH.\nPlease make sure you have installed it correctly.\n👉🏾 https://fvm.app/docs/getting_started/installation" :
            "'flutter' was not found on your system's PATH.\nPlease make sure you have installed it correctly.\n👉🏾 https://flutter.dev/docs/get-started/install"
        );
    }

    if (process.env.NX_DRY_RUN === 'true') {
        logger.info('Skipping Flutter project generation because of --dry-run flag');
        return;
    }

    // Create the command to execute
    const execute = `${options.useFvm == true ? 'fvm ' : ''}flutter create ${opts} ${options.projectRoot}`;
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
