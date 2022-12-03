import {
  checkFilesExist,
  readFile,
  readJson,
  runNxCommandAsync,
  uniq,
  tmpProjPath
} from '@nrwl/nx-plugin/testing';
import { names } from '@nrwl/devkit';
import {ensureNxProjectWithDeps, octal} from '@nxrocks/common/testing';

import { lstatSync } from 'fs';

describe('nx-spring-boot e2e', () => {
  const isWin = process.platform === "win32";

  beforeAll(async () => {

    ensureNxProjectWithDeps('@nxrocks/nx-spring-boot', 'dist/packages/nx-spring-boot',
      [{ depPkgName: '@nxrocks/common', depDistPath: 'dist/packages/common' }]);
  }, 600000);

  afterAll(() => {
    // `nx reset` kills the daemon, and performs
    // some work which can help clean up e2e leftovers
    runNxCommandAsync('reset');
  });
  
  it('should create nx-spring-boot with default options', async() => {
    const prjName = uniq('nx-spring-boot');
    await runNxCommandAsync(
      `generate @nxrocks/nx-spring-boot:new ${prjName}`
    );

    const resultBuild= await runNxCommandAsync(`build ${prjName}`);
    expect(resultBuild.stdout).toContain(`Executing command: ${isWin ? 'mvnw.cmd' : './mvnw'} package`)

    expect(() =>
      checkFilesExist(`apps/${prjName}/mvnw`,`apps/${prjName}/pom.xml`, `apps/${prjName}/HELP.md`)
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
`(`should create a spring-boot '$projectType' with given options`, async ({ projectType }) => {
    const prjName = uniq('nx-spring-boot');
    const buildSystem = 'maven-project';
    const javaVersion = '17';
    const packageName = 'com.tinesoft.api';
    const groupId = 'com.tinesoft';
    const artifactId = 'api' ;
    const description = 'My sample app';
    //const version = '1.2.3'; https://github.com/nrwl/nx/issues/10786
    const prjDir = projectType === 'application' ? 'apps' : 'libs';

    await runNxCommandAsync(
      `generate @nxrocks/nx-spring-boot:new ${prjName} --projectType ${projectType} --buildSystem=${buildSystem} --packageName=${packageName} --groupId=${groupId} --artifactId=${artifactId} --description="${description}" --javaVersion=${javaVersion}`
    );

    const resultBuild= await runNxCommandAsync(`build ${prjName}`);
    expect(resultBuild.stdout).toContain(`Executing command: ${isWin ? 'mvnw.cmd' : './mvnw'} package`)

    expect(() =>
      checkFilesExist(
        `${prjDir}/${prjName}/mvnw`,
        `${prjDir}/${prjName}/pom.xml`, 
        `${prjDir}/${prjName}/HELP.md`,
        `${prjDir}/${prjName}/src/main/java/com/tinesoft/api/${names(prjName).className}Application.java`)
    ).not.toThrow();

    const pomXml = readFile(`${prjDir}/${prjName}/pom.xml`);
    expect(pomXml).toContain(`<groupId>${groupId}</groupId>`);
    expect(pomXml).toContain(`<artifactId>${artifactId}</artifactId>`);
    expect(pomXml).toContain(`<name>${prjName}</name>`);
    expect(pomXml).toContain(`<description>${description}</description>`);
    //expect(pomXml).toContain(`<version>${version}</version>`);
    expect(pomXml).toContain(`<java.version>${javaVersion}</java.version>`);

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

  describe('--buildSystem=gradle-project', () => {
    it.each`
    projectType     
    ${'application'}
    ${'library'}    
  `(`should create a gradle spring-boot '$projectType'`, async ({ projectType }) => {
      const prjName = uniq('nx-spring-boot');
      const prjDir = projectType === 'application' ? 'apps' : 'libs';

      await runNxCommandAsync(
        `generate @nxrocks/nx-spring-boot:new ${prjName} --projectType ${projectType} --buildSystem gradle-project`
      );

      const resultBuild= await runNxCommandAsync(`build ${prjName}`);
      expect(resultBuild.stdout).toContain(`Executing command: ${isWin ? 'gradlew.bat' : './gradlew'} build`)
  
      expect(() =>
      checkFilesExist(`${prjDir}/${prjName}/gradlew`,`${prjDir}/${prjName}/build.gradle`, `${prjDir}/${prjName}/HELP.md`)
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

  describe('--buildSystem=gradle-project-kotlin', () => {
    it.each`
    projectType     
    ${'application'}
    ${'library'}    
  `(`should create a gradle spring-boot '$projectType'`, async ({ projectType }) => {
      const prjName = uniq('nx-spring-boot');
      const prjDir = projectType === 'application' ? 'apps' : 'libs';

      await runNxCommandAsync(
        `generate @nxrocks/nx-spring-boot:new ${prjName} --projectType ${projectType} --buildSystem gradle-project-kotlin`
      );

      const resultBuild= await runNxCommandAsync(`build ${prjName}`);
      expect(resultBuild.stdout).toContain(`Executing command: ${isWin ? 'gradlew.bat' : './gradlew'} build`)
  
      expect(() =>
      checkFilesExist(`${prjDir}/${prjName}/gradlew`,`${prjDir}/${prjName}/build.gradle.kts`, `${prjDir}/${prjName}/HELP.md`)
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

  describe('--buildSystem=gradle-project and --language=kotlin', () => {
    it.each`
    projectType     
    ${'application'}
    ${'library'}    
  `(`should create a gradle spring-boot '$projectType' with kotlin`, async ({ projectType }) => {
      const prjName = uniq('nx-spring-boot');
      const prjDir = projectType === 'application' ? 'apps' : 'libs';

      await runNxCommandAsync(
        `generate @nxrocks/nx-spring-boot:new ${prjName} --projectType ${projectType} --buildSystem gradle-project --language kotlin`
      );

      const resultBuild= await runNxCommandAsync(`build ${prjName}`);
      expect(resultBuild.stdout).toContain(`Executing command: ${isWin ? 'gradlew.bat' : './gradlew'} build`)
  
      expect(() =>
      checkFilesExist(`${prjDir}/${prjName}/gradlew`,`${prjDir}/${prjName}/build.gradle`, `${prjDir}/${prjName}/HELP.md`)
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
      const prjName = uniq('nx-spring-boot');
      const prjDir = projectType === 'application' ? 'apps' : 'libs';

      await runNxCommandAsync(
        `generate @nxrocks/nx-spring-boot:new ${prjName} --projectType ${projectType} --directory subdir`
      );
      expect(() =>
      checkFilesExist(`${prjDir}/subdir/${prjName}/mvnw`,`${prjDir}/subdir/${prjName}/pom.xml`, `${prjDir}/subdir/${prjName}/HELP.md`)
      ).not.toThrow();

    }, 200000);
  });

  describe('--tags', () => {
    it.each`
    projectType     
    ${'application'}
    ${'library'}    
  `(`should add tags to nx.json' when generating a '$projectType'`, async ({ projectType }) => {
      const prjName = uniq('nx-spring-boot');
      const prjDir = projectType === 'application' ? 'apps' : 'libs';

      await runNxCommandAsync(
        `generate @nxrocks/nx-spring-boot:new ${prjName} --projectType ${projectType} --tags e2etag,e2ePackage`
      );
      const project = readJson(`${prjDir}/${prjName}/project.json`);
      expect(project.tags).toEqual(['e2etag', 'e2ePackage']);

    }, 200000);
  });
});
