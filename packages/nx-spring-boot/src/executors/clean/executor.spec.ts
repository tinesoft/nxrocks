import { logger } from '@nrwl/devkit';
import { mocked } from 'ts-jest/utils';

import { cleanExecutor } from './executor';
import { CleanExecutorOptions } from './schema';
import { mockExecutorContext } from '../../utils/test-utils';

//first, we mock
jest.mock('child_process');
jest.mock('@nrwl/workspace/src/utils/fileutils');

//then, we import
import * as fsUtility from '@nrwl/workspace/src/utils/fileutils';
import * as cp from 'child_process';


const mockContext = mockExecutorContext('clean');
const options: CleanExecutorOptions = {
  root: 'apps/bootapp'
};

describe('Clean Executor', () => {

  beforeEach(async () => {
    jest.spyOn(logger, 'info');
    jest.spyOn(cp, 'execSync');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it.each`
    ignoreWrapper | buildSystem | buildFile         | execute
    ${true}       | ${'maven'}  | ${'pom.xml'}      | ${'mvn clean '}
    ${true}       | ${'gradle'} | ${'build.gradle'} | ${'gradle clean '}
    ${false}      | ${'maven'}  | ${'pom.xml'}      | ${'./mvnw clean '}
    ${false}      | ${'gradle'} | ${'build.gradle'} | ${'./gradlew clean '}
  `('should execute a $buildSystem build and ignoring wrapper : $ignoreWrapper', async ({ ignoreWrapper, buildSystem, buildFile, execute }) => {
    mocked(fsUtility.fileExists).mockImplementation((path: string) => path.indexOf(buildFile) !== -1);

    await cleanExecutor({ ...options, ignoreWrapper }, mockContext);

    expect(logger.info).toHaveBeenLastCalledWith(`Executing command: ${execute}`);
    expect(cp.execSync).toHaveBeenCalledWith(
      execute,
      expect.objectContaining({
        cwd: `${mockContext.root}/${options.root}`,
        stdio: [0, 1, 2]
      })
    );
  });

});
