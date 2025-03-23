import { getPackageManagerCommand } from '@nx/devkit';
import {
  checkFilesExist,
  createTestProject,
  noFormat,
  runNxCommandAsync,
} from '@nxrocks/common/testing';
import { execSync } from 'child_process';
import { rmSync } from 'fs-extra';

describe('nx-melos e2e', () => {
  let projectDirectory: string;

  afterAll(() => {
    if (projectDirectory) {
      // Cleanup the test project
      rmSync(projectDirectory, {
        recursive: true,
        force: true,
      });
    }
  });

  beforeAll(() => {
    projectDirectory = createTestProject('test-project-melos');

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
      `generate @nxrocks/nx-melos:init --scriptNameSeparator="-" --no-interactive`,
      {
        cwd: projectDirectory,
      }
    );

    const scripts = [
      {
        name: 'melos-bootstrap',
        output: `Successfully ran target melos-bootstrap for project @test-project-melos/source`,
      },
    ];

    let totalExecutorsTime = 0;
    for (const script of scripts) {
      const start = new Date().getTime();
      const result = await runNxCommandAsync(script.name, {
        cwd: projectDirectory,
      });
      const end = new Date().getTime();
      console.log(`${script.name} took ${end - start}ms`);
      totalExecutorsTime += end - start;
      expect(noFormat(result.stdout)).toContain(script.output);
    }
    console.log(`Total executors time: ${totalExecutorsTime}ms`);

    expect(() =>
      checkFilesExist(`${projectDirectory}/melos.yaml`)
    ).not.toThrow();
  }, 400000);
});
