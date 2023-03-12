import { NormalizedSchema } from "../schema";
import { prompt } from 'enquirer';
import { fetchQuarkusExtensions } from "../../../utils/quarkus-utils";
import { logger } from "@nrwl/devkit";


export async function promptQuarkusExtensions(options: NormalizedSchema) {

  if (options.extensions === undefined && process.env.NX_INTERACTIVE === 'true') {

    logger.info(`⏳ Fetching Quarkus extensions list. Please wait...`);

    const extensions = (await fetchQuarkusExtensions(options)).map(e => e.id);

    options.projectExtensions = await prompt({
      name: 'extensions',
      message: 'What extensions would you like to use? (type something to filter, press [space] to multi-select)',
      type: 'autocomplete',
      choices: extensions,
      multiple: true,
    }).then((a) => a['extensions']);
  }
}
