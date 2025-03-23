import { ExecutorContext } from '@nx/devkit';
import { Entry } from 'unzipper';
import { PassThrough } from 'stream';

function toEntry(e: string | { filePath: string; fileContent?: string }) {
  return {
    path: typeof e === 'string' ? e : e.filePath,
    buffer: () =>
      Promise.resolve(
        Buffer.from(typeof e === 'string' ? e : e.fileContent ?? e.filePath)
      ),
    type: 'File',
  } as Entry;
}

export function mockExecutorContext(
  pluginName: string,
  executorName: string
): ExecutorContext {
  return {
    root: '',
    cwd: '',
    projectGraph: {
      nodes: {},
      dependencies: {},
    },
    projectsConfigurations: {
      projects: {},
      version: 2,
    },
    nxJsonConfiguration: {},
    target: {
      executor: `${pluginName}:${executorName}`,
    },
    isVerbose: false,
  };
}

export function mockZipEntries(
  files: (string | { filePath: string; fileContent?: string })[]
): Entry[] {
  return files.map(toEntry);
}

export function mockZipStream(
  files: (string | { filePath: string; fileContent?: string })[]
) {
  const mockedStream = new PassThrough();

  mockedStream['promise'] = () => {
    return new Promise(function (resolve, reject) {
      mockedStream.on('finish', resolve);
      mockedStream.on('error', reject);

      files.forEach((e) => {
        mockedStream.emit('entry', toEntry(e));
      });

      mockedStream.end();
    });
  };
  return mockedStream;
}

export async function* syncToAsyncIterable(syncIterable) {
  for (const elem of syncIterable) {
    yield elem;
  }
}

export function octal(value: string | number): number {
  if (typeof value === 'string') return parseInt(value, 8);
  return value;
}

export function noFormat(str: string) {
  // Remove log colors for fail proof string search
  return str?.replace(
    // eslint-disable-next-line no-control-regex
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    ''
  );
}
