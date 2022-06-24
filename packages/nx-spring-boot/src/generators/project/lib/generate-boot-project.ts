import { Tree, logger } from '@nrwl/devkit';
import { workspaceRoot } from '@nrwl/workspace/src/utils/app-root';

import fetch from 'node-fetch';
import { NormalizedSchema } from '../schema';
import { buildBootDownloadUrl } from '../../../utils/boot-utils';
import { extractFromZipStream, getPackageLatestNpmVersion, NX_SPRING_BOOT_PKG } from '@nxrocks/common';

export async function generateBootProject(tree: Tree, options: NormalizedSchema): Promise<void> {
    const downloadUrl = buildBootDownloadUrl(options);

    logger.info(`Downloading Spring Boot project zip from : ${downloadUrl}...`);

    const pkgVersion = getPackageLatestNpmVersion(NX_SPRING_BOOT_PKG);
    const userAgent = `@nxrocks_nx-spring-boot/${pkgVersion}`;
    const opts = {
        headers: {
            'User-Agent': userAgent
        }
    }
    const response = await fetch(downloadUrl, opts);

    logger.info(`Extracting Spring Boot project zip to '${workspaceRoot}/${options.projectRoot}'...`);

    await extractFromZipStream(response.body, (entryPath, entryContent) => {
        const execPermission = entryPath.endsWith('mvnw') || entryPath.endsWith('gradlew') ? '755': undefined;
        tree.write(`${options.projectRoot}/${entryPath}`, entryContent, {mode: execPermission});
    });
}
