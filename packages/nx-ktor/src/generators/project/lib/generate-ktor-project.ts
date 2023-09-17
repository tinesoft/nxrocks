import { Tree, joinPathFragments, logger, stripIndents, workspaceRoot } from '@nx/devkit';

import fetch from 'node-fetch';
import { NormalizedSchema } from '../schema';
import { buildKtorDownloadUrl } from '../../../utils/ktor-utils';
import {
  extractFromZipStream,
  getCommonHttpHeaders,
  getGradleWrapperFiles,
  getMavenWrapperFiles,
  NX_KTOR_PKG,
} from '@nxrocks/common';

export async function generateKtorProject(
  tree: Tree,
  options: NormalizedSchema
): Promise<void> {
  const { url: downloadUrl, params: downloadParams } =
    buildKtorDownloadUrl(options);

  const { headers: commonHeaders, ...otherCommonOptions } =
    getCommonHttpHeaders(NX_KTOR_PKG, downloadUrl, options.proxyUrl);
  const downloadOptions = {
    ...otherCommonOptions,
    method: 'POST',
    body: JSON.stringify(downloadParams),
    headers: {
      ...commonHeaders,
      'Content-Type': 'application/json',
    },
  };

  logger.info(`⬇️ Downloading Ktor project zip from : '${downloadUrl}'...`);

  const response = await fetch(downloadUrl, downloadOptions);

  logger.info(
    `📦 Extracting Ktor project zip to '${joinPathFragments(workspaceRoot, options.projectRoot)}'...`
  );

  if (response.ok) {
    await extractFromZipStream(response.body, (entryPath, entryContent) => {
      const execPermission =
        entryPath.endsWith('mvnw') || entryPath.endsWith('gradlew')
          ? '755'
          : undefined;
      if (getMavenWrapperFiles().includes(entryPath) || getGradleWrapperFiles().includes(entryPath)) {
        if (options.transformIntoMultiModule) {
          tree.write(`${options.moduleRoot}/${entryPath}`, entryContent, {
            mode: execPermission,
          });
        }
        if (options.keepProjectLevelWrapper) {
          tree.write(`${options.projectRoot}/${entryPath}`, entryContent, {
            mode: execPermission,
          });
        }

      }
      else {
        tree.write(`${options.projectRoot}/${entryPath}`, entryContent, {
          mode: execPermission,
        });
      }
    });
  } else {
    throw new Error(stripIndents`
        ❌ Error downloading Ktor project zip from '${options.ktorInitializrUrl
      }'
        If the problem persists, please open an issue at https://github.com/tinesoft/nxrocks/issues, with the following information:
        ------------------------------------------------------
        Download URL: ${downloadUrl}
        Download Params: ${JSON.stringify(downloadParams)}
        Response status: ${response.status}
        Response headers: ${JSON.stringify(response.headers)}
        Response body: ${await response.text()}
        ------------------------------------------------------`);
  }
}
