import { Tree, logger, stripIndents, workspaceRoot } from '@nrwl/devkit';

import fetch from 'node-fetch';
import { NormalizedSchema } from '../schema';
import { buildBootDownloadUrl } from '../../../utils/boot-utils';
import { extractFromZipStream, getHttpProxyAgent, getPackageLatestNpmVersion, NX_SPRING_BOOT_PKG } from '@nxrocks/common';

export async function generateBootProject(tree: Tree, options: NormalizedSchema): Promise<void> {
    const downloadUrl = buildBootDownloadUrl(options);

    logger.info(`Downloading Spring Boot project zip from : ${downloadUrl}...`);

    const pkgVersion = getPackageLatestNpmVersion(NX_SPRING_BOOT_PKG);
    const userAgent = `@nxrocks_nx-spring-boot/${pkgVersion}`;
    const proxyAgent = getHttpProxyAgent(options.proxyUrl);
    const opts = {
        headers: {
            'User-Agent': userAgent
        },
        ...(proxyAgent ? {agent: proxyAgent} : {})
    };
    const response = await fetch(downloadUrl, opts);

    logger.info(`Extracting Spring Boot project zip to '${workspaceRoot}/${options.projectRoot}'...`);

    if(response.ok){
        await extractFromZipStream(response.body, (entryPath, entryContent) => {
            const execPermission = entryPath.endsWith('mvnw') || entryPath.endsWith('gradlew') ? '755': undefined;
            tree.write(`${options.projectRoot}/${entryPath}`, entryContent, {mode: execPermission});
        });
    }
    else {
        throw new Error( stripIndents`
        ❌ Error downloading Spring Boot project zip from '${options.springInitializerUrl}'
        If the problem persists, please open an issue at https://github.com/tinesoft/nxrocks/issues, with the following information:
        ------------------------------------------------------
        Download URL: ${downloadUrl}
        Response status: ${response.status}
        Response headers: ${JSON.stringify(response.headers)}
        ------------------------------------------------------`);
    }
}
