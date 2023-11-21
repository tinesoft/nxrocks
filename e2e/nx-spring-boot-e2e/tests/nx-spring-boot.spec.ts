import {
  uniq,
} from '@nx/plugin/testing';
import { checkFilesExist, createTestProject, isWin, octal, readFile, readJson, runNxCommandAsync, tmpProjPath } from '@nxrocks/common/testing';
import { names } from '@nx/devkit';

import { lstatSync, rmSync } from 'fs';
import { execSync } from 'child_process';

describe('nx-spring-boot e2e', () => {
  let projectDirectory: string;

  beforeAll(() => {
    projectDirectory = createTestProject('pnpm');

    // The plugin has been built and published to a local registry in the jest globalSetup
    // Install the plugin built with the latest source code into the test repo
    execSync(`pnpm install @nxrocks/nx-spring-boot@0.0.0-e2e`, {
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
    execSync('npm ls @nxrocks/nx-spring-boot', {
      cwd: projectDirectory,
      stdio: 'inherit',
    });
  });

  it('should create nx-spring-boot with default options', async () => {
    const prjName = uniq('nx-spring-boot');
    await runNxCommandAsync(`generate @nxrocks/nx-spring-boot:new ${prjName} --no-interactive`);

    const resultBuild = await runNxCommandAsync(`build ${prjName}`);
    expect(resultBuild.stdout).toContain(
      `Executing command: ${isWin ? 'mvnw.cmd' : './mvnw'} package`
    );

    expect(() =>
      checkFilesExist(
        `${prjName}/mvnw`,
        `${prjName}/pom.xml`,
        `${prjName}/HELP.md`
      )
    ).not.toThrow();

    // make sure the build wrapper file is executable (*nix only)
    if (!isWin) {
      const execPermission = '755';
      expect(
        lstatSync(tmpProjPath(`${prjName}/mvnw`)).mode &
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
      const prjName = uniq('nx-spring-boot');
      const buildSystem = 'maven-project';
      const javaVersion = '17';
      const packageName = 'com.tinesoft.api';
      const groupId = 'com.tinesoft';
      const artifactId = 'api';
      const description = 'My sample app';
      //const version = '1.2.3'; https://github.com/nrwl/nx/issues/10786

      await runNxCommandAsync(
        `generate @nxrocks/nx-spring-boot:new ${prjName} --projectType ${projectType} --buildSystem=${buildSystem} --packageName=${packageName} --groupId=${groupId} --artifactId=${artifactId} --description="${description}" --javaVersion=${javaVersion} --no-interactive`
      );

      const resultBuild = await runNxCommandAsync(`build ${prjName}`);
      expect(resultBuild.stdout).toContain(
        `Executing command: ${isWin ? 'mvnw.cmd' : './mvnw'} package`
      );

      expect(() =>
        checkFilesExist(
          `${prjName}/mvnw`,
          `${prjName}/pom.xml`,
          `${prjName}/HELP.md`,
        )
      ).not.toThrow();

      if (projectType === 'application') {
        expect(() =>
          checkFilesExist(
            `${prjName}/src/main/java/com/tinesoft/api/${names(prjName).className
            }Application.java`,
            `${prjName}/src/test/java/com/tinesoft/api/${names(prjName).className
            }ApplicationTests.java`
          )
        ).not.toThrow();
      }
      else {
        expect(() =>
        checkFilesExist(
          `${prjName}/src/main/java/com/tinesoft/api/${names(prjName).className
          }Application.java`,
          `${prjName}/src/test/java/com/tinesoft/api/${names(prjName).className
          }ApplicationTests.java`
        )
      ).toThrow();
      
        expect(() =>
          checkFilesExist(
            `${prjName}/src/main/java/com/tinesoft/api/service/MyService.java`,
            `${prjName}/src/main/java/com/tinesoft/api/service/ServiceProperties.java`,
            `${prjName}/src/test/java/com/tinesoft/api/service/MyServiceTest.java`,
          )
        ).not.toThrow();
      }

      const pomXml = readFile(`${prjName}/pom.xml`);
      expect(pomXml).toContain(`<groupId>${groupId}</groupId>`);
      expect(pomXml).toContain(`<artifactId>${artifactId}</artifactId>`);
      expect(pomXml).toContain(`<name>${prjName}</name>`);
      expect(pomXml).toContain(`<description>${description}</description>`);
      //expect(pomXml).toContain(`<version>${version}</version>`);
      expect(pomXml).toContain(`<java.version>${javaVersion}</java.version>`);

      // make sure the build wrapper file is executable (*nix only)
      if (!isWin) {
        const execPermission = '755';
        expect(
          lstatSync(tmpProjPath(`${prjName}/mvnw`)).mode &
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
        const prjName = uniq('nx-spring-boot');

        await runNxCommandAsync(
          `generate @nxrocks/nx-spring-boot:new ${prjName} --projectType ${projectType} --buildSystem gradle-project --no-interactive`
        );

        const resultBuild = await runNxCommandAsync(`build ${prjName}`);
        expect(resultBuild.stdout).toContain(
          `Executing command: ${isWin ? 'gradlew.bat' : './gradlew'} build`
        );

        expect(() =>
          checkFilesExist(
            `${prjName}/gradlew`,
            `${prjName}/build.gradle`,
            `${prjName}/HELP.md`
          )
        ).not.toThrow();

        // make sure the build wrapper file is executable (*nix only)
        if (!isWin) {
          const execPermission = '755';
          expect(
            lstatSync(tmpProjPath(`${prjName}/gradlew`)).mode &
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
        const prjName = uniq('nx-spring-boot');

        await runNxCommandAsync(
          `generate @nxrocks/nx-spring-boot:new ${prjName} --projectType ${projectType} --buildSystem gradle-project-kotlin --no-interactive`
        );

        const resultBuild = await runNxCommandAsync(`build ${prjName}`);
        expect(resultBuild.stdout).toContain(
          `Executing command: ${isWin ? 'gradlew.bat' : './gradlew'} build`
        );

        expect(() =>
          checkFilesExist(
            `${prjName}/gradlew`,
            `${prjName}/build.gradle.kts`,
            `${prjName}/HELP.md`
          )
        ).not.toThrow();

        // make sure the build wrapper file is executable (*nix only)
        if (!isWin) {
          const execPermission = '755';
          expect(
            lstatSync(tmpProjPath(`${prjName}/gradlew`)).mode &
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
        const prjName = uniq('nx-spring-boot');

        await runNxCommandAsync(
          `generate @nxrocks/nx-spring-boot:new ${prjName} --projectType ${projectType} --buildSystem gradle-project --language kotlin --no-interactive`
        );

        const resultBuild = await runNxCommandAsync(`build ${prjName}`);
        expect(resultBuild.stdout).toContain(
          `Executing command: ${isWin ? 'gradlew.bat' : './gradlew'} build`
        );

        expect(() =>
          checkFilesExist(
            `${prjName}/gradlew`,
            `${prjName}/build.gradle`,
            `${prjName}/HELP.md`
          )
        ).not.toThrow();

        // make sure the build wrapper file is executable (*nix only)
        if (!isWin) {
          const execPermission = '755';
          expect(
            lstatSync(tmpProjPath(`${prjName}/gradlew`)).mode &
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
        const prjName = uniq('nx-spring-boot');

        await runNxCommandAsync(
          `generate @nxrocks/nx-spring-boot:new ${prjName} --projectType ${projectType} --directory subdir  --no-interactive`
        );
        expect(() =>
          checkFilesExist(
            `subdir/${prjName}/mvnw`,
            `subdir/${prjName}/pom.xml`,
            `subdir/${prjName}/HELP.md`
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
        const prjName = uniq('nx-spring-boot');

        await runNxCommandAsync(
          `generate @nxrocks/nx-spring-boot:new ${prjName} --projectType ${projectType} --tags e2etag,e2ePackage --no-interactive`
        );
        const project = readJson(`${prjName}/project.json`);
        expect(project.tags).toEqual(['e2etag', 'e2ePackage']);
      },
      200000
    );
  });
});
