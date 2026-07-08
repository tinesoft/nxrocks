jest.mock('node:child_process');
jest.mock('nx/src/utils/fileutils');

import { joinPathFragments, logger } from '@nx/devkit';
//

import { buildImageExecutor } from './executor';
import { BuildImageExecutorOptions } from './schema';
import { NX_SPRING_BOOT_PKG } from '../../index';
import {
  GRADLE_WRAPPER_EXECUTABLE,
  MAVEN_WRAPPER_EXECUTABLE,
  getGradleWrapperFiles,
  getMavenWrapperFiles,
} from '@nxrocks/common-jvm';
import {
  expectExecutorCommandRanWith,
  mockExecutorContext,
} from '@nxrocks/common-jvm/testing';

import * as fsUtility from 'nx/src/utils/fileutils';
import * as cp from 'node:child_process';
import { PathLike } from 'fs';

const mockContext = mockExecutorContext(NX_SPRING_BOOT_PKG, 'build-image');
const options: BuildImageExecutorOptions = {
  root: 'bootapp',
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
    async ({ ignoreWrapper, buildSystem, buildFile, execute }) => {
      const files = [
        buildFile as string,
        ...(buildSystem === 'maven'
          ? getMavenWrapperFiles()
          : getGradleWrapperFiles()),
      ];

      (fsUtility.fileExists as jest.Mock).mockImplementation(
        (filePath: PathLike) =>
          files.some((f) => joinPathFragments(filePath.toString()).endsWith(f))
      );

      await buildImageExecutor({ ...options, ignoreWrapper }, mockContext);

      expectExecutorCommandRanWith(execute, mockContext, options);
    }
  );
});
