import {
  checkFilesExist,
  ensureNxProject,
  readFile,
  readJson,
  runNxCommandAsync,
  uniq,
  tmpProjPath
} from '@nrwl/nx-plugin/testing';
import { names } from '@nrwl/devkit';
import {buildAndPublishPackages, disableVerdaccioRegistry, enableVerdaccioRegistry, spawnVerdaccioRegistry } from '@nxrocks/common/testing';

import { lstatSync } from 'fs';

describe('nx-spring-boot e2e', () => {
  const isWin = process.platform === "win32";
  const verdaccioPort = 4871;
  let verdaccioRegistry;

  beforeAll(async () => {
    verdaccioRegistry = await spawnVerdaccioRegistry(verdaccioPort);
    enableVerdaccioRegistry(verdaccioPort);

    await buildAndPublishPackages(verdaccioPort);
    
    ensureNxProject('@nxrocks/nx-spring-boot', 'dist/packages/nx-spring-boot');
  }, 600000);

  afterAll(() => {
    disableVerdaccioRegistry();

    if (verdaccioRegistry) {
      verdaccioRegistry.kill();
    }
  });

  it('should create nx-spring-boot with default options', async() => {
    const prjName = uniq('nx-spring-boot');
    await runNxCommandAsync(
      `generate @nxrocks/nx-spring-boot:new ${prjName}`
    );

    const resultBuildInfo= await runNxCommandAsync(`buildInfo ${prjName}`);
    expect(resultBuildInfo.stdout).toContain(`Executing command: ${isWin ? 'mvnw.cmd' : './mvnw'} spring-boot:build-info`)

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

  it('should create nx-spring-boot with given options', async() => {
    const prjName = uniq('nx-spring-boot');
    const buildSystem = 'maven-project';
    const javaVersion = '15';
    const packageName = 'com.tinesoft.api';
    const groupId = 'com.tinesoft';
    const artifactId = 'api' ;
    const description = 'My sample app';
    const version = '1.2.3';

    await runNxCommandAsync(
      `generate @nxrocks/nx-spring-boot:new ${prjName} --projectType application --buildSystem=${buildSystem} --packageName=${packageName} --groupId=${groupId} --artifactId=${artifactId} --description="${description}" --version=${version}`// --javaVersion="${javaVersion}"`
    );

    const resultBuildInfo= await runNxCommandAsync(`buildInfo ${prjName}`);
    expect(resultBuildInfo.stdout).toContain(`Executing command: ${isWin ? 'mvnw.cmd' : './mvnw'} spring-boot:build-info`)

    expect(() =>
      checkFilesExist(
        `apps/${prjName}/mvnw`,
        `apps/${prjName}/pom.xml`, 
        `apps/${prjName}/HELP.md`,
        `apps/${prjName}/src/main/java/com/tinesoft/api/${names(prjName).className}Application.java`)
    ).not.toThrow();

    const pomXml = readFile(`apps/${prjName}/pom.xml`);
    expect(pomXml).toContain(`<groupId>${groupId}</groupId>`);
    expect(pomXml).toContain(`<artifactId>${artifactId}</artifactId>`);
    expect(pomXml).toContain(`<name>${prjName}</name>`);
    expect(pomXml).toContain(`<description>${description}</description>`);
    expect(pomXml).toContain(`<version>${version}</version>`);
    //expect(pomXml).toContain(`<java.version>${javaVersion}</java.version>`);

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

  describe('--buildSystem=gradle-project', () => {
    it('should create a gradle spring-boot project', async() => {
      const prjName = uniq('nx-spring-boot');

      await runNxCommandAsync(
        `generate @nxrocks/nx-spring-boot:new ${prjName} --projectType application --buildSystem gradle-project`
      );

      const resultBuildInfo= await runNxCommandAsync(`buildInfo ${prjName}`);
      expect(resultBuildInfo.stdout).toContain(`Executing command: ${isWin ? 'gradlew.bat' : './gradlew'} bootBuildInfo`)
  
      expect(() =>
      checkFilesExist(`apps/${prjName}/gradlew`,`apps/${prjName}/build.gradle`, `apps/${prjName}/HELP.md`)
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

  describe('--buildSystem=gradle-project and --language=kotlin', () => {
    it('should create a gradle spring-boot project with kotlin', async() => {
      const prjName = uniq('nx-spring-boot');

      await runNxCommandAsync(
        `generate @nxrocks/nx-spring-boot:new ${prjName} --projectType application --buildSystem gradle-project --language kotlin`
      );

      const resultBuildInfo= await runNxCommandAsync(`buildInfo ${prjName}`);
      expect(resultBuildInfo.stdout).toContain(`Executing command: ${isWin ? 'gradlew.bat' : './gradlew'} bootBuildInfo`)
  
      expect(() =>
      checkFilesExist(`apps/${prjName}/gradlew`,`apps/${prjName}/build.gradle.kts`, `apps/${prjName}/HELP.md`)
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
      const prjName = uniq('nx-spring-boot');

      await runNxCommandAsync(
        `generate @nxrocks/nx-spring-boot:new ${prjName} --projectType application --directory subdir`
      );
      expect(() =>
      checkFilesExist(`apps/subdir/${prjName}/mvnw`,`apps/subdir/${prjName}/pom.xml`, `apps/subdir/${prjName}/HELP.md`)
      ).not.toThrow();

    }, 200000);
  });

  describe('--tags', () => {
    it('should add tags to nx.json', async() => {
      const prjName = uniq('nx-spring-boot');

      await runNxCommandAsync(
        `generate @nxrocks/nx-spring-boot:new ${prjName} --projectType application --tags e2etag,e2ePackage`
      );
      const project = readJson(`apps/${prjName}/project.json`);
      expect(project.tags).toEqual(['e2etag', 'e2ePackage']);

    }, 200000);
  });

  function octal(value: string | number): number {
    if (typeof value === 'string') return parseInt(value, 8);
    return value;
  }
});
