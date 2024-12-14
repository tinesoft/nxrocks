import { getPackageManagerCommand } from '@nx/devkit';
import {
  checkFilesExist,
  createTestProject,
  runNxCommandAsync,
} from '@nxrocks/common/testing';
import { execSync } from 'child_process';
import { rmSync } from 'fs-extra';

describe('nx-melos e2e', () => {
  let projectDirectory: string;

  beforeAll(() => {
    projectDirectory = createTestProject();

    // The plugin has been built and published to a local registry in the jest globalSetup
    // Install the plugin built with the latest source code into the test repo
    execSync(
      `${getPackageManagerCommand().addDev} @nxrocks/nx-melos@0.0.0-e2e`,
      {
        cwd: projectDirectory,
        stdio: 'inherit',
        env: process.env,
      }
    );
  });

  afterAll(() => {
    // Cleanup the test project
    projectDirectory &&
      rmSync(projectDirectory, {
        recursive: true,
        force: true,
      });
  });

  it('should be installed', () => {
    // npm ls will fail if the package is not installed properly
    execSync(`${getPackageManagerCommand().list} @nxrocks/nx-melos`, {
      cwd: projectDirectory,
      stdio: 'inherit',
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should initialize melos in the workspace', async () => {
    await runNxCommandAsync(
      `generate @nxrocks/nx-melos:init --scriptNameSeparator="-" --no-interactive`
    );

    const scripts = [
      {
        name: 'melos-bootstrap',
        output: `Successfully ran target melos-bootstrap for project @test-project/source`,
      },
    ];

    let totalExecutorsTime = 0;
    for (const script of scripts) {
      const start = new Date().getTime();
      const result = await runNxCommandAsync(script.name);
      const end = new Date().getTime();
      console.log(`${script.name} took ${end - start}ms`);
      totalExecutorsTime += end - start;
      expect(result.stdout).toContain(script.output);
    }
    console.log(`Total executors time: ${totalExecutorsTime}ms`);

    expect(() => checkFilesExist(`melos.yaml`)).not.toThrow();
  }, 400000);
});
