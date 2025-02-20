import { getPackageManagerCommand } from '@nx/devkit';
import { hasNxWrapper, isNxWrapperInstalled } from '@nxrocks/common-cli';
import { createCLITestProject } from '@nxrocks/common-jvm/testing';
import { execSync } from 'child_process';
import { rmSync } from 'fs';
import { join } from 'path';

describe('create-nx-quarkus', () => {
  let projectDirectory: string;

  beforeEach(() => {
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
      'create-nx-quarkus',
      `--prjName=qkapp --useNxWrapper=${useNxWrapper} --nxCloud=skip --useGitHub=false --no-interactive`
    );

    // npm ls will fail if the package is not installed properly
    execSync(`${getPackageManagerCommand().list} @nxrocks/nx-quarkus`, {
      cwd: useNxWrapper
        ? join(projectDirectory, '/.nx/installation')
        : projectDirectory,
      stdio: 'inherit',
      env: process.env,
    });

    expect(hasNxWrapper(projectDirectory)).toEqual(useNxWrapper);

    expect(isNxWrapperInstalled(projectDirectory)).toBe(useNxWrapper);
  });
});
