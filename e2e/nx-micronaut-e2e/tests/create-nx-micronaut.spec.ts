import { hasNxWrapper, isNxWrapperInstalled } from '@nxrocks/common';
import { createCLITestProject } from '@nxrocks/common/testing';
import { execSync } from 'child_process';
import { rmSync } from 'fs';
import { join } from 'path';

describe('create-nx-micronaut', () => {
  let projectDirectory: string;

  afterAll(() => {
    // Cleanup the test project
    rmSync(projectDirectory, {
      recursive: true,
      force: true,
    });
  });

  it.each`
  useNxWrapper
  ${true}
  ${false}
`('should be installed with Nx Wrapper=$useNxWrapper', ({useNxWrapper}) => {
    projectDirectory = createCLITestProject('create-nx-micronaut', `--prjName=bootapp --useNxWrapper=${useNxWrapper} --useNxCloud=false --no-interactive`);

    // npm ls will fail if the package is not installed properly
    execSync('npm ls @nxrocks/nx-micronaut', {
      cwd: useNxWrapper ? join(projectDirectory, '/.nx/installation'): projectDirectory,
      stdio: 'inherit',
    });

    expect(hasNxWrapper(projectDirectory)).toEqual(useNxWrapper);

    if(useNxWrapper){
      expect(isNxWrapperInstalled(projectDirectory)).toBe(true)
    }
  });
});
