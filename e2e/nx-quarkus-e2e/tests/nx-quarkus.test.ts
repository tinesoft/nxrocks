import {
  checkFilesExist,
  readFile,
  readJson,
  runNxCommandAsync,
  uniq,
  tmpProjPath
} from '@nrwl/nx-plugin/testing';
import { ensureNxProjectWithDeps, octal } from '@nxrocks/common/testing';

import { lstatSync } from 'fs';

describe('nx-quarkus e2e', () => {
  const isWin = process.platform === "win32";

  beforeAll(async () => {

    ensureNxProjectWithDeps('@nxrocks/nx-quarkus', 'dist/packages/nx-quarkus',
      [{ depPkgName: '@nxrocks/common', depDistPath: 'dist/packages/common' }]);
  }, 600000);
  
  it('should create nx-quarkus with default options', async() => {
    const prjName = uniq('nx-quarkus');
    await runNxCommandAsync(
      `generate @nxrocks/nx-quarkus:new ${prjName}`
    );

    const resultBuildInfo= await runNxCommandAsync(`clean ${prjName}`);
    expect(resultBuildInfo.stdout).toContain(`Executing command: ${isWin ? 'mvnw.cmd' : './mvnw'} clean`)

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

  it('should create nx-quarkus with given options', async() => {
    const prjName = uniq('nx-quarkus');
    const buildSystem = 'MAVEN';
    const groupId = 'com.tinesoft';
    const artifactId = 'api' ;
    //const version = '1.2.3'; https://github.com/nrwl/nx/issues/10786
    const extensions="resteasy";

    await runNxCommandAsync(
      `generate @nxrocks/nx-quarkus:new ${prjName} --projectType application --buildSystem=${buildSystem} --groupId=${groupId} --artifactId=${artifactId} --extensions=${extensions}`
    );

    const resultBuildInfo= await runNxCommandAsync(`clean ${prjName}`);
    expect(resultBuildInfo.stdout).toContain(`Executing command: ${isWin ? 'mvnw.cmd' : './mvnw'} clean`)

    expect(() =>
      checkFilesExist(
        `apps/${prjName}/mvnw`,
        `apps/${prjName}/pom.xml`, 
        `apps/${prjName}/README.md`,
        `apps/${prjName}/src/main/java/com/tinesoft/GreetingResource.java`)
    ).not.toThrow();

    const pomXml = readFile(`apps/${prjName}/pom.xml`);
    expect(pomXml).toContain(`<groupId>${groupId}</groupId>`);
    expect(pomXml).toContain(`<artifactId>${artifactId}</artifactId>`);
    //expect(pomXml).toContain(`<version>${version}</version>`);

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
    it('should create a gradle quarkus project', async() => {
      const prjName = uniq('nx-quarkus');

      await runNxCommandAsync(
        `generate @nxrocks/nx-quarkus:new ${prjName} --projectType application --buildSystem GRADLE`
      );

      const resultBuildInfo= await runNxCommandAsync(`clean ${prjName}`);
      expect(resultBuildInfo.stdout).toContain(`Executing command: ${isWin ? 'gradlew.bat' : './gradlew'} clean`)
  
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

  describe('--buildSystem=GRADLE_KOTLIN_DSL', () => {
    it('should create a gradle quarkus project with kotlin', async() => {
      const prjName = uniq('nx-quarkus');

      await runNxCommandAsync(
        `generate @nxrocks/nx-quarkus:new ${prjName} --projectType application --buildSystem GRADLE_KOTLIN_DSL`
      );

      const resultBuildInfo= await runNxCommandAsync(`clean ${prjName}`);
      expect(resultBuildInfo.stdout).toContain(`Executing command: ${isWin ? 'gradlew.bat' : './gradlew'} clean`)
  
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
    it('should create src in the specified directory', async() => {
      const prjName = uniq('nx-quarkus');

      await runNxCommandAsync(
        `generate @nxrocks/nx-quarkus:new ${prjName} --projectType application --directory subdir`
      );
      expect(() =>
      checkFilesExist(`apps/subdir/${prjName}/mvnw`,`apps/subdir/${prjName}/pom.xml`, `apps/subdir/${prjName}/README.md`)
      ).not.toThrow();
    }, 200000);
  });

  describe('--tags', () => {
    it('should add tags to nx.json', async() => {
      const prjName = uniq('nx-quarkus');

      await runNxCommandAsync(
        `generate @nxrocks/nx-quarkus:new ${prjName} --projectType application --tags e2etag,e2ePackage`
      );
      const project = readJson(`apps/${prjName}/project.json`);
      expect(project.tags).toEqual(['e2etag', 'e2ePackage']);
    }, 200000);
  });
});
