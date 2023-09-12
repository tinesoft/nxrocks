import {
  uniq,
} from '@nx/plugin/testing';
import {
  createTestProject, checkFilesExist, tmpProjPath, runNxCommandAsync, readFile,
  readJson, octal, isWin
} from '@nxrocks/common/testing';
import { execSync } from 'child_process';
import { lstatSync, rmSync } from 'fs';

describe('nx-micronaut e2e', () => {

  let projectDirectory: string;

  beforeAll(() => {
    projectDirectory = createTestProject('pnpm dlx create-nx-workspace');

    // The plugin has been built and published to a local registry in the jest globalSetup
    // Install the plugin built with the latest source code into the test repo
    execSync(`pnpm install @nxrocks/nx-micronaut@0.0.0-e2e`, {
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
    execSync('npm ls @nxrocks/nx-micronaut', {
      cwd: projectDirectory,
      stdio: 'inherit',
    });
  });

  xit('should create nx-micronaut with default options', async () => {
    const prjName = uniq('nx-micronaut');
    runNxCommandAsync(`generate @nxrocks/nx-micronaut:new ${prjName} --no-interactive`);

    const resultBuild = await runNxCommandAsync(`build ${prjName}`);
    expect(resultBuild.stdout).toContain(
      `Executing command: ${isWin ? 'gradlew.bat' : './gradlew'} build`
    );

    expect(() =>
      checkFilesExist(
        `apps/${prjName}/gradlew`,
        `apps/${prjName}/build.gradle`,
        `apps/${prjName}/README.md`
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
  }, 200000);

  it.each(['graphql', '', ' '])(
    "should create nx-micronaut with given options (features='%s')",
    async (features: string) => {
      const prjName = uniq('nx-micronaut');
      const buildSystem = 'MAVEN';
      const basePackage = 'com.tinesoft';

      await runNxCommandAsync(
        `generate @nxrocks/nx-micronaut:new ${prjName} --projectType default --buildSystem=${buildSystem} --basePackage=${basePackage} --features=${features} --no-interactive`
      );

      const resultBuild = await runNxCommandAsync(`build ${prjName}`);
      expect(resultBuild.stdout).toContain(
        `Executing command: ${isWin ? 'mvnw.bat' : './mvnw'} package`
      );

      expect(() =>
        checkFilesExist(
          `apps/${prjName}/mvnw`,
          `apps/${prjName}/pom.xml`,
          `apps/${prjName}/README.md`,
          `apps/${prjName}/src/main/java/com/tinesoft/Application.java`
        )
      ).not.toThrow();

      const pomXml = readFile(`apps/${prjName}/pom.xml`);
      expect(pomXml).toContain(`<groupId>${basePackage}</groupId>`);

      expect(pomXml).toContain(`<artifactId>${prjName}</artifactId>`);

      // make sure the build wrapper file is executable (*nix only)
      if (!isWin) {
        const execPermission = '755';
        expect(
          lstatSync(tmpProjPath(`apps/${prjName}/mvnw`)).mode &
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
      const prjName = uniq('nx-micronaut');
      const buildSystem = 'MAVEN';

      await runNxCommandAsync(
        `generate @nxrocks/nx-micronaut:new ${prjName} --projectType default --buildSystem=${buildSystem} --javaVersion=${javaVersion} --no-interactive`
      );

      const pomXml = readFile(`apps/${prjName}/pom.xml`);
      expect(pomXml).toContain(`<jdk.version>${expected}</jdk.version>`);
    },
    150000
  );

  describe('--buildSystem=GRADLE', () => {
    xit('should create a gradle micronaut project', async () => {
      const prjName = uniq('nx-micronaut');

      await runNxCommandAsync(
        `generate @nxrocks/nx-micronaut:new ${prjName} --projectType default --buildSystem GRADLE --no-interactive`
      );

      const resultBuild = await runNxCommandAsync(`build ${prjName}`);
      expect(resultBuild.stdout).toContain(
        `Executing command: ${isWin ? 'gradlew.bat' : './gradlew'} build`
      );

      expect(() =>
        checkFilesExist(
          `apps/${prjName}/gradlew`,
          `apps/${prjName}/build.gradle`,
          `apps/${prjName}/README.md`
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
    }, 200000);
  });

  describe('--buildSystem=GRADLE_KOTLIN', () => {
    xit('should create a gradle micronaut project with kotlin', async () => {
      const prjName = uniq('nx-micronaut');

      await runNxCommandAsync(
        `generate @nxrocks/nx-micronaut:new ${prjName} --projectType default --buildSystem GRADLE_KOTLIN --no-interactive`
      );

      const resultBuild = await runNxCommandAsync(`build ${prjName}`);
      expect(resultBuild.stdout).toContain(
        `Executing command: ${isWin ? 'gradlew.bat' : './gradlew'} build`
      );

      expect(() =>
        checkFilesExist(
          `apps/${prjName}/gradlew`,
          `apps/${prjName}/build.gradle.kts`,
          `apps/${prjName}/README.md`
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
    }, 200000);
  });

  describe('--directory', () => {
    it('should create src in the specified directory', async () => {
      const prjName = uniq('nx-micronaut');
      await runNxCommandAsync(
        `generate @nxrocks/nx-micronaut:new ${prjName} --directory subdir --no-interactive`
      );
      expect(() =>
        checkFilesExist(
          `apps/subdir/${prjName}/gradlew`,
          `apps/subdir/${prjName}/build.gradle`,
          `apps/subdir/${prjName}/README.md`
        )
      ).not.toThrow();
    }, 120000);
  });

  describe('--tags', () => {
    it('should add tags to the project', async () => {
      const prjName = uniq('nx-micronaut');
      await runNxCommandAsync(
        `generate @nxrocks/nx-micronaut:new ${prjName} --tags e2etag,e2ePackage --no-interactive`
      );
      const project = readJson(`apps/${prjName}/project.json`);
      expect(project.tags).toEqual(['e2etag', 'e2ePackage']);
    }, 120000);
  });
});
