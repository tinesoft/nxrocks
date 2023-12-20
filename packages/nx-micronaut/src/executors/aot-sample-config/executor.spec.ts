import { joinPathFragments, logger } from '@nx/devkit';
import { mocked } from 'jest-mock';

import { aotSampleConfigExecutor } from './executor';
import { AotSampleConfigExecutorOptions } from './schema';
import { NX_MICRONAUT_PKG } from '../../index';
import {
  GRADLE_WRAPPER_EXECUTABLE,
  MAVEN_WRAPPER_EXECUTABLE_LEGACY,
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

const mockContext = mockExecutorContext(NX_MICRONAUT_PKG, 'aot-sample-config');
const options: AotSampleConfigExecutorOptions = {
  root: 'mnapp',
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
    async ({ ignoreWrapper, buildSystem, buildFile, execute }) => {

      const files = [buildFile as string, ...(buildSystem === 'maven'? getMavenWrapperFiles() : getGradleWrapperFiles())];
      mocked(fsUtility.fileExists).mockImplementation(
        (filePath: PathLike) => files.some((f) => joinPathFragments(filePath.toString()).endsWith(f))
      );

      await aotSampleConfigExecutor({ ...options, ignoreWrapper }, mockContext);

      expectExecutorCommandRanWith(execute, mockContext, options);
    }
  );
});
