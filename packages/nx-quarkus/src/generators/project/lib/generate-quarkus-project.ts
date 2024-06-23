import {
  Tree,
  joinPathFragments,
  logger,
  stripIndents,
  workspaceRoot,
} from '@nx/devkit';

import fetch from 'node-fetch';
import { NormalizedSchema } from '../schema';
import { buildQuarkusDownloadUrl } from '../../../utils/quarkus-utils';
import { NX_QUARKUS_PKG } from '../../../index';
import {
  extractFromZipStream,
  getCommonHttpHeaders,
  getGradleWrapperFiles,
  getMavenWrapperFiles,
} from '@nxrocks/common-jvm';

export async function generateQuarkusProject(
  tree: Tree,
  options: NormalizedSchema
): Promise<void> {
  const downloadUrl = buildQuarkusDownloadUrl(options);

  logger.info(`⬇️ Downloading Quarkus project zip from : ${downloadUrl}...`);

  const response = await fetch(
    downloadUrl,
    getCommonHttpHeaders(NX_QUARKUS_PKG, downloadUrl, options.proxyUrl)
  );

  logger.info(
    `📦 Extracting Quarkus project zip to '${joinPathFragments(
      workspaceRoot,
      options.projectRoot
    )}'...`
  );

  if (response.ok) {
    await extractFromZipStream(response.body, (entryPath, entryContent) => {
      const filePath = entryPath.replace(`${options.artifactId}/`, ''); // remove the inner folder in the zip
      const execPermission =
        filePath.endsWith('mvnw') || filePath.endsWith('gradlew')
          ? '755'
          : undefined;
      if (
        getMavenWrapperFiles().includes(filePath) ||
        getGradleWrapperFiles().includes(filePath)
      ) {
        if (options.transformIntoMultiModule) {
          tree.write(`${options.moduleRoot}/${filePath}`, entryContent, {
            mode: execPermission,
          });
        }
        if (options.keepProjectLevelWrapper) {
          tree.write(`${options.projectRoot}/${filePath}`, entryContent, {
            mode: execPermission,
          });
        }
      } else {
        tree.write(`${options.projectRoot}/${filePath}`, entryContent, {
          mode: execPermission,
        });
      }
    });
  } else {
    throw new Error(stripIndents`
        ❌ Error downloading Quarkus project zip from '${
          options.quarkusInitializerUrl
        }'
        If the problem persists, please open an issue at https://github.com/tinesoft/nxrocks/issues, with the following information:
        ------------------------------------------------------
        Download URL: ${downloadUrl}
        Response status: ${response.status}
        Response headers: ${JSON.stringify(response.headers)}
        Response body: ${await response.text()}
        ------------------------------------------------------`);
  }
}
