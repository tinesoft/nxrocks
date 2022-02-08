import { logger } from '@nrwl/devkit';
import { mocked } from 'ts-jest/utils';

import { formatExecutor } from './executor';
import { FormatExecutorOptions } from './schema';
import { GRADLE_WRAPPER_EXECUTABLE, MAVEN_WRAPPER_EXECUTABLE, NX_SPRING_BOOT_PKG } from '@nxrocks/common';
import { expectExecutorCommandRanWith, mockExecutorContext } from '@nxrocks/common/testing';

//first, we mock
jest.mock('child_process');
jest.mock('@nrwl/workspace/src/utils/fileutils');

//then, we import
import * as fsUtility from '@nrwl/workspace/src/utils/fileutils';
import * as cp from 'child_process';

const mockContext = mockExecutorContext(NX_SPRING_BOOT_PKG, 'format');
const options: FormatExecutorOptions = {
  root: 'apps/bootapp'
};

describe('Format Executor', () => {

  beforeEach(async () => {
    jest.spyOn(logger, 'info');
    jest.spyOn(cp, 'execSync');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it.each`
    ignoreWrapper | buildSystem | formatFile         | execute
    ${true}       | ${'maven'}  | ${'pom.xml'}      | ${'mvn spotless:apply '}
    ${true}       | ${'gradle'} | ${'build.gradle'} | ${'gradle spotlessApply '}
    ${false}      | ${'maven'}  | ${'pom.xml'}      | ${MAVEN_WRAPPER_EXECUTABLE + ' spotless:apply '}
    ${false}      | ${'gradle'} | ${'build.gradle'} | ${GRADLE_WRAPPER_EXECUTABLE + ' spotlessApply '}
  `('should execute a $buildSystem format and ignoring wrapper : $ignoreWrapper', async ({ ignoreWrapper, formatFile, execute }) => {
    mocked(fsUtility.fileExists).mockImplementation((filePath: string) => filePath.indexOf(formatFile) !== -1);

    await formatExecutor({ ...options, ignoreWrapper }, mockContext);

    expectExecutorCommandRanWith(execute, mockContext, options);
  });

});
