import { logger } from '@nx/devkit';
import { mocked } from 'jest-mock';

import { runDockerExecutor } from './executor';
import { RunDockerExecutorOptions } from './schema';
import {
  GRADLE_WRAPPER_EXECUTABLE,
  MAVEN_WRAPPER_EXECUTABLE_LEGACY,
  NX_KTOR_PKG,
} from '@nxrocks/common';
import {
  expectExecutorCommandRanWith,
  mockExecutorContext,
} from '@nxrocks/common/testing';

//first, we mock
jest.mock('child_process');
jest.mock('@nx/workspace/src/utils/fileutils');

//then, we import
import * as fsUtility from '@nx/workspace/src/utils/fileutils';
import * as cp from 'child_process';

const mockContext = mockExecutorContext(NX_KTOR_PKG, 'run-docker');
const options: RunDockerExecutorOptions = {
  root: 'apps/krapp',
};

describe('RunDocker Executor', () => {
  beforeEach(async () => {
    jest.spyOn(logger, 'info');
    jest.spyOn(cp, 'execSync');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it.each`
    ignoreWrapper | buildSystem | buildFile         | execute
    ${true}       | ${'maven'}  | ${'pom.xml'}      | ${'mvn docker:run '}
    ${true}       | ${'gradle'} | ${'build.gradle'} | ${'gradle runDocker '}
    ${false}      | ${'maven'}  | ${'pom.xml'}      | ${MAVEN_WRAPPER_EXECUTABLE_LEGACY + ' docker:run '}
    ${false}      | ${'gradle'} | ${'build.gradle'} | ${GRADLE_WRAPPER_EXECUTABLE + ' runDocker '}
  `(
    'should execute a $buildSystem run-docker and ignoring wrapper : $ignoreWrapper',
    async ({ ignoreWrapper, buildFile, execute }) => {
      (fsUtility.fileExists as jest.Mock).mockImplementation(
        (filePath: string) => filePath.indexOf(buildFile) !== -1
      );

      await runDockerExecutor({ ...options, ignoreWrapper }, mockContext);

      expectExecutorCommandRanWith(execute, mockContext, options);
    }
  );
});
