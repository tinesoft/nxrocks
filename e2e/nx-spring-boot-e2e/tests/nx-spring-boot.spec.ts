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

import { lstatSync, rmSync } from 'fs';
import { execSync } from 'child_process';

describe('nx-spring-boot e2e', () => {
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
    projectDirectory = createTestProject('test-project-spring-boot');

    // The plugin has been built and published to a local registry in the jest globalSetup
    // Install the plugin built with the latest source code into the test repo
    execSync(
      `${getPackageManagerCommand().addDev} @nxrocks/nx-spring-boot@0.0.0-e2e`,
      {
        cwd: projectDirectory,
        stdio: 'inherit',
        env: process.env,
      }
    );
  });

  it('should be installed', () => {
    // npm ls will fail if the package is not installed properly
    execSync(`${getPackageManagerCommand().list} @nxrocks/nx-spring-boot`, {
      cwd: projectDirectory,
      stdio: 'inherit',
    });
  });

  it('should create nx-spring-boot with default options', async () => {
    const directory = uniq('nx-spring-boot-');
    await runNxCommandAsync(
      `generate @nxrocks/nx-spring-boot:new ${directory} --no-interactive`,
      {
        cwd: projectDirectory,
      }
    );

    const resultBuild = await runNxCommandAsync(`build ${directory}`, {
      cwd: projectDirectory,
    });
    expect(resultBuild.stdout).toContain(
      `Executing command: ${isWin ? 'mvnw.cmd' : './mvnw'} package`
    );

    expect(() =>
      checkFilesExist(
        `${projectDirectory}/${directory}/mvnw`,
        `${projectDirectory}/${directory}/pom.xml`,
        `${projectDirectory}/${directory}/HELP.md`
      )
    ).not.toThrow();

    // make sure the build wrapper file is executable (*nix only)
    if (!isWin) {
      const execPermission = '755';
      expect(
        lstatSync(`${projectDirectory}/${directory}/mvnw`).mode &
          octal(execPermission)
      ).toEqual(octal(execPermission));
    }
  }, 200000);

  it.each`
    projectType
    ${'application'}
    ${'library'}
  `(
    `should create a spring-boot '$projectType' with given options`,
    async ({ projectType }) => {
      const directory = uniq('nx-spring-boot-');
      const buildSystem = 'maven-project';
      const javaVersion = '17';
      const packageName = 'com.tinesoft.api';
      const groupId = 'com.tinesoft';
      const artifactId = 'api';
      const description = 'My sample app';
      //const version = '1.2.3'; https://github.com/nrwl/nx/issues/10786

      await runNxCommandAsync(
        `generate @nxrocks/nx-spring-boot:new ${directory} --projectType ${projectType} --buildSystem=${buildSystem} --packageName=${packageName} --groupId=${groupId} --artifactId=${artifactId} --description="${description}" --javaVersion=${javaVersion} --no-interactive`,
        {
          cwd: projectDirectory,
        }
      );

      const resultBuild = await runNxCommandAsync(`build ${directory}`, {
        cwd: projectDirectory,
      });
      expect(resultBuild.stdout).toContain(
        `Executing command: ${isWin ? 'mvnw.cmd' : './mvnw'} package`
      );

      expect(() =>
        checkFilesExist(
          `${projectDirectory}/${directory}/mvnw`,
          `${projectDirectory}/${directory}/pom.xml`,
          `${projectDirectory}/${directory}/HELP.md`
        )
      ).not.toThrow();

      if (projectType === 'application') {
        expect(() =>
          checkFilesExist(
            `${projectDirectory}/${directory}/src/main/java/com/tinesoft/api/DemoApplication.java`,
            `${projectDirectory}/${directory}/src/test/java/com/tinesoft/api/DemoApplicationTests.java`
          )
        ).not.toThrow();
      } else {
        expect(() =>
          checkFilesExist(
            `${projectDirectory}/${directory}/src/main/java/com/tinesoft/api/DemoApplication.java`,
            `${projectDirectory}/${directory}/src/test/java/com/tinesoft/api/DemoApplicationTests.java`
          )
        ).toThrow();

        expect(() =>
          checkFilesExist(
            `${projectDirectory}/${directory}/src/main/java/com/tinesoft/api/service/MyService.java`,
            `${projectDirectory}/${directory}/src/main/java/com/tinesoft/api/service/ServiceProperties.java`,
            `${projectDirectory}/${directory}/src/test/java/com/tinesoft/api/service/MyServiceTest.java`
          )
        ).not.toThrow();
      }

      const pomXml = readFile(`${projectDirectory}/${directory}/pom.xml`);
      expect(pomXml).toContain(`<groupId>${groupId}</groupId>`);
      expect(pomXml).toContain(`<artifactId>${artifactId}</artifactId>`);
      expect(pomXml).toContain(`<name>demo</name>`);
      expect(pomXml).toContain(`<description>${description}</description>`);
      //expect(pomXml).toContain(`<version>${version}</version>`);
      expect(pomXml).toContain(`<java.version>${javaVersion}</java.version>`);

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

  describe('--buildSystem=gradle-project', () => {
    it.each`
      projectType
      ${'application'}
      ${'library'}
    `(
      `should create a gradle spring-boot '$projectType'`,
      async ({ projectType }) => {
        const directory = uniq('nx-spring-boot-');

        await runNxCommandAsync(
          `generate @nxrocks/nx-spring-boot:new ${directory} --projectType ${projectType} --buildSystem gradle-project --no-interactive`,
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
            `${projectDirectory}/${directory}/HELP.md`
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
      },
      200000
    );
  });

  describe('--buildSystem=gradle-project-kotlin', () => {
    it.each`
      projectType
      ${'application'}
      ${'library'}
    `(
      `should create a gradle spring-boot '$projectType'`,
      async ({ projectType }) => {
        const directory = uniq('nx-spring-boot-');

        await runNxCommandAsync(
          `generate @nxrocks/nx-spring-boot:new ${directory} --projectType ${projectType} --buildSystem gradle-project-kotlin --no-interactive`,
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
            `${projectDirectory}/${directory}/HELP.md`
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
      },
      200000
    );
  });

  describe('--buildSystem=gradle-project and --language=kotlin', () => {
    it.each`
      projectType
      ${'application'}
      ${'library'}
    `(
      `should create a gradle spring-boot '$projectType' with kotlin`,
      async ({ projectType }) => {
        const directory = uniq('nx-spring-boot-');

        await runNxCommandAsync(
          `generate @nxrocks/nx-spring-boot:new ${directory} --projectType ${projectType} --buildSystem gradle-project --language kotlin --no-interactive`,
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
            `${projectDirectory}/${directory}/HELP.md`
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
        const directory = uniq('nx-spring-boot-');

        await runNxCommandAsync(
          `generate @nxrocks/nx-spring-boot:new  --directory subdir/${directory} --projectType ${projectType}  --no-interactive`,
          {
            cwd: projectDirectory,
          }
        );
        expect(() =>
          checkFilesExist(
            `${projectDirectory}/subdir/${directory}/mvnw`,
            `${projectDirectory}/subdir/${directory}/pom.xml`,
            `${projectDirectory}/subdir/${directory}/HELP.md`
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
      `should add tags to nx.json' when generating a '$projectType'`,
      async ({ projectType }) => {
        const directory = uniq('nx-spring-boot-');

        await runNxCommandAsync(
          `generate @nxrocks/nx-spring-boot:new ${directory} --projectType ${projectType} --tags e2etag,e2ePackage --no-interactive`,
          {
            cwd: projectDirectory,
          }
        );
        const project = readJson(
          `${projectDirectory}/${directory}/project.json`
        );
        expect(project.tags).toEqual(['e2etag', 'e2ePackage']);
      },
      200000
    );
  });
});
