import { getPackageManagerCommand } from '@nx/devkit';
import { hasNxWrapper, isNxWrapperInstalled } from '@nxrocks/common-cli';
import { createCLITestProject } from '@nxrocks/common-jvm/testing';
import { execSync } from 'child_process';
import { rmSync } from 'fs';
import { join } from 'path';

describe('create-nx-spring-boot', () => {
  let projectDirectory: string;

  beforeAll(() => {
    // Cleanup the test project
    projectDirectory &&
      rmSync(projectDirectory, {
        recursive: true,
        force: true,
      });
  });

  it.each`
    useNxWrapper
    ${false}
  `('should be installed with Nx Wrapper=$useNxWrapper', ({ useNxWrapper }) => {
    projectDirectory = createCLITestProject(
      'create-nx-spring-boot',
      `--prjName=bootapp --useNxWrapper=${useNxWrapper} --nxCloud=skip --useGitHub=false --no-interactive`
    );

    // npm ls will fail if the package is not installed properly
    execSync(`${getPackageManagerCommand().list} @nxrocks/nx-spring-boot`, {
      cwd: useNxWrapper
        ? join(projectDirectory, '/.nx/installation')
        : projectDirectory,
      stdio: 'inherit',
      env: process.env,
    });

    expect(hasNxWrapper(projectDirectory)).toEqual(useNxWrapper);

    if (useNxWrapper) {
      expect(isNxWrapperInstalled(projectDirectory)).toBe(true);
    }
  });
});
