import { logger } from '@nrwl/devkit';
import { mocked } from 'ts-jest/utils';

import { addExtensionExecutor } from './executor';
import { AddExtensionExecutorOptions } from './schema';
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

const mockContext = mockExecutorContext('addExtension');
const options: AddExtensionExecutorOptions = {
  root: 'apps/quarkusapp'
};

describe('Add Extension Executor', () => {

  beforeEach(async () => {
    jest.spyOn(logger, 'info');
    jest.spyOn(cp, 'execSync');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it.each`
    ignoreWrapper | buildSystem | buildFile         | execute
    ${true}       | ${'maven'}  | ${'pom.xml'}      | ${'mvn quarkus:add-extension '}
    ${true}       | ${'gradle'} | ${'build.gradle'} | ${'gradle quarkusAddExtension '}
    ${false}      | ${'maven'}  | ${'pom.xml'}      | ${mvnw + ' quarkus:add-extension '}
    ${false}      | ${'gradle'} | ${'build.gradle'} | ${gradlew + ' quarkusAddExtension '}
  `('should execute a $buildSystem build and ignoring wrapper : $ignoreWrapper', async ({ ignoreWrapper, buildSystem, buildFile, execute }) => {
    mocked(fsUtility.fileExists).mockImplementation((filePath: string) => filePath.indexOf(buildFile) !== -1);

    await addExtensionExecutor({ ...options, ignoreWrapper }, mockContext);

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
