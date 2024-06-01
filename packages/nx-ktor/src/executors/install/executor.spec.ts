import { joinPathFragments, logger } from '@nx/devkit';
import { mocked } from 'jest-mock';

import { installExecutor } from './executor';
import { InstallExecutorOptions } from './schema';
import { NX_KTOR_PKG } from '../../index';
import {
  GRADLE_WRAPPER_EXECUTABLE,
  MAVEN_WRAPPER_EXECUTABLE_LEGACY,
  getGradleWrapperFiles,
  getMavenWrapperFiles,
} from '@nxrocks/common-jvm';
import {
  expectExecutorCommandRanWith,
  mockExecutorContext,
} from '@nxrocks/common-jvm/testing';

//first, we mock
jest.mock('child_process');
jest.mock('@nx/workspace/src/utilities/fileutils');

//then, we import
import * as fsUtility from '@nx/workspace/src/utilities/fileutils';
import * as cp from 'child_process';
import { PathLike } from 'fs';

const mockContext = mockExecutorContext(NX_KTOR_PKG, 'install');
const options: InstallExecutorOptions = {
  root: 'bootapp',
};

describe('Install Executor', () => {
  beforeEach(async () => {
    jest.spyOn(logger, 'info');
    jest.spyOn(cp, 'execSync');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it.each`
    ignoreWrapper | buildSystem | buildFile         | execute
    ${true}       | ${'maven'}  | ${'pom.xml'}      | ${'mvn install '}
    ${true}       | ${'gradle'} | ${'build.gradle'} | ${'gradle publishToMavenLocal '}
    ${false}      | ${'maven'}  | ${'pom.xml'}      | ${MAVEN_WRAPPER_EXECUTABLE_LEGACY + ' install '}
    ${false}      | ${'gradle'} | ${'build.gradle'} | ${GRADLE_WRAPPER_EXECUTABLE + ' publishToMavenLocal '}
  `(
    'should execute a $buildSystem build and ignoring wrapper : $ignoreWrapper',
    async ({ ignoreWrapper, buildSystem, buildFile, execute }) => {
      const files = [
        buildFile as string,
        ...(buildSystem === 'maven'
          ? getMavenWrapperFiles()
          : getGradleWrapperFiles()),
      ];
      mocked(fsUtility.fileExists).mockImplementation((filePath: PathLike) =>
        files.some((f) => joinPathFragments(filePath.toString()).endsWith(f))
      );

      await installExecutor({ ...options, ignoreWrapper }, mockContext);

      expectExecutorCommandRanWith(execute, mockContext, options);
    }
  );
});
