import { logger } from '@nrwl/devkit';
import { mocked } from 'jest-mock';

import { buildExecutor } from './executor';
import { BuildExecutorOptions } from './schema';
import { GRADLE_WRAPPER_EXECUTABLE, MAVEN_WRAPPER_EXECUTABLE, NX_QUARKUS_PKG } from '@nxrocks/common';
import { expectExecutorCommandRanWith, mockExecutorContext } from '@nxrocks/common/testing';

//first, we mock
jest.mock('child_process');
jest.mock('@nrwl/workspace/src/utils/fileutils');

//then, we import
import * as fsUtility from '@nrwl/workspace/src/utils/fileutils';
import * as cp from 'child_process';

const mockContext = mockExecutorContext(NX_QUARKUS_PKG,'build');
const options: BuildExecutorOptions = {
  root: 'apps/quarkusapp'
};

describe('BuildJar Executor', () => {

  beforeEach(async () => {
    jest.spyOn(logger, 'info');
    jest.spyOn(cp, 'execSync');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it.each`
    ignoreWrapper | buildSystem | buildFile         | execute
    ${true}       | ${'maven'}  | ${'pom.xml'}      | ${'mvn build '}
    ${true}       | ${'gradle'} | ${'build.gradle'} | ${'gradle build '}
    ${false}      | ${'maven'}  | ${'pom.xml'}      | ${MAVEN_WRAPPER_EXECUTABLE + ' build '}
    ${false}      | ${'gradle'} | ${'build.gradle'} | ${GRADLE_WRAPPER_EXECUTABLE + ' build '}
  `('should execute a $buildSystem build and ignoring wrapper : $ignoreWrapper', async ({ ignoreWrapper, buildSystem, buildFile, execute }) => {
    (fsUtility.fileExists as jest.Mock).mockImplementation((filePath: string) => filePath.indexOf(buildFile) !== -1);

    await buildExecutor({ ...options, ignoreWrapper }, mockContext);

    expectExecutorCommandRanWith(execute, mockContext, options);
  });

});
