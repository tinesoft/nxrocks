import { logger } from '@nrwl/devkit';
import { mocked } from 'ts-jest/utils';
import each from 'jest-each';

import { runExecutor } from './executor';
import { RunExecutorOptions } from './schema';
import { mockExecutorContext } from '../../utils/test-utils';

//first, we mock
jest.mock('child_process');
jest.mock('@nrwl/workspace/src/utils/fileutils');

//then, we import
import * as fsUtility from '@nrwl/workspace/src/utils/fileutils';
import * as cp from 'child_process';


const mockContext = mockExecutorContext('run');
const options: RunExecutorOptions = {
  root: 'apps/bootapp'
};

describe('Run Executor', () => {

  beforeEach(async () => {
    jest.spyOn(logger, 'info');
    jest.spyOn(cp, 'execSync');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  each`
    ignoreWrapper | buildSystem | buildFile         | execute
    ${true}       | ${'maven'}  | ${'pom.xml'}      | ${'mvn spring-boot:run '}
    ${true}       | ${'gradle'} | ${'build.gradle'} | ${'gradle bootRun '}
    ${false}      | ${'maven'}  | ${'pom.xml'}      | ${'./mvnw spring-boot:run '}
    ${false}      | ${'gradle'} | ${'build.gradle'} | ${'./gradlew bootRun '}
  `.it('should execute a $buildSystem build and ignoring wrapper : $ignoreWrapper', async ({ ignoreWrapper, buildSystem, buildFile, execute }) => {
    mocked(fsUtility.fileExists).mockImplementation((path: string) => path.indexOf(buildFile) !== -1);

    await runExecutor({ ...options, ignoreWrapper }, mockContext);

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
