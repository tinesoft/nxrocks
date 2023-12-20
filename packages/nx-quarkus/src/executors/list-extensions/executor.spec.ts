import { joinPathFragments, logger } from '@nx/devkit';
import { mocked } from 'jest-mock';

import { listExtensionsExecutor } from './executor';
import { ListExtensionsExecutorOptions } from './schema';
import { NX_QUARKUS_PKG } from '../../index';
import {
  GRADLE_WRAPPER_EXECUTABLE,
  MAVEN_WRAPPER_EXECUTABLE,
  getGradleWrapperFiles,
  getMavenWrapperFiles,
} from '@nxrocks/common-jvm';
import {
  expectExecutorCommandRanWith,
  mockExecutorContext,
} from '@nxrocks/common/testing';

//first, we mock
jest.mock('child_process');
jest.mock('@nx/workspace/src/utilities/fileutils');

//then, we import
import * as fsUtility from '@nx/workspace/src/utilities/fileutils';
import * as cp from 'child_process';
import { PathLike } from 'fs';

const mockContext = mockExecutorContext(NX_QUARKUS_PKG, 'list-extensions');
const options: ListExtensionsExecutorOptions = {
  root: 'quarkusapp',
};

describe('List Extensions Executor', () => {
  beforeEach(async () => {
    jest.spyOn(logger, 'info');
    jest.spyOn(cp, 'execSync');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it.each`
    ignoreWrapper | buildSystem | buildFile         | execute
    ${true}       | ${'maven'}  | ${'pom.xml'}      | ${'mvn quarkus:list-extensions '}
    ${true}       | ${'gradle'} | ${'build.gradle'} | ${'gradle quarkusListExtensions '}
    ${false}      | ${'maven'}  | ${'pom.xml'}      | ${MAVEN_WRAPPER_EXECUTABLE + ' quarkus:list-extensions '}
    ${false}      | ${'gradle'} | ${'build.gradle'} | ${GRADLE_WRAPPER_EXECUTABLE + ' quarkusListExtensions '}
  `(
    'should execute a $buildSystem build and ignoring wrapper : $ignoreWrapper',
    async ({ ignoreWrapper, buildSystem, buildFile, execute }) => {

      const files = [buildFile as string, ...(buildSystem === 'maven'? getMavenWrapperFiles() : getGradleWrapperFiles())];
      mocked(fsUtility.fileExists).mockImplementation(
        (filePath: PathLike) => files.some((f) => joinPathFragments(filePath.toString()).endsWith(f))
      );

      await listExtensionsExecutor({ ...options, ignoreWrapper }, mockContext);

      expectExecutorCommandRanWith(execute, mockContext, options);
    }
  );
});
