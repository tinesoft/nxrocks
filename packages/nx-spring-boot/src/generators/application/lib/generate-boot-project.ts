import { Tree, logger } from '@nrwl/devkit';
import { appRootPath } from '@nrwl/workspace/src/utils/app-root';

import fetch from 'node-fetch';
import { Extract } from 'unzipper';
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

    return response.body.pipe(Extract({ path: options.projectRoot })).promise();
    /*
    return response.body.pipe(Parse({forceStream: true}))
        .on('entry', async (entry: Entry)=>{
            if( entry.type === 'Directory'){
                return entry.autodrain();
            }

            const fileName = entry.path;
            const fileContent = await entry.buffer();
            logger.info(`Processing zip file entry '${fileName}'...`);
            tree.write(`${options.projectRoot}/${fileName}`, fileContent);
            // entry.pipe(process.stdout);
        })
        .promise();
    */
}
