import { logger } from '@nrwl/devkit';
import { mocked } from 'ts-jest/utils';

import { buildInfoExecutor } from './executor';
import { BuildInfoExecutorOptions } from './schema';
import { mockExecutorContext } from '../../utils/test-utils';

//first, we mock
jest.mock('child_process');
jest.mock('@nrwl/workspace/src/utils/fileutils');

//then, we import
import * as fsUtility from '@nrwl/workspace/src/utils/fileutils';
import * as cp from 'child_process';


const mockContext = mockExecutorContext('build-info');
const options: BuildInfoExecutorOptions = {
  root: 'apps/bootapp'
};

describe('BuildInfo Executor', () => {

  beforeEach(async () => {
    jest.spyOn(logger, 'info');
    jest.spyOn(cp, 'execSync');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it.each`
    ignoreWrapper | buildSystem | buildFile         | execute
    ${true}       | ${'maven'}  | ${'pom.xml'}      | ${'mvn spring-boot:build-info '}
    ${true}       | ${'gradle'} | ${'build.gradle'} | ${'gradle bootBuildInfo '}
    ${false}      | ${'maven'}  | ${'pom.xml'}      | ${'./mvnw spring-boot:build-info '}
    ${false}      | ${'gradle'} | ${'build.gradle'} | ${'./gradlew bootBuildInfo '}
  `('should execute a $buildSystem build and ignoring wrapper : $ignoreWrapper', async ({ ignoreWrapper, buildSystem, buildFile, execute }) => {
    mocked(fsUtility.fileExists).mockImplementation((path: string) => path.indexOf(buildFile) !== -1);

    await buildInfoExecutor({ ...options, ignoreWrapper }, mockContext);

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
