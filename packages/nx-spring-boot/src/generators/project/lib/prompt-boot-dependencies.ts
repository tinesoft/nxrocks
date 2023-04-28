import { NormalizedSchema } from '../schema';
import { prompt } from 'enquirer';
import { fetchBootDependencies } from '../../../utils/boot-utils';
import { logger } from '@nx/devkit';

export async function promptBootDependencies(options: NormalizedSchema) {
  if (
    options.dependencies === undefined &&
    process.env.NX_INTERACTIVE === 'true'
  ) {
    logger.info(`⏳ Fetching Spring Boot dependencies list. Please wait...`);

    const dependencies = Object.keys(await fetchBootDependencies(options));

    options.projectDependencies = await prompt({
      name: 'dependencies',
      message:
        'What dependencies would you like to use? (type something to filter, press [space] to multi-select)',
      type: 'autocomplete',
      choices: dependencies,
      multiple: true,
    }).then((a) => a['dependencies']);
  }
}
