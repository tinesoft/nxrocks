import {
  uniq,
} from '@nx/plugin/testing';
import {
  createTestProject, checkFilesExist, isWin, runNxCommandAsync,
  readJson, tmpProjPath, octal
} from '@nxrocks/common/testing';
import { execSync } from 'child_process';
import { lstatSync, rmSync } from 'fs-extra';

describe('nx-ktor e2e', () => {
  let projectDirectory: string;

  beforeAll(() => {
    projectDirectory = createTestProject();

    // The plugin has been built and published to a local registry in the jest globalSetup
    // Install the plugin built with the latest source code into the test repo
    execSync(`npm install @nxrocks/nx-ktor@e2e`, {
      cwd: projectDirectory,
      stdio: 'inherit',
      env: process.env,
    });
  });

  afterAll(() => {
    // Cleanup the test project
    rmSync(projectDirectory, {
      recursive: true,
      force: true,
    });
  });

  it('should be installed', () => {
    // npm ls will fail if the package is not installed properly
    execSync('npm ls @nxrocks/nx-ktor', {
      cwd: projectDirectory,
      stdio: 'inherit',
    });
  });

  it('should create nx-ktor', async () => {
    const prjName = uniq('nx-ktor');
    await runNxCommandAsync(`generate @nxrocks/nx-ktor:new ${prjName} --no-interactive --verbose`);
    const resultBuild = await runNxCommandAsync(`build ${prjName}`);
    expect(resultBuild.stdout).toContain(
      `Executing command: ${isWin ? 'gradlew.bat' : './gradlew'} buildFatJar`
    );
    expect(() =>
    checkFilesExist(
      `apps/${prjName}/gradlew`,
      `apps/${prjName}/build.gradle.kts`,
      `apps/${prjName}/src/main/kotlin/example/com/Application.kt`
    )
  ).not.toThrow();

  // make sure the build wrapper file is executable (*nix only)
  if (!isWin) {
    const execPermission = '755';
    expect(
      lstatSync(tmpProjPath(`apps/${prjName}/gradlew`)).mode &
      octal(execPermission)
    ).toEqual(octal(execPermission));
  }
  }, 120000);

  describe('--directory', () => {
    it('should create src in the specified directory', async () => {
      const prjName = uniq('nx-ktor');
      await runNxCommandAsync(
        `generate @nxrocks/nx-ktor:new ${prjName} --directory subdir --no-interactive`
      );
      expect(() =>
        checkFilesExist(
          `apps/subdir/${prjName}/gradlew`,
          `apps/subdir/${prjName}/build.gradle.kts`,
          `apps/subdir/${prjName}/src/main/kotlin/example/com/Application.kt`
        )
      ).not.toThrow();
    }, 120000);
  });

  describe('--tags', () => {
    it('should add tags to the project', async () => {
      const prjName = uniq('nx-ktor');
      await runNxCommandAsync(
        `generate @nxrocks/nx-ktor:new ${prjName} --tags e2etag,e2ePackage --no-interactive`
      );
      const project = readJson(`apps/${prjName}/project.json`);
      expect(project.tags).toEqual(['e2etag', 'e2ePackage']);
    }, 120000);
  });
});
