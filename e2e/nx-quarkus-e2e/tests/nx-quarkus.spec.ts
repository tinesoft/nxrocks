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
      [{ name: '@nxrocks/common', path: 'dist/packages/common' }]);
  }, 600000);
  
  afterAll(() => {
    // `nx reset` kills the daemon, and performs
    // some work which can help clean up e2e leftovers
    runNxCommandAsync('reset');
  });
  
  it('should create nx-quarkus with default options', async() => {
    const prjName = uniq('nx-quarkus');
    await runNxCommandAsync(
      `generate @nxrocks/nx-quarkus:new ${prjName}`
    );

    const resultBuild= await runNxCommandAsync(`build ${prjName}`);
    expect(resultBuild.stdout).toContain(`Executing command: ${isWin ? 'mvnw.cmd' : './mvnw'} package`)

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

  it.each`
  projectType     
  ${'application'}
  ${'library'}    
`(`should create a quarkus '$projectType' with given options`, async ({ projectType }) => {
    const prjName = uniq('nx-quarkus');
    const prjDir = projectType === 'application' ? 'apps' : 'libs';
    const buildSystem = 'MAVEN';
    const groupId = 'com.tinesoft';
    const artifactId = 'api' ;
    //const version = '1.2.3'; https://github.com/nrwl/nx/issues/10786
    const extensions="resteasy";

    await runNxCommandAsync(
      `generate @nxrocks/nx-quarkus:new ${prjName} --projectType ${projectType} --buildSystem=${buildSystem} --groupId=${groupId} --artifactId=${artifactId} --extensions=${extensions}`
    );

    const resultBuild= await runNxCommandAsync(`build ${prjName}`);
    expect(resultBuild.stdout).toContain(`Executing command: ${isWin ? 'mvnw.cmd' : './mvnw'} package`)

    expect(() =>
      checkFilesExist(
        `${prjDir}/${prjName}/mvnw`,
        `${prjDir}/${prjName}/pom.xml`, 
        `${prjDir}/${prjName}/README.md`,
        `${prjDir}/${prjName}/src/main/java/com/tinesoft/GreetingResource.java`)
    ).not.toThrow();

    const pomXml = readFile(`${prjDir}/${prjName}/pom.xml`);
    expect(pomXml).toContain(`<groupId>${groupId}</groupId>`);
    expect(pomXml).toContain(`<artifactId>${artifactId}</artifactId>`);
    //expect(pomXml).toContain(`<version>${version}</version>`);

    // make sure the build wrapper file is executable (*nix only)
    if(!isWin) {
      const execPermission = '755';
      expect(
        lstatSync(
          tmpProjPath(`${prjDir}/${prjName}/mvnw`)
        ).mode & octal(execPermission)
      ).toEqual(octal(execPermission));
    }

  }, 200000);

  describe('--buildSystem=GRADLE', () => {
    it.each`
    projectType     
    ${'application'}
    ${'library'}    
  `(`should create a gradle quarkus '$projectType'`, async ({ projectType }) => {
    const prjName = uniq('nx-quarkus');
    const prjDir = projectType === 'application' ? 'apps' : 'libs';

      await runNxCommandAsync(
        `generate @nxrocks/nx-quarkus:new ${prjName} --projectType ${projectType} --buildSystem GRADLE`
      );

      const resultBuild= await runNxCommandAsync(`build ${prjName}`);
      expect(resultBuild.stdout).toContain(`Executing command: ${isWin ? 'gradlew.bat' : './gradlew'} build`)
  
      expect(() =>
      checkFilesExist(`${prjDir}/${prjName}/gradlew`,`${prjDir}/${prjName}/build.gradle`, `${prjDir}/${prjName}/README.md`)
      ).not.toThrow();

      // make sure the build wrapper file is executable (*nix only)
      if(!isWin) {
        const execPermission = '755';
        expect(
          lstatSync(
            tmpProjPath(`${prjDir}/${prjName}/gradlew`)
          ).mode & octal(execPermission)
        ).toEqual(octal(execPermission));
      }

    }, 200000);
  });

  describe('--buildSystem=GRADLE_KOTLIN_DSL', () => {    
    it.each`
    projectType     
    ${'application'}
    ${'library'}    
  `(`should create a gradle quarkus '$projectType' with kotlin`, async ({ projectType }) => {
    const prjName = uniq('nx-quarkus');
    const prjDir = projectType === 'application' ? 'apps' : 'libs';

      await runNxCommandAsync(
        `generate @nxrocks/nx-quarkus:new ${prjName} --projectType ${projectType} --buildSystem GRADLE_KOTLIN_DSL`
      );

      const resultBuild= await runNxCommandAsync(`build ${prjName}`);
      expect(resultBuild.stdout).toContain(`Executing command: ${isWin ? 'gradlew.bat' : './gradlew'} build`)
  
      expect(() =>
      checkFilesExist(`${prjDir}/${prjName}/gradlew`,`${prjDir}/${prjName}/build.gradle.kts`, `${prjDir}/${prjName}/README.md`)
      ).not.toThrow();

      // make sure the build wrapper file is executable (*nix only)
      if(!isWin) {
        const execPermission = '755';
        expect(
          lstatSync(
            tmpProjPath(`${prjDir}/${prjName}/gradlew`)
          ).mode & octal(execPermission)
        ).toEqual(octal(execPermission));
      }

    }, 200000);
  });
  

  describe('--directory', () => {
    it.each`
    projectType     
    ${'application'}
    ${'library'}    
  `(`should create src in the specified directory when generating a '$projectType'`, async ({ projectType }) => {
      const prjName = uniq('nx-quarkus');
      const prjDir = projectType === 'application' ? 'apps' : 'libs';

      await runNxCommandAsync(
        `generate @nxrocks/nx-quarkus:new ${prjName} --projectType ${projectType} --directory subdir`
      );
      expect(() =>
      checkFilesExist(`${prjDir}/subdir/${prjName}/mvnw`,`${prjDir}/subdir/${prjName}/pom.xml`, `${prjDir}/subdir/${prjName}/README.md`)
      ).not.toThrow();
    }, 200000);
  });

  describe('--tags', () => {

    it.each`
    projectType     
    ${'application'}
    ${'library'}    
  `(`should add tags to nx.json when generating a '$projectType'`, async ({ projectType }) => {
      const prjName = uniq('nx-quarkus');
      const prjDir = projectType === 'application' ? 'apps' : 'libs';

      await runNxCommandAsync(
        `generate @nxrocks/nx-quarkus:new ${prjName} --projectType ${projectType} --tags e2etag,e2ePackage`
      );
      const project = readJson(`${prjDir}/${prjName}/project.json`);
      expect(project.tags).toEqual(['e2etag', 'e2ePackage']);
    }, 200000);
  });
});
