import { logger } from '@nrwl/devkit';
import { mocked } from 'jest-mock';

import { formatCheckExecutor } from './executor';
import { FormatCheckExecutorOptions } from './schema';
import { GRADLE_WRAPPER_EXECUTABLE, MAVEN_WRAPPER_EXECUTABLE, NX_SPRING_BOOT_PKG } from '@nxrocks/common';
import { expectExecutorCommandRanWith, mockExecutorContext } from '@nxrocks/common/testing';

//first, we mock
jest.mock('child_process');
jest.mock('@nrwl/workspace/src/utils/fileutils');

//then, we import
import * as fsUtility from '@nrwl/workspace/src/utils/fileutils';
import * as cp from 'child_process';

const mockContext = mockExecutorContext(NX_SPRING_BOOT_PKG, 'check-format');
const options: FormatCheckExecutorOptions = {
  root: 'apps/bootapp'
};

describe('Format Check Executor', () => {

  beforeEach(async () => {
    jest.spyOn(logger, 'info');
    jest.spyOn(cp, 'execSync');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it.each`
    ignoreWrapper | buildSystem | formatFile         | execute
    ${true}       | ${'maven'}  | ${'pom.xml'}      | ${'mvn spotless:check '}
    ${true}       | ${'gradle'} | ${'build.gradle'} | ${'gradle spotlessCheck '}
    ${false}      | ${'maven'}  | ${'pom.xml'}      | ${MAVEN_WRAPPER_EXECUTABLE + ' spotless:check '}
    ${false}      | ${'gradle'} | ${'build.gradle'} | ${GRADLE_WRAPPER_EXECUTABLE + ' spotlessCheck '}
  `('should execute a $buildSystem format check and ignoring wrapper : $ignoreWrapper', async ({ ignoreWrapper, formatFile, execute }) => {
    mocked(fsUtility.fileExists).mockImplementation((filePath: string) => filePath.indexOf(formatFile) !== -1);

    await formatCheckExecutor({ ...options, ignoreWrapper }, mockContext);

    expectExecutorCommandRanWith(execute, mockContext, options);
  });

});
