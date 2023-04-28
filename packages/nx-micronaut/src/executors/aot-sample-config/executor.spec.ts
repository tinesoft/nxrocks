import { logger } from '@nx/devkit';
import { mocked } from 'jest-mock';

import { aotSampleConfigExecutor } from './executor';
import { AotSampleConfigExecutorOptions } from './schema';
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

const mockContext = mockExecutorContext(NX_MICRONAUT_PKG, 'aot-sample-config');
const options: AotSampleConfigExecutorOptions = {
  root: 'apps/mnapp',
};

describe('Aot Sample Config Executor', () => {
  beforeEach(async () => {
    jest.spyOn(logger, 'info');
    jest.spyOn(cp, 'execSync');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it.each`
    ignoreWrapper | buildSystem | buildFile         | execute
    ${true}       | ${'maven'}  | ${'pom.xml'}      | ${'mvn mn:aot-sample-config '}
    ${true}       | ${'gradle'} | ${'build.gradle'} | ${'gradle createAotSampleConfigurationFiles '}
    ${false}      | ${'maven'}  | ${'pom.xml'}      | ${MAVEN_WRAPPER_EXECUTABLE_LEGACY + ' mn:aot-sample-config '}
    ${false}      | ${'gradle'} | ${'build.gradle'} | ${GRADLE_WRAPPER_EXECUTABLE + ' createAotSampleConfigurationFiles '}
  `(
    'should execute a $buildSystem build and ignoring wrapper : $ignoreWrapper',
    async ({ ignoreWrapper, buildFile, execute }) => {
      mocked(fsUtility.fileExists).mockImplementation(
        (filePath: string) => filePath.indexOf(buildFile) !== -1
      );

      await aotSampleConfigExecutor({ ...options, ignoreWrapper }, mockContext);

      expectExecutorCommandRanWith(execute, mockContext, options);
    }
  );
});
