import {
  uniq,
} from '@nx/plugin/testing';
import {
  createTestProject, checkFilesExist, isWin, tmpProjPath, runNxCommandAsync, readFile,
  readJson, octal
} from '@nxrocks/common/testing';
import { execSync } from 'child_process';

import { lstatSync, rmSync } from 'fs';

describe('nx-quarkus e2e', () => {

  let projectDirectory: string;

  beforeAll(() => {
    projectDirectory = createTestProject();

    // The plugin has been built and published to a local registry in the jest globalSetup
    // Install the plugin built with the latest source code into the test repo
    execSync(`npm install @nxrocks/nx-quarkus@0.0.0-e2e`, {
      cwd: projectDirectory,
      stdio: 'inherit',
      env: process.env,
    });
  });

  afterAll(() => {
    // Cleanup the test project
    projectDirectory && rmSync(projectDirectory, {
      recursive: true,
      force: true,
    });
  });

  it('should be installed', () => {
    // npm ls will fail if the package is not installed properly
    execSync('npm ls @nxrocks/nx-quarkus', {
      cwd: projectDirectory,
      stdio: 'inherit',
    });
  });

  it('should create nx-quarkus with default options', async () => {
    const prjName = uniq('nx-quarkus');
    await runNxCommandAsync(`generate @nxrocks/nx-quarkus:new ${prjName} --no-interactive`);

    const resultBuild = await runNxCommandAsync(`build ${prjName} --no-interactive`);
    expect(resultBuild.stdout).toContain(
      `Executing command: ${isWin ? 'mvnw.cmd' : './mvnw'} package`
    );

    expect(() =>
      checkFilesExist(
        `${prjName}/mvnw`,
        `${prjName}/pom.xml`,
        `${prjName}/README.md`
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
    `should create a quarkus '$projectType' with given options`,
    async ({ projectType }) => {
      const prjName = uniq('nx-quarkus');
      const prjDir = projectType === 'application' ? 'apps' : 'libs';
      const buildSystem = 'MAVEN';
      const groupId = 'com.tinesoft';
      const artifactId = 'api';
      //const version = '1.2.3'; https://github.com/nrwl/nx/issues/10786
      const extensions = 'resteasy';

      await runNxCommandAsync(
        `generate @nxrocks/nx-quarkus:new ${prjName} --projectType ${projectType} --buildSystem=${buildSystem} --groupId=${groupId} --artifactId=${artifactId} --extensions=${extensions} --no-interactive`
      );

      const resultBuild = await runNxCommandAsync(`build ${prjName}`);
      expect(resultBuild.stdout).toContain(
        `Executing command: ${isWin ? 'mvnw.cmd' : './mvnw'} package`
      );

      expect(() =>
        checkFilesExist(
          `${prjName}/mvnw`,
          `${prjName}/pom.xml`,
          `${prjName}/README.md`,
          `${prjName}/src/main/java/com/tinesoft/GreetingResource.java`
        )
      ).not.toThrow();

      const pomXml = readFile(`${prjName}/pom.xml`);
      expect(pomXml).toContain(`<groupId>${groupId}</groupId>`);
      expect(pomXml).toContain(`<artifactId>${artifactId}</artifactId>`);
      //expect(pomXml).toContain(`<version>${version}</version>`);

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

  describe('--buildSystem=GRADLE', () => {
    it.each`
      projectType
      ${'application'}
      ${'library'}
    `(
      `should create a gradle quarkus '$projectType'`,
      async ({ projectType }) => {
        const prjName = uniq('nx-quarkus');

        await runNxCommandAsync(
          `generate @nxrocks/nx-quarkus:new ${prjName} --projectType ${projectType} --buildSystem GRADLE --no-interactive`
        );

        const resultBuild = await runNxCommandAsync(`build ${prjName}`);
        expect(resultBuild.stdout).toContain(
          `Executing command: ${isWin ? 'gradlew.bat' : './gradlew'} build`
        );

        expect(() =>
          checkFilesExist(
            `${prjName}/gradlew`,
            `${prjName}/build.gradle`,
            `${prjName}/README.md`
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

  describe('--buildSystem=GRADLE_KOTLIN_DSL', () => {
    it.each`
      projectType
      ${'application'}
      ${'library'}
    `(
      `should create a gradle quarkus '$projectType' with kotlin`,
      async ({ projectType }) => {
        const prjName = uniq('nx-quarkus');

        await runNxCommandAsync(
          `generate @nxrocks/nx-quarkus:new ${prjName} --projectType ${projectType} --buildSystem GRADLE_KOTLIN_DSL --no-interactive`
        );

        const resultBuild = await runNxCommandAsync(`build ${prjName}`);
        expect(resultBuild.stdout).toContain(
          `Executing command: ${isWin ? 'gradlew.bat' : './gradlew'} build`
        );

        expect(() =>
          checkFilesExist(
            `${prjName}/gradlew`,
            `${prjName}/build.gradle.kts`,
            `${prjName}/README.md`
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
        const prjName = uniq('nx-quarkus');

        await runNxCommandAsync(
          `generate @nxrocks/nx-quarkus:new ${prjName} --projectType ${projectType} --directory subdir --no-interactive`
        );
        expect(() =>
          checkFilesExist(
            `subdir/${prjName}/mvnw`,
            `subdir/${prjName}/pom.xml`,
            `subdir/${prjName}/README.md`
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
        const prjName = uniq('nx-quarkus');

        await runNxCommandAsync(
          `generate @nxrocks/nx-quarkus:new ${prjName} --projectType ${projectType} --tags e2etag,e2ePackage --no-interactive`
        );
        const project = readJson(`${prjName}/project.json`);
        expect(project.tags).toEqual(['e2etag', 'e2ePackage']);
      },
      200000
    );
  });
});
