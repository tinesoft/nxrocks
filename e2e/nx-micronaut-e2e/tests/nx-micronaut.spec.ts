import {
  checkFilesExist,
  readFile,
  readJson,
  runNxCommandAsync,
  tmpProjPath,
  uniq,
} from '@nrwl/nx-plugin/testing';
import { ensureNxProjectWithDeps, octal } from '@nxrocks/common/testing';

import { lstatSync } from 'fs';

describe('nx-micronaut e2e', () => {
  const isWin = process.platform === "win32";

  // Setting up individual workspaces per
  // test can cause e2e runs to take a long time.
  // For this reason, we recommend each suite only
  // consumes 1 workspace. The tests should each operate
  // on a unique project in the workspace, such that they
  // are not dependant on one another.
  beforeAll(() => {
    ensureNxProjectWithDeps('@nxrocks/nx-micronaut', 'dist/packages/nx-micronaut',
    [{ depPkgName: '@nxrocks/common', depDistPath: 'dist/packages/common' }]);
  });

  afterAll(() => {
    // `nx reset` kills the daemon, and performs
    // some work which can help clean up e2e leftovers
    runNxCommandAsync('reset');
  });

  it('should create nx-micronaut with default options', async() => {
    const prjName = uniq('nx-micronaut');
    await runNxCommandAsync(
      `generate @nxrocks/nx-micronaut:new ${prjName}`
    );

    const resultClean= await runNxCommandAsync(`clean ${prjName}`);
    expect(resultClean.stdout).toContain(`Executing command: ${isWin ? 'mvnw.bat' : './mvnw'} clean`)

    expect(() =>
      checkFilesExist(`apps/${prjName}/mvnw`,`apps/${prjName}/pom.xml`, `apps/${prjName}/README.md`)
    ).not.toThrow();

    // make sure the build wrapper file is executable (*nix only)
    if(!isWin) {
      const execPermission = '755';
      expect(
        lstatSync(
          tmpProjPath(`apps/${prjName}/mvnw`)
        ).mode & octal(execPermission)
      ).toEqual(octal(execPermission));
    }

  }, 200000);

  it('should create nx-micronaut with given options', async() => {
    const prjName = uniq('nx-micronaut');
    const buildSystem = 'MAVEN';
    const basePackage = 'com.tinesoft';
    const features="graphql";

    await runNxCommandAsync(
      `generate @nxrocks/nx-micronaut:new ${prjName} --projectType default --buildSystem=${buildSystem} --basePackage=${basePackage} --features=${features}`
    );

    const resultClean= await runNxCommandAsync(`clean ${prjName}`);
    expect(resultClean.stdout).toContain(`Executing command: ${isWin ? 'mvnw.bat' : './mvnw'} clean`)

    expect(() =>
      checkFilesExist(
        `apps/${prjName}/mvnw`,
        `apps/${prjName}/pom.xml`, 
        `apps/${prjName}/README.md`,
        `apps/${prjName}/src/main/java/com/tinesoft/${prjName.split('-')[0]}/Application.java`)
    ).not.toThrow();

    const pomXml = readFile(`apps/${prjName}/pom.xml`);
    expect(pomXml).toContain(`<groupId>${basePackage}.${prjName.split('-')[0]}</groupId>`);
    expect(pomXml).toContain(`<artifactId>${prjName.split('-')[1]}</artifactId>`);

    // make sure the build wrapper file is executable (*nix only)
    if(!isWin) {
      const execPermission = '755';
      expect(
        lstatSync(
          tmpProjPath(`apps/${prjName}/mvnw`)
        ).mode & octal(execPermission)
      ).toEqual(octal(execPermission));
    }

  }, 200000);

  describe('--buildSystem=GRADLE', () => {
    it('should create a gradle micronaut project', async() => {
      const prjName = uniq('nx-micronaut');

      await runNxCommandAsync(
        `generate @nxrocks/nx-micronaut:new ${prjName} --projectType default --buildSystem GRADLE`
      );

      const resultClean= await runNxCommandAsync(`clean ${prjName}`);
      expect(resultClean.stdout).toContain(`Executing command: ${isWin ? 'gradlew.bat' : './gradlew'} clean`)
  
      expect(() =>
      checkFilesExist(`apps/${prjName}/gradlew`,`apps/${prjName}/build.gradle`, `apps/${prjName}/README.md`)
      ).not.toThrow();

      // make sure the build wrapper file is executable (*nix only)
      if(!isWin) {
        const execPermission = '755';
        expect(
          lstatSync(
            tmpProjPath(`apps/${prjName}/gradlew`)
          ).mode & octal(execPermission)
        ).toEqual(octal(execPermission));
      }

    }, 200000);
  });

  describe('--buildSystem=GRADLE_KOTLIN', () => {
    it('should create a gradle micronaut project with kotlin', async() => {
      const prjName = uniq('nx-micronaut');

      await runNxCommandAsync(
        `generate @nxrocks/nx-micronaut:new ${prjName} --projectType default --buildSystem GRADLE_KOTLIN`
      );

      const resultClean= await runNxCommandAsync(`clean ${prjName}`);
      expect(resultClean.stdout).toContain(`Executing command: ${isWin ? 'gradlew.bat' : './gradlew'} clean`)
  
      expect(() =>
      checkFilesExist(`apps/${prjName}/gradlew`,`apps/${prjName}/build.gradle.kts`, `apps/${prjName}/README.md`)
      ).not.toThrow();

      // make sure the build wrapper file is executable (*nix only)
      if(!isWin) {
        const execPermission = '755';
        expect(
          lstatSync(
            tmpProjPath(`apps/${prjName}/gradlew`)
          ).mode & octal(execPermission)
        ).toEqual(octal(execPermission));
      }

    }, 200000);
  });
  

  describe('--directory', () => {
    it('should create src in the specified directory', async () => {
      const prjName = uniq('nx-micronaut');
      await runNxCommandAsync(
        `generate @nxrocks/nx-micronaut:new ${prjName} --directory subdir`
      );
      expect(() =>
      checkFilesExist(`apps/subdir/${prjName}/mvnw`,`apps/subdir/${prjName}/pom.xml`, `apps/subdir/${prjName}/README.md`)
      ).not.toThrow();
    }, 120000);
  });

  describe('--tags', () => {
    it('should add tags to the project', async () => {
      const prjName = uniq('nx-micronaut');
      await runNxCommandAsync(
        `generate @nxrocks/nx-micronaut:new ${prjName} --tags e2etag,e2ePackage`
      );
      const project = readJson(`apps/${prjName}/project.json`);
      expect(project.tags).toEqual(['e2etag', 'e2ePackage']);
    }, 120000);
  });
});
