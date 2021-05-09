import { Tree, logger } from '@nrwl/devkit';
import { appRootPath } from '@nrwl/workspace/src/utils/app-root';

import fetch from 'node-fetch';
import { Entry, Parse } from 'unzipper';
import { NormalizedSchema } from '../schema';
import { getPackageLatestNpmVersion, buildQuarkusDownloadUrl } from '../../../utils/quarkus-utils';

import * as fs from 'fs';
import * as path from 'path';

export async function generateQuarkusProject(tree: Tree, options: NormalizedSchema): Promise<void> {
    const downloadUrl = buildQuarkusDownloadUrl(options);

    logger.info(`⬇️ Downloading Quarkus project zip from : ${downloadUrl}...`);

    const pkg = '@nxrocks/nx-quarkus';
    const pkgVersion = getPackageLatestNpmVersion(pkg);
    const userAgent = `@nxrocks_nx-quarkus/${pkgVersion}`;
    const opts = {
        headers: {
            'User-Agent': userAgent
        }
    }
    const response = await fetch(downloadUrl, opts);

    logger.info(`📦 Extracting Quarkus project zip to '${appRootPath}/${options.projectRoot}'...`);

    const zip = response.body.pipe(Parse({ forceStream: true }));
    for await (const entry of zip) {
        const e = entry as Entry;
        const filePath = e.path.replace(`${options.artifactId}/`,''); // remove the inner folder in the zip
        const fileContent = await e.buffer();
        const fileType = e.type; // 'Directory' or 'File'
        if(fileType === 'File'){
            const filePermissions = filePath.endsWith('mvnw') || filePath.endsWith('gradlew') ? 0o755: undefined;
            // once issue  https://github.com/nrwl/nx/issues/5680 is accepted/merged use this instead
            //tree.write(`${options.projectRoot}/${filePath}`, fileContent, filePermissions);

            const fullFilePath = path.join(appRootPath, options.projectRoot,filePath);
            fs.mkdirSync(path.dirname(fullFilePath), { recursive: true});
            fs.writeFileSync(fullFilePath, fileContent);
            if(filePermissions)
                fs.chmodSync(fullFilePath, filePermissions);
        }
    }
}
