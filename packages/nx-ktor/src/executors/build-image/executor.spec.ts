import { logger } from '@nrwl/devkit';
import { mocked } from 'jest-mock';

import { buildImageExecutor } from './executor';
import { BuildImageExecutorOptions } from './schema';
import { GRADLE_WRAPPER_EXECUTABLE, MAVEN_WRAPPER_EXECUTABLE_LEGACY, NX_KTOR_PKG } from '@nxrocks/common';
import { expectExecutorCommandRanWith, mockExecutorContext } from '@nxrocks/common/testing';

//first, we mock
jest.mock('child_process');
jest.mock('@nrwl/workspace/src/utils/fileutils');

//then, we import
import * as fsUtility from '@nrwl/workspace/src/utils/fileutils';
import * as cp from 'child_process';

const mockContext = mockExecutorContext(NX_KTOR_PKG,'build-image');
const options: BuildImageExecutorOptions = {
  root: 'apps/krapp'
};

describe('PublishImage Executor', () => {

  beforeEach(async () => {
    jest.spyOn(logger, 'info');
    jest.spyOn(cp, 'execSync');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it.each`
    ignoreWrapper | buildSystem | buildFile              | execute
    ${true}       | ${'maven'}  | ${'pom.xml'}           | ${'mvn docker:build '}
    ${true}       | ${'gradle'} | ${'build.gradle'}      | ${'gradle buildImage '}
    ${false}      | ${'maven'}  | ${'pom.xml'}           | ${MAVEN_WRAPPER_EXECUTABLE_LEGACY + ' docker:build '}
    ${false}      | ${'gradle'} | ${'build.gradle'}      | ${GRADLE_WRAPPER_EXECUTABLE + ' buildImage '}
  `('should execute a $buildSystem build-image and ignoring wrapper : $ignoreWrapper', async ({ ignoreWrapper, buildFile, execute }) => {
    (fsUtility.fileExists as jest.Mock).mockImplementation((filePath: string) => filePath.indexOf(buildFile) !== -1);

    await buildImageExecutor({ ...options, ignoreWrapper }, mockContext);

    expectExecutorCommandRanWith(execute, mockContext, options);
  });

});
