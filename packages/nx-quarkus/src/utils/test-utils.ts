import { ExecutorContext } from "@nrwl/devkit";
import { Entry } from "unzipper";

export function mockExecutorContext(executorName: string, workspaceVersion = 2): ExecutorContext {
    return {
        root: '/root',
        cwd: 'root',
        projectName: 'proj',
        workspace: {
            version: workspaceVersion,
            projects: {
                proj: {
                    root: 'proj',
                    targets: {
                        test: {
                            executor: `@nxrocks/nx-quarkus:${executorName}`,
                        },
                    },
                },
            },
        },
        target: {
            executor: `@nxrocks/nx-quarkus:${executorName}`,
        },
        isVerbose: false,
    };
}

export function mockZipEntries(files: string[]): Entry[] {

    return files.map(e => {
       return  {
            path: e,
            buffer: () => Promise.resolve(Buffer.from(e)),
            type: 'File'
        } as Entry
    });
}

export async function* syncToAsyncIterable(syncIterable) {
    for (const elem of syncIterable) {
        yield elem;
    }
}
