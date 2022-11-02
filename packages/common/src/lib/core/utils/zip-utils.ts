import { Entry, Parse } from 'unzipper';


export async function extractFromZipStream(zipStream: NodeJS.ReadableStream, forEach: (entryPath: string, entryContent: Buffer) => void): Promise<void> {

    return zipStream.pipe(Parse())
        .on('entry', async (e: Entry) => { // workaround to https://github.com/ZJONSSON/node-unzipper/issues/228#issuecomment-1294451911
            const entryPath = e.path;
            try {
                const entryContent = await e.buffer();
                const entryType = e.type; // 'Directory' or 'File'
                if (entryType === 'File') {
                    forEach(entryPath, entryContent);
                }
                else {
                    e.autodrain();
                }
            } catch (error) {
                console.error(`Error while unzipping item at '${entryPath}', error: ${error}`);
            }
        })
        .promise();
}
