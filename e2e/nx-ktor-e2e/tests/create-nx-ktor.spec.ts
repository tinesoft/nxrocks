import { getPackageManagerCommand } from '@nx/devkit';
import { hasNxWrapper, isNxWrapperInstalled } from '@nxrocks/common-cli';
import { createCLITestProject } from '@nxrocks/common-jvm/testing';
import { execSync } from 'child_process';
import { rmSync } from 'fs';
import { join } from 'path';

describe('create-nx-ktor', () => {
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
    ${true}
    ${false}
  `('should be installed with Nx Wrapper=$useNxWrapper', ({ useNxWrapper }) => {
    projectDirectory = createCLITestProject(
      'create-nx-ktor',
      `--prjName=ktapp --useNxWrapper=${useNxWrapper} --nxCloud=skip --useGitHub=false --no-interactive`
    );

    // npm ls will fail if the package is not installed properly
    execSync(`${getPackageManagerCommand().list} @nxrocks/nx-ktor`, {
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
