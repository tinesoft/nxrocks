import {
  checkFilesExist,
  ensureNxProject,
  readFile,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
import { names } from '@nrwl/devkit';

describe('nx-quarkus e2e', () => {
  const isWin = process.platform === "win32";

  it('should create nx-quarkus with default options', async (done) => {
    const prjName = uniq('nx-quarkus');
    ensureNxProject('@nxrocks/nx-quarkus', 'dist/packages/nx-quarkus');
    await runNxCommandAsync(
      `generate @nxrocks/nx-quarkus:new ${prjName}`
    );

    const resultBuildInfo= await runNxCommandAsync(`clean ${prjName}`);
    expect(resultBuildInfo.stdout).toContain(`Executing command: ${isWin ? 'mvnw.cmd' : './mvnw'} clean`)

    expect(() =>
      checkFilesExist(`apps/${prjName}/mvnw`,`apps/${prjName}/pom.xml`, `apps/${prjName}/README.md`)
    ).not.toThrow();

    done();
  }, 180000);

  it('should create nx-quarkus with given options', async (done) => {
    const prjName = uniq('nx-quarkus');
    const buildSystem = 'MAVEN';
    const groupId = 'com.tinesoft';
    const artifactId = 'api' ;
    const version = '1.2.3';
    const extensions="resteasy-jackson";

    ensureNxProject('@nxrocks/nx-quarkus', 'dist/packages/nx-quarkus');
    await runNxCommandAsync(
      `generate @nxrocks/nx-quarkus:new ${prjName} --projectType application --buildSystem=${buildSystem} --groupId=${groupId} --artifactId=${artifactId} --version=${version} --extensions=${extensions}`
    );

    const resultBuildInfo= await runNxCommandAsync(`clean ${prjName}`);
    expect(resultBuildInfo.stdout).toContain(`Executing command: ${isWin ? 'mvnw.cmd' : './mvnw'} clean`)

    expect(() =>
      checkFilesExist(
        `apps/${prjName}/mvnw`,
        `apps/${prjName}/pom.xml`, 
        `apps/${prjName}/README.md`,
        `apps/${prjName}/src/main/java/com/tinesoft/resteasyjackson/JacksonResource.java`)
    ).not.toThrow();

    const pomXml = readFile(`apps/${prjName}/pom.xml`);
    expect(pomXml).toContain(`<groupId>${groupId}</groupId>`);
    expect(pomXml).toContain(`<artifactId>${artifactId}</artifactId>`);
    expect(pomXml).toContain(`<version>${version}</version>`);

    done();
  }, 180000);

  describe('--buildSystem=GRADLE', () => {
    it('should create a gradle quarkus project', async (done) => {
      const prjName = uniq('nx-quarkus');
      ensureNxProject(
        '@nxrocks/nx-quarkus',
        'dist/packages/nx-quarkus'
      );
      await runNxCommandAsync(
        `generate @nxrocks/nx-quarkus:new ${prjName} --projectType application --buildSystem GRADLE`
      );

      const resultBuildInfo= await runNxCommandAsync(`clean ${prjName}`);
      expect(resultBuildInfo.stdout).toContain(`Executing command: ${isWin ? 'gradlew.bat' : './gradlew'} clean`)
  
      expect(() =>
      checkFilesExist(`apps/${prjName}/gradlew`,`apps/${prjName}/build.gradle`, `apps/${prjName}/README.md`)
      ).not.toThrow();
      done();
    }, 180000);
  });

  describe('--buildSystem=GRADLE_KOTLIN_DSL', () => {
    it('should create a gradle quarkus project with kotlin', async (done) => {
      const prjName = uniq('nx-quarkus');
      ensureNxProject(
        '@nxrocks/nx-quarkus',
        'dist/packages/nx-quarkus'
      );
      await runNxCommandAsync(
        `generate @nxrocks/nx-quarkus:new ${prjName} --projectType application --buildSystem GRADLE_KOTLIN_DSL`
      );

      const resultBuildInfo= await runNxCommandAsync(`clean ${prjName}`);
      expect(resultBuildInfo.stdout).toContain(`Executing command: ${isWin ? 'gradlew.bat' : './gradlew'} clean`)
  
      expect(() =>
      checkFilesExist(`apps/${prjName}/gradlew`,`apps/${prjName}/build.gradle.kts`, `apps/${prjName}/README.md`)
      ).not.toThrow();
      done();
    }, 180000);
  });
  

  describe('--directory', () => {
    it('should create src in the specified directory', async (done) => {
      const prjName = uniq('nx-quarkus');
      ensureNxProject(
        '@nxrocks/nx-quarkus',
        'dist/packages/nx-quarkus'
      );
      await runNxCommandAsync(
        `generate @nxrocks/nx-quarkus:new ${prjName} --projectType application --directory subdir`
      );
      expect(() =>
      checkFilesExist(`apps/subdir/${prjName}/mvnw`,`apps/subdir/${prjName}/pom.xml`, `apps/subdir/${prjName}/README.md`)
      ).not.toThrow();
      done();
    }, 180000);
  });

  describe('--tags', () => {
    it('should add tags to nx.json', async (done) => {
      const prjName = uniq('nx-quarkus');
      ensureNxProject(
        '@nxrocks/nx-quarkus',
        'dist/packages/nx-quarkus'
      );
      await runNxCommandAsync(
        `generate @nxrocks/nx-quarkus:new ${prjName} --projectType application --tags e2etag,e2ePackage`
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[prjName].tags).toEqual(['e2etag', 'e2ePackage']);
      done();
    }, 180000);
  });
});
