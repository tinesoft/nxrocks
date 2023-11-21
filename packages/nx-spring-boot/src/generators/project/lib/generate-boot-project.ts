import { Tree, joinPathFragments, logger, names, stripIndents, workspaceRoot } from '@nx/devkit';

import fetch from 'node-fetch';
import { NormalizedSchema } from '../schema';
import { buildBootDownloadUrl } from '../../../utils/boot-utils';
import { NX_SPRING_BOOT_PKG } from '../../../index';
import {
  extractFromZipStream,
  getCommonHttpHeaders,
  getGradleWrapperFiles,
  getMavenWrapperFiles,
} from '@nxrocks/common-jvm';

export async function generateBootProject(
  tree: Tree,
  options: NormalizedSchema
): Promise<void> {
  const downloadUrl = buildBootDownloadUrl(options);

  logger.info(
    `⬇️ Downloading Spring Boot project zip from : ${downloadUrl}...`
  );

  const response = await fetch(
    downloadUrl,
    getCommonHttpHeaders(NX_SPRING_BOOT_PKG, downloadUrl, options.proxyUrl)
  );

  logger.info(
    `📦 Extracting Spring Boot project zip to '${joinPathFragments(workspaceRoot, options.projectRoot)}'...`
  );

  if (response.ok) {
    await extractFromZipStream(response.body, (entryPath, entryContent) => {
      const execPermission =
        entryPath.endsWith('mvnw') || entryPath.endsWith('gradlew') ? '755' : undefined;

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
      else if (options.projectType !== 'library' || !getBootApplicationOnlyFiles(options).includes(entryPath)) {
        tree.write(`${options.projectRoot}/${entryPath}`, entryContent, {
          mode: execPermission,
        });
      }
    });
  } else {
    throw new Error(stripIndents`
        ❌ Error downloading Spring Boot project zip from '${options.springInitializerUrl
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


function getBootApplicationOnlyFiles(options: NormalizedSchema) {

  const basePath = options.packageName?.replaceAll('.', '/');
  const ext = options.language === 'kotlin' ? '.kt' : options.language === 'groovy' ? '.groovy' : '.java';
  return [
    `src/main/resources/application.properties`,
    `src/main/${options.language}/${basePath}/${names(options.name).className}Application${ext}`,
    `src/test/${options.language}/${basePath}/${names(options.name).className}ApplicationTests${ext}`];

}