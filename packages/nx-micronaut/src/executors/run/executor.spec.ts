import { logger } from '@nx/devkit';
import { mocked } from 'jest-mock';

import { runExecutor } from './executor';
import { RunExecutorOptions } from './schema';
import {
  GRADLE_WRAPPER_EXECUTABLE,
  MAVEN_WRAPPER_EXECUTABLE_LEGACY,
  NX_MICRONAUT_PKG,
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

const mockContext = mockExecutorContext(NX_MICRONAUT_PKG, 'run');
const options: RunExecutorOptions = {
  root: 'apps/mnapp',
};

describe('Run Executor', () => {
  beforeEach(async () => {
    jest.spyOn(logger, 'info');
    jest.spyOn(cp, 'execSync');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it.each`
    ignoreWrapper | buildFile         | execute
    ${true}       | ${'pom.xml'}      | ${'mvn mn:run '}
    ${true}       | ${'build.gradle'} | ${'gradle run '}
    ${false}      | ${'pom.xml'}      | ${MAVEN_WRAPPER_EXECUTABLE_LEGACY + ' mn:run '}
    ${false}      | ${'build.gradle'} | ${GRADLE_WRAPPER_EXECUTABLE + ' run '}
  `(
    'should execute a $buildSystem build and ignoring wrapper : $ignoreWrapper',
    async ({ ignoreWrapper, buildFile, execute }) => {
      mocked(fsUtility.fileExists).mockImplementation(
        (filePath: string) => filePath.indexOf(buildFile) !== -1
      );

      await runExecutor({ ...options, ignoreWrapper }, mockContext);

      expectExecutorCommandRanWith(execute, mockContext, options);
    }
  );
});
