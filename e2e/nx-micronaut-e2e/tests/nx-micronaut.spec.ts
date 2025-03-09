import { uniq } from '@nx/plugin/testing';
import {
  checkFilesExist,
  createTestProject,
  isWin,
  octal,
  readFile,
  readJson,
  runNxCommandAsync,
} from '@nxrocks/common-jvm/testing';
import { getPackageManagerCommand } from '@nx/devkit';

import { execSync } from 'child_process';
import { lstatSync, rmSync } from 'fs';

describe('nx-micronaut e2e', () => {
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
    projectDirectory = createTestProject('test-project-micronaut');

    // The plugin has been built and published to a local registry in the jest globalSetup
    // Install the plugin built with the latest source code into the test repo
    execSync(
      `${getPackageManagerCommand().addDev} @nxrocks/nx-micronaut@0.0.0-e2e`,
      {
        cwd: projectDirectory,
        stdio: 'inherit',
        env: process.env,
      }
    );
  });

  it('should be installed', () => {
    // npm ls will fail if the package is not installed properly
    execSync(`${getPackageManagerCommand().list} @nxrocks/nx-micronaut`, {
      cwd: projectDirectory,
      stdio: 'inherit',
    });
  });

  it('should create nx-micronaut with default options', async () => {
    const directory = uniq('nx-micronaut-');
    runNxCommandAsync(
      `generate @nxrocks/nx-micronaut:new ${directory} --no-interactive`,
      {
        cwd: projectDirectory,
      }
    );

    const resultBuild = await runNxCommandAsync(`build ${directory}`, {
      cwd: projectDirectory,
    });
    expect(resultBuild.stdout).toContain(
      `Executing command: ${isWin ? 'gradlew.bat' : './gradlew'} build`
    );

    expect(() =>
      checkFilesExist(
        `${projectDirectory}/${directory}/gradlew`,
        `${projectDirectory}/${directory}/build.gradle`,
        `${projectDirectory}/${directory}/README.md`
      )
    ).not.toThrow();

    // make sure the build wrapper file is executable (*nix only)
    if (!isWin) {
      const execPermission = '755';
      expect(
        lstatSync(`${projectDirectory}/${directory}/gradlew`).mode &
          octal(execPermission)
      ).toEqual(octal(execPermission));
    }
  }, 200000);

  it.each(['graphql', '', ' '])(
    "should create nx-micronaut with given options (features='%s')",
    async (features: string) => {
      const directory = uniq('nx-micronaut-');
      const buildSystem = 'MAVEN';
      const basePackage = 'com.tinesoft';

      await runNxCommandAsync(
        `generate @nxrocks/nx-micronaut:new ${directory} --projectType default --buildSystem=${buildSystem} --basePackage=${basePackage} --features=${features} --no-interactive`,
        {
          cwd: projectDirectory,
        }
      );

      const resultBuild = await runNxCommandAsync(`build ${directory}`, {
        cwd: projectDirectory,
      });
      expect(resultBuild.stdout).toContain(
        `Executing command: ${isWin ? 'mvnw.bat' : './mvnw'} package`
      );

      expect(() =>
        checkFilesExist(
          `${projectDirectory}/${directory}/mvnw`,
          `${projectDirectory}/${directory}/pom.xml`,
          `${projectDirectory}/${directory}/README.md`,
          `${projectDirectory}/${directory}/src/main/java/com/tinesoft/Application.java`
        )
      ).not.toThrow();

      const pomXml = readFile(`${projectDirectory}/${directory}/pom.xml`);
      expect(pomXml).toContain(`<groupId>${basePackage}</groupId>`);

      expect(pomXml).toContain(`<artifactId>${directory}</artifactId>`);

      // make sure the build wrapper file is executable (*nix only)
      if (!isWin) {
        const execPermission = '755';
        expect(
          lstatSync(`${projectDirectory}/${directory}/mvnw`).mode &
            octal(execPermission)
        ).toEqual(octal(execPermission));
      }
    },
    200000
  );

  it.each([
    ['JDK_8', '1.8'],
    ['JDK_11', '11'],
    ['JDK_17', '17'],
  ])(
    "should handle java version '%s'",
    async (javaVersion, expected) => {
      const directory = uniq('nx-micronaut-');
      const buildSystem = 'MAVEN';

      await runNxCommandAsync(
        `generate @nxrocks/nx-micronaut:new ${directory} --projectType default --buildSystem=${buildSystem} --javaVersion=${javaVersion} --no-interactive`,
        {
          cwd: projectDirectory,
        }
      );

      const pomXml = readFile(`${projectDirectory}/${directory}/pom.xml`);
      expect(pomXml).toContain(`<jdk.version>${expected}</jdk.version>`);
    },
    150000
  );

  describe('--buildSystem=GRADLE', () => {
    it('should create a gradle micronaut project', async () => {
      const directory = uniq('nx-micronaut-');

      await runNxCommandAsync(
        `generate @nxrocks/nx-micronaut:new ${directory} --projectType default --buildSystem GRADLE --no-interactive`,
        {
          cwd: projectDirectory,
        }
      );

      const resultBuild = await runNxCommandAsync(`build ${directory}`, {
        cwd: projectDirectory,
      });
      expect(resultBuild.stdout).toContain(
        `Executing command: ${isWin ? 'gradlew.bat' : './gradlew'} build`
      );

      expect(() =>
        checkFilesExist(
          `${projectDirectory}/${directory}/gradlew`,
          `${projectDirectory}/${directory}/build.gradle`,
          `${projectDirectory}/${directory}/README.md`
        )
      ).not.toThrow();

      // make sure the build wrapper file is executable (*nix only)
      if (!isWin) {
        const execPermission = '755';
        expect(
          lstatSync(`${projectDirectory}/${directory}/gradlew`).mode &
            octal(execPermission)
        ).toEqual(octal(execPermission));
      }
    }, 200000);
  });

  describe('--buildSystem=GRADLE_KOTLIN', () => {
    it('should create a gradle micronaut project with kotlin', async () => {
      const directory = uniq('nx-micronaut-');

      await runNxCommandAsync(
        `generate @nxrocks/nx-micronaut:new ${directory} --projectType default --buildSystem GRADLE_KOTLIN --no-interactive`,
        {
          cwd: projectDirectory,
        }
      );

      const resultBuild = await runNxCommandAsync(`build ${directory}`, {
        cwd: projectDirectory,
      });
      expect(resultBuild.stdout).toContain(
        `Executing command: ${isWin ? 'gradlew.bat' : './gradlew'} build`
      );

      expect(() =>
        checkFilesExist(
          `${projectDirectory}/${directory}/gradlew`,
          `${projectDirectory}/${directory}/build.gradle.kts`,
          `${projectDirectory}/${directory}/README.md`
        )
      ).not.toThrow();

      // make sure the build wrapper file is executable (*nix only)
      if (!isWin) {
        const execPermission = '755';
        expect(
          lstatSync(`${projectDirectory}/${directory}/gradlew`).mode &
            octal(execPermission)
        ).toEqual(octal(execPermission));
      }
    }, 200000);
  });

  describe('--directory', () => {
    it('should create src in the specified directory', async () => {
      const directory = uniq('nx-micronaut-');
      await runNxCommandAsync(
        `generate @nxrocks/nx-micronaut:new --directory subdir/${directory} --no-interactive`,
        {
          cwd: projectDirectory,
        }
      );
      expect(() =>
        checkFilesExist(
          `${projectDirectory}/subdir/${directory}/gradlew`,
          `${projectDirectory}/subdir/${directory}/build.gradle`,
          `${projectDirectory}/subdir/${directory}/README.md`
        )
      ).not.toThrow();
    }, 120000);
  });

  describe('--tags', () => {
    it('should add tags to the project', async () => {
      const directory = uniq('nx-micronaut-');
      await runNxCommandAsync(
        `generate @nxrocks/nx-micronaut:new ${directory} --tags e2etag,e2ePackage --no-interactive`,
        {
          cwd: projectDirectory,
        }
      );
      const project = readJson(`${projectDirectory}/${directory}/project.json`);
      expect(project.tags).toEqual(['e2etag', 'e2ePackage']);
    }, 120000);
  });
});
