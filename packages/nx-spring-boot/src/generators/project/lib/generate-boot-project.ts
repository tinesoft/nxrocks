import { Tree, logger } from '@nrwl/devkit';
import { appRootPath } from '@nrwl/workspace/src/utils/app-root';

import fetch from 'node-fetch';
import { Entry, Parse } from 'unzipper';
import { NormalizedSchema } from '../schema';
import { getPackageLatestNpmVersion, buildBootDownloadUrl } from '../../../utils/boot-utils';

export async function generateBootProject(tree: Tree, options: NormalizedSchema): Promise<void> {
    const downloadUrl = buildBootDownloadUrl(options);

    logger.info(`Downloading Spring Boot project zip from : ${downloadUrl}...`);

    const pkg = '@nxrocks/nx-spring-boot';
    const pkgVersion = getPackageLatestNpmVersion(pkg);
    const userAgent = `@nxrocks_nx-spring-boot/${pkgVersion}`;
    const opts = {
        headers: {
            'User-Agent': userAgent
        }
    }
    const response = await fetch(downloadUrl, opts);

    logger.info(`Extracting Spring Boot project zip to '${appRootPath}/${options.projectRoot}'...`);

    const zip = response.body.pipe(Parse({ forceStream: true }));
    for await (const entry of zip) {
        const e = entry as Entry;
        const filePath = e.path;
        const fileContent = await e.buffer();
        const fileType = e.type; // 'Directory' or 'File'
        if(fileType === 'File'){
            const execPermission = filePath.endsWith('mvnw') || filePath.endsWith('gradlew') ? '755': undefined;
            tree.write(`${options.projectRoot}/${filePath}`, fileContent, {mode: execPermission});
        }
    }
}
