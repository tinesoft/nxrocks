import { getPackageManagerCommand } from '@nx/devkit';
import { uniq } from '@nx/plugin/testing';
import {
  createTestProject,
  checkFilesExist,
  isWin,
  tmpProjPath,
  runNxCommandAsync,
  readFile,
  readJson,
  octal,
} from '@nxrocks/common-jvm/testing';
import { execSync } from 'child_process';

import { lstatSync, rmSync } from 'fs';

describe('nx-quarkus e2e', () => {
  let projectDirectory: string;

  beforeAll(() => {
    // Cleanup the test project
    projectDirectory &&
      rmSync(projectDirectory, {
        recursive: true,
        force: true,
      });

    projectDirectory = createTestProject();

    // The plugin has been built and published to a local registry in the jest globalSetup
    // Install the plugin built with the latest source code into the test repo
    execSync(
      `${getPackageManagerCommand().addDev} @nxrocks/nx-quarkus@0.0.0-e2e`,
      {
        cwd: projectDirectory,
        stdio: 'inherit',
        env: process.env,
      }
    );
  });

  it('should be installed', () => {
    // npm ls will fail if the package is not installed properly
    execSync(`${getPackageManagerCommand().list} @nxrocks/nx-quarkus`, {
      cwd: projectDirectory,
      stdio: 'inherit',
    });
  });

  it('should create nx-quarkus with default options', async () => {
    const directory = uniq('nx-quarkus-');
    await runNxCommandAsync(
      `generate @nxrocks/nx-quarkus:new ${directory} --no-interactive`
    );

    const resultBuild = await runNxCommandAsync(
      `build ${directory} --no-interactive`
    );
    expect(resultBuild.stdout).toContain(
      `Executing command: ${isWin ? 'mvnw.cmd' : './mvnw'} package`
    );

    expect(() =>
      checkFilesExist(
        `${directory}/mvnw`,
        `${directory}/pom.xml`,
        `${directory}/README.md`
      )
    ).not.toThrow();

    // make sure the build wrapper file is executable (*nix only)
    if (!isWin) {
      const execPermission = '755';
      expect(
        lstatSync(tmpProjPath(`${directory}/mvnw`)).mode & octal(execPermission)
      ).toEqual(octal(execPermission));
    }
  }, 200000);

  it.each`
    projectType
    ${'application'}
    ${'library'}
  `(
    `should create a quarkus '$projectType' with given options`,
    async ({ projectType }) => {
      const directory = uniq('nx-quarkus-');
      const buildSystem = 'MAVEN';
      const groupId = 'com.tinesoft';
      const artifactId = 'api';
      //const version = '1.2.3'; https://github.com/nrwl/nx/issues/10786
      const extensions = 'resteasy';
      const javaVersion = '21';

      await runNxCommandAsync(
        `generate @nxrocks/nx-quarkus:new ${directory} --projectType ${projectType} --buildSystem=${buildSystem} --groupId=${groupId} --artifactId=${artifactId} --extensions=${extensions} --javaVersion ${javaVersion} --no-interactive`
      );

      const resultBuild = await runNxCommandAsync(`build ${directory}`);
      expect(resultBuild.stdout).toContain(
        `Executing command: ${isWin ? 'mvnw.cmd' : './mvnw'} package`
      );

      expect(() =>
        checkFilesExist(
          `${directory}/mvnw`,
          `${directory}/pom.xml`,
          `${directory}/README.md`,
          `${directory}/src/main/java/com/tinesoft/GreetingResource.java`
        )
      ).not.toThrow();

      const pomXml = readFile(`${directory}/pom.xml`);
      expect(pomXml).toContain(`<groupId>${groupId}</groupId>`);
      expect(pomXml).toContain(`<artifactId>${artifactId}</artifactId>`);
      //expect(pomXml).toContain(`<version>${version}</version>`);
      expect(pomXml).toContain(
        `<maven.compiler.release>21</maven.compiler.release>`
      );

      // make sure the build wrapper file is executable (*nix only)
      if (!isWin) {
        const execPermission = '755';
        expect(
          lstatSync(tmpProjPath(`${directory}/mvnw`)).mode &
            octal(execPermission)
        ).toEqual(octal(execPermission));
      }
    },
    200000
  );

  describe('--buildSystem=GRADLE', () => {
    it.each`
      projectType
      ${'application'}
      ${'library'}
    `(
      `should create a gradle quarkus '$projectType'`,
      async ({ projectType }) => {
        const directory = uniq('nx-quarkus-');

        await runNxCommandAsync(
          `generate @nxrocks/nx-quarkus:new ${directory} --projectType ${projectType} --buildSystem GRADLE --no-interactive`
        );

        const resultBuild = await runNxCommandAsync(`build ${directory}`);
        expect(resultBuild.stdout).toContain(
          `Executing command: ${isWin ? 'gradlew.bat' : './gradlew'} build`
        );

        expect(() =>
          checkFilesExist(
            `${directory}/gradlew`,
            `${directory}/build.gradle`,
            `${directory}/README.md`
          )
        ).not.toThrow();

        // make sure the build wrapper file is executable (*nix only)
        if (!isWin) {
          const execPermission = '755';
          expect(
            lstatSync(tmpProjPath(`${directory}/gradlew`)).mode &
              octal(execPermission)
          ).toEqual(octal(execPermission));
        }
      },
      200000
    );
  });

  describe('--buildSystem=GRADLE_KOTLIN_DSL', () => {
    it.each`
      projectType
      ${'application'}
      ${'library'}
    `(
      `should create a gradle quarkus '$projectType' with kotlin`,
      async ({ projectType }) => {
        const directory = uniq('nx-quarkus-');

        await runNxCommandAsync(
          `generate @nxrocks/nx-quarkus:new ${directory} --projectType ${projectType} --buildSystem GRADLE_KOTLIN_DSL --no-interactive`
        );

        const resultBuild = await runNxCommandAsync(`build ${directory}`);
        expect(resultBuild.stdout).toContain(
          `Executing command: ${isWin ? 'gradlew.bat' : './gradlew'} build`
        );

        expect(() =>
          checkFilesExist(
            `${directory}/gradlew`,
            `${directory}/build.gradle.kts`,
            `${directory}/README.md`
          )
        ).not.toThrow();

        // make sure the build wrapper file is executable (*nix only)
        if (!isWin) {
          const execPermission = '755';
          expect(
            lstatSync(tmpProjPath(`${directory}/gradlew`)).mode &
              octal(execPermission)
          ).toEqual(octal(execPermission));
        }
      },
      200000
    );
  });

  describe('--directory', () => {
    it.each`
      projectType
      ${'application'}
      ${'library'}
    `(
      `should create src in the specified directory when generating a '$projectType'`,
      async ({ projectType }) => {
        const directory = uniq('nx-quarkus-');

        await runNxCommandAsync(
          `generate @nxrocks/nx-quarkus:new --directory subdir/${directory} --projectType ${projectType} --no-interactive`
        );
        expect(() =>
          checkFilesExist(
            `subdir/${directory}/mvnw`,
            `subdir/${directory}/pom.xml`,
            `subdir/${directory}/README.md`
          )
        ).not.toThrow();
      },
      200000
    );
  });

  describe('--tags', () => {
    it.each`
      projectType
      ${'application'}
      ${'library'}
    `(
      `should add tags to nx.json when generating a '$projectType'`,
      async ({ projectType }) => {
        const directory = uniq('nx-quarkus-');

        await runNxCommandAsync(
          `generate @nxrocks/nx-quarkus:new ${directory} --projectType ${projectType} --tags e2etag,e2ePackage --no-interactive`
        );
        const project = readJson(`${directory}/project.json`);
        expect(project.tags).toEqual(['e2etag', 'e2ePackage']);
      },
      200000
    );
  });
});
