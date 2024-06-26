import { hasNxWrapper, isNxWrapperInstalled } from '@nxrocks/common-cli';
import { createCLITestProject } from '@nxrocks/common-jvm/testing';
import { execSync } from 'child_process';
import { rmSync } from 'fs';
import { join } from 'path';

describe('create-nx-micronaut', () => {
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
      'create-nx-micronaut',
      `--prjName=bootapp --useNxWrapper=${useNxWrapper} --nxCloud=skip --no-interactive`
    );

    // npm ls will fail if the package is not installed properly
    execSync('npm ls @nxrocks/nx-micronaut', {
      cwd: useNxWrapper
        ? join(projectDirectory, '/.nx/installation')
        : projectDirectory,
      stdio: 'inherit',
    });

    expect(hasNxWrapper(projectDirectory)).toEqual(useNxWrapper);

    if (useNxWrapper) {
      expect(isNxWrapperInstalled(projectDirectory)).toBe(true);
    }
  });
});
