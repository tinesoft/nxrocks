jest.mock('node:child_process');
jest.mock('nx/src/utils/fileutils');

import { joinPathFragments, logger } from '@nx/devkit';

import { publishImageLocallyExecutor } from './executor';
import { PublishImageLocallyExecutorOptions } from './schema';
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

import * as fsUtility from 'nx/src/utils/fileutils';
import * as cp from 'node:child_process';
import { mocked } from 'jest-mock';
import { PathLike } from 'fs';

const mockContext = mockExecutorContext(NX_KTOR_PKG, 'publish-image');
const options: PublishImageLocallyExecutorOptions = {
  root: 'krapp',
};

describe('PublishImageLocally Executor', () => {
  beforeEach(async () => {
    jest.spyOn(logger, 'info');
    jest.spyOn(cp, 'execSync');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it.each`
    ignoreWrapper | buildSystem | buildFile         | execute
    ${true}       | ${'maven'}  | ${'pom.xml'}      | ${'mvn docker:push '}
    ${true}       | ${'gradle'} | ${'build.gradle'} | ${'gradle publishImageToLocalRegistry '}
    ${false}      | ${'maven'}  | ${'pom.xml'}      | ${MAVEN_WRAPPER_EXECUTABLE_LEGACY + ' docker:push '}
    ${false}      | ${'gradle'} | ${'build.gradle'} | ${GRADLE_WRAPPER_EXECUTABLE + ' publishImageToLocalRegistry '}
  `(
    'should execute a $buildSystem publish-image and ignoring wrapper : $ignoreWrapper',
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

      await publishImageLocallyExecutor(
        { ...options, ignoreWrapper },
        mockContext
      );

      expectExecutorCommandRanWith(execute, mockContext, options);
    }
  );
});
