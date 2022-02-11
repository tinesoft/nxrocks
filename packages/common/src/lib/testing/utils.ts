import { ExecutorContext } from '@nrwl/devkit';
import { Entry } from 'unzipper';

export function mockExecutorContext(
  pluginName: string,
  executorName: string,
  workspaceVersion = 2
): ExecutorContext {
  return {
    root: '/root',
    cwd: 'root',
    projectName: 'proj',
    workspace: {
      npmScope: 'nxrocks',
      version: workspaceVersion,
      projects: {
        proj: {
          root: 'proj',
          targets: {
            test: {
              executor: `${pluginName}:${executorName}`,
            },
          },
        },
      },
    },
    target: {
      executor: `${pluginName}:${executorName}`,
    },
    isVerbose: false,
  };
}

export function mockZipEntries(files: (string | { filePath: string, fileContent?: string})[]): Entry[] {
  return files.map((e) => {
    return {
      path: typeof e === 'string' ? e : e.filePath,
      buffer: () => Promise.resolve(Buffer.from(typeof e === 'string' ? e : e.fileContent??e.filePath)),
      type: 'File',
    } as Entry;
  });
}

export async function* syncToAsyncIterable(syncIterable) {
  for (const elem of syncIterable) {
    yield elem;
  }
}
