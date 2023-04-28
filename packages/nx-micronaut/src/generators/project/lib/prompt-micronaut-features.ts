import { NormalizedSchema } from '../schema';
import { prompt } from 'enquirer';
import { fetchMicronautFeatures } from '../../../utils/micronaut-utils';
import { logger } from '@nx/devkit';

export async function promptMicronautFeatures(options: NormalizedSchema) {
  if (options.features === undefined && process.env.NX_INTERACTIVE === 'true') {
    logger.info(`⏳ Fetching Micronaut features list. Please wait...`);

    const features = (await fetchMicronautFeatures(options)).map((f) => f.name);

    options.projectFeatures = await prompt({
      name: 'features',
      message:
        'What features would you like to use? (type something to filter, press [space] to multi-select)',
      type: 'autocomplete',
      choices: features,
      multiple: true,
    }).then((a) => a['features']);
  }
}
