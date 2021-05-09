import { logger } from '@nrwl/devkit';
import { mocked } from 'ts-jest/utils';

import { listExtensionsExecutor } from './executor';
import { ListExtensionsExecutorOptions } from './schema';
import { mockExecutorContext } from '../../utils/test-utils';

import * as path from 'path';

//first, we mock
jest.mock('child_process');
jest.mock('@nrwl/workspace/src/utils/fileutils');

//then, we import
import * as fsUtility from '@nrwl/workspace/src/utils/fileutils';
import * as cp from 'child_process';

const isWin = process.platform === "win32";
const mvnw = isWin ? 'mvnw.cmd' : './mvnw';
const gradlew = isWin ? 'gradlew.bat' : './gradlew';

const mockContext = mockExecutorContext('listExtensions');
const options: ListExtensionsExecutorOptions = {
  root: 'apps/quarkusapp'
};

describe('List Extensions Executor', () => {

  beforeEach(async () => {
    jest.spyOn(logger, 'info');
    jest.spyOn(cp, 'execSync');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it.each`
    ignoreWrapper | buildSystem | buildFile         | execute
    ${true}       | ${'maven'}  | ${'pom.xml'}      | ${'mvn quarkus:list-extensions '}
    ${true}       | ${'gradle'} | ${'build.gradle'} | ${'gradle quarkusListExtensions '}
    ${false}      | ${'maven'}  | ${'pom.xml'}      | ${mvnw + ' quarkus:list-extensions '}
    ${false}      | ${'gradle'} | ${'build.gradle'} | ${gradlew + ' quarkusListExtensions '}
  `('should execute a $buildSystem build and ignoring wrapper : $ignoreWrapper', async ({ ignoreWrapper, buildSystem, buildFile, execute }) => {
    mocked(fsUtility.fileExists).mockImplementation((filePath: string) => filePath.indexOf(buildFile) !== -1);

    await listExtensionsExecutor({ ...options, ignoreWrapper }, mockContext);

    expect(logger.info).toHaveBeenLastCalledWith(`Executing command: ${execute}`);
    expect(cp.execSync).toHaveBeenCalledWith(
      execute,
      expect.objectContaining({
        cwd: expect.stringContaining(path.join(mockContext.root,options.root)),
        stdio: [0, 1, 2]
      })
    );
  });

});
