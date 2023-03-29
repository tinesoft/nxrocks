import { Tree, logger, stripIndents, workspaceRoot } from '@nrwl/devkit';

import fetch from 'node-fetch';
import { NormalizedSchema } from '../schema';
import { buildQuarkusDownloadUrl } from '../../../utils/quarkus-utils';
import { extractFromZipStream, getHttpProxyAgent, getPackageLatestNpmVersion, NX_QUARKUS_PKG } from '@nxrocks/common';

export async function generateQuarkusProject(tree: Tree, options: NormalizedSchema): Promise<void> {
    const downloadUrl = buildQuarkusDownloadUrl(options);

    logger.info(`⬇️ Downloading Quarkus project zip from : ${downloadUrl}...`);

    const pkgVersion = getPackageLatestNpmVersion(NX_QUARKUS_PKG);
    const userAgent = `@nxrocks_nx-quarkus/${pkgVersion}`;
    const proxyAgent = getHttpProxyAgent(options.proxyUrl, downloadUrl);
    const opts = {
        headers: {
            'User-Agent': userAgent
        },
        ...(proxyAgent ? {agent: proxyAgent} : {})
    };
    const response = await fetch(downloadUrl, opts);

    logger.info(`📦 Extracting Quarkus project zip to '${workspaceRoot}/${options.projectRoot}'...`);

    if(response.ok){
        await extractFromZipStream(response.body, (entryPath, entryContent) => {
            const filePath = entryPath.replace(`${options.artifactId}/`,''); // remove the inner folder in the zip
            const execPermission = filePath.endsWith('mvnw') || filePath.endsWith('gradlew') ? '755': undefined;
            tree.write(`${options.projectRoot}/${filePath}`, entryContent, {mode: execPermission});
        });
    }
    else {
        throw new Error( stripIndents`
        ❌ Error downloading Quarkus project zip from '${options.quarkusInitializerUrl}'
        If the problem persists, please open an issue at https://github.com/tinesoft/nxrocks/issues, with the following information:
        ------------------------------------------------------
        Download URL: ${downloadUrl}
        Response status: ${response.status}
        Response headers: ${JSON.stringify(response.headers)}
        Response body: ${await response.text()}
        ------------------------------------------------------`);
    }
}
