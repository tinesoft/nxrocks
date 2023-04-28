import { logger } from '@nx/devkit';
import { mocked } from 'jest-mock';

import { buildImageExecutor } from './executor';
import { BuildImageExecutorOptions } from './schema';
import {
  GRADLE_WRAPPER_EXECUTABLE,
  MAVEN_WRAPPER_EXECUTABLE,
  NX_SPRING_BOOT_PKG,
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

const mockContext = mockExecutorContext(NX_SPRING_BOOT_PKG, 'build-image');
const options: BuildImageExecutorOptions = {
  root: 'apps/bootapp',
};

describe('BuildImage Executor', () => {
  beforeEach(async () => {
    jest.spyOn(logger, 'info');
    jest.spyOn(cp, 'execSync');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it.each`
    ignoreWrapper | buildSystem | buildFile         | execute
    ${true}       | ${'maven'}  | ${'pom.xml'}      | ${'mvn spring-boot:build-image '}
    ${true}       | ${'gradle'} | ${'build.gradle'} | ${'gradle bootBuildImage '}
    ${false}      | ${'maven'}  | ${'pom.xml'}      | ${MAVEN_WRAPPER_EXECUTABLE + ' spring-boot:build-image '}
    ${false}      | ${'gradle'} | ${'build.gradle'} | ${GRADLE_WRAPPER_EXECUTABLE + ' bootBuildImage '}
  `(
    'should execute a $buildSystem build and ignoring wrapper : $ignoreWrapper',
    async ({ ignoreWrapper, buildFile, execute }) => {
      mocked(fsUtility.fileExists).mockImplementation(
        (filePath: string) => filePath.indexOf(buildFile) !== -1
      );

      await buildImageExecutor({ ...options, ignoreWrapper }, mockContext);

      expectExecutorCommandRanWith(execute, mockContext, options);
    }
  );
});
