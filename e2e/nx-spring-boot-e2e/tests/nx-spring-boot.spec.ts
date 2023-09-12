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
    projectDirectory = createTestProject('pnpm dlx create-nx-workspace');

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
        `apps/${prjName}/mvnw`,
        `apps/${prjName}/pom.xml`,
        `apps/${prjName}/HELP.md`
      )
    ).not.toThrow();

    // make sure the build wrapper file is executable (*nix only)
    if (!isWin) {
      const execPermission = '755';
      expect(
        lstatSync(tmpProjPath(`apps/${prjName}/mvnw`)).mode &
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
      const prjDir = projectType === 'application' ? 'apps' : 'libs';

      await runNxCommandAsync(
        `generate @nxrocks/nx-spring-boot:new ${prjName} --projectType ${projectType} --buildSystem=${buildSystem} --packageName=${packageName} --groupId=${groupId} --artifactId=${artifactId} --description="${description}" --javaVersion=${javaVersion} --no-interactive`
      );

      const resultBuild = await runNxCommandAsync(`build ${prjName}`);
      expect(resultBuild.stdout).toContain(
        `Executing command: ${isWin ? 'mvnw.cmd' : './mvnw'} package`
      );

      expect(() =>
        checkFilesExist(
          `${prjDir}/${prjName}/mvnw`,
          `${prjDir}/${prjName}/pom.xml`,
          `${prjDir}/${prjName}/HELP.md`,
          `${prjDir}/${prjName}/src/main/java/com/tinesoft/api/${
            names(prjName).className
          }Application.java`
        )
      ).not.toThrow();

      const pomXml = readFile(`${prjDir}/${prjName}/pom.xml`);
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
          lstatSync(tmpProjPath(`${prjDir}/${prjName}/mvnw`)).mode &
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
        const prjDir = projectType === 'application' ? 'apps' : 'libs';

        await runNxCommandAsync(
          `generate @nxrocks/nx-spring-boot:new ${prjName} --projectType ${projectType} --buildSystem gradle-project --no-interactive`
        );

        const resultBuild = await runNxCommandAsync(`build ${prjName}`);
        expect(resultBuild.stdout).toContain(
          `Executing command: ${isWin ? 'gradlew.bat' : './gradlew'} build`
        );

        expect(() =>
          checkFilesExist(
            `${prjDir}/${prjName}/gradlew`,
            `${prjDir}/${prjName}/build.gradle`,
            `${prjDir}/${prjName}/HELP.md`
          )
        ).not.toThrow();

        // make sure the build wrapper file is executable (*nix only)
        if (!isWin) {
          const execPermission = '755';
          expect(
            lstatSync(tmpProjPath(`${prjDir}/${prjName}/gradlew`)).mode &
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
        const prjDir = projectType === 'application' ? 'apps' : 'libs';

        await runNxCommandAsync(
          `generate @nxrocks/nx-spring-boot:new ${prjName} --projectType ${projectType} --buildSystem gradle-project-kotlin --no-interactive`
        );

        const resultBuild = await runNxCommandAsync(`build ${prjName}`);
        expect(resultBuild.stdout).toContain(
          `Executing command: ${isWin ? 'gradlew.bat' : './gradlew'} build`
        );

        expect(() =>
          checkFilesExist(
            `${prjDir}/${prjName}/gradlew`,
            `${prjDir}/${prjName}/build.gradle.kts`,
            `${prjDir}/${prjName}/HELP.md`
          )
        ).not.toThrow();

        // make sure the build wrapper file is executable (*nix only)
        if (!isWin) {
          const execPermission = '755';
          expect(
            lstatSync(tmpProjPath(`${prjDir}/${prjName}/gradlew`)).mode &
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
        const prjDir = projectType === 'application' ? 'apps' : 'libs';

        await runNxCommandAsync(
          `generate @nxrocks/nx-spring-boot:new ${prjName} --projectType ${projectType} --buildSystem gradle-project --language kotlin --no-interactive`
        );

        const resultBuild = await runNxCommandAsync(`build ${prjName}`);
        expect(resultBuild.stdout).toContain(
          `Executing command: ${isWin ? 'gradlew.bat' : './gradlew'} build`
        );

        expect(() =>
          checkFilesExist(
            `${prjDir}/${prjName}/gradlew`,
            `${prjDir}/${prjName}/build.gradle`,
            `${prjDir}/${prjName}/HELP.md`
          )
        ).not.toThrow();

        // make sure the build wrapper file is executable (*nix only)
        if (!isWin) {
          const execPermission = '755';
          expect(
            lstatSync(tmpProjPath(`${prjDir}/${prjName}/gradlew`)).mode &
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
        const prjDir = projectType === 'application' ? 'apps' : 'libs';

        await runNxCommandAsync(
          `generate @nxrocks/nx-spring-boot:new ${prjName} --projectType ${projectType} --directory subdir  --no-interactive`
        );
        expect(() =>
          checkFilesExist(
            `${prjDir}/subdir/${prjName}/mvnw`,
            `${prjDir}/subdir/${prjName}/pom.xml`,
            `${prjDir}/subdir/${prjName}/HELP.md`
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
        const prjDir = projectType === 'application' ? 'apps' : 'libs';

        await runNxCommandAsync(
          `generate @nxrocks/nx-spring-boot:new ${prjName} --projectType ${projectType} --tags e2etag,e2ePackage --no-interactive`
        );
        const project = readJson(`${prjDir}/${prjName}/project.json`);
        expect(project.tags).toEqual(['e2etag', 'e2ePackage']);
      },
      200000
    );
  });
});
