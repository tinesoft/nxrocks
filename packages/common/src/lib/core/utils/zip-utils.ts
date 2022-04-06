import { Entry, Parse } from 'unzipper';


export async function extractFromZipStream(zipStream: NodeJS.ReadableStream, forEach: (entryPath:string, entryContent: Buffer) => void): Promise<void> {

    const zip = zipStream.pipe(Parse({ forceStream: true }));
    for await (const entry of zip) {
        const e = entry as Entry;
        const entryPath = e.path;
        try {
            const entryContent = await e.buffer();
            const entryType = e.type; // 'Directory' or 'File'
            if(entryType === 'File'){
                forEach(entryPath, entryContent);
            }
        } catch (error) {
            console.error(`Error while unzipping item at '${entryPath}', error: ${error}`);
        }
    }
}
