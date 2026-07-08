jest.mock('node:child_process');
jest.mock('nx/src/utils/fileutils');

import { joinPathFragments, logger } from '@nx/devkit';

import { buildExecutor } from './executor';
import { BuildExecutorOptions } from './schema';
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

const mockContext = mockExecutorContext(NX_SPRING_BOOT_PKG, 'build-jar');
const options: BuildExecutorOptions = {
  root: 'bootapp',
};

describe('Build Executor', () => {
  beforeEach(async () => {
    jest.spyOn(logger, 'info');
    jest.spyOn(cp, 'execSync');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it.each`
    ignoreWrapper | buildSystem | buildFile         | execute
    ${true}       | ${'maven'}  | ${'pom.xml'}      | ${'mvn package '}
    ${true}       | ${'gradle'} | ${'build.gradle'} | ${'gradle build '}
    ${false}      | ${'maven'}  | ${'pom.xml'}      | ${MAVEN_WRAPPER_EXECUTABLE + ' package '}
    ${false}      | ${'gradle'} | ${'build.gradle'} | ${GRADLE_WRAPPER_EXECUTABLE + ' build '}
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

      await buildExecutor({ ...options, ignoreWrapper }, mockContext);

      expectExecutorCommandRanWith(execute, mockContext, options);
    }
  );
});
