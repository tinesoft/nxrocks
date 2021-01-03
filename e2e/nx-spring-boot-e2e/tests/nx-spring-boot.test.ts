import {
  checkFilesExist,
  ensureNxProject,
  readFile,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
import { toClassName } from '@nrwl/workspace';

describe('nx-spring-boot e2e', () => {
  xit('should create nx-spring-boot with default options', async (done) => {
    const appName = uniq('nx-spring-boot');
    ensureNxProject('@nxrocks/nx-spring-boot', 'dist/packages/nx-spring-boot');
    await runNxCommandAsync(
      `generate @nxrocks/nx-spring-boot:application ${appName}`
    );

    const resultBuildInfo= await runNxCommandAsync(`buildInfo ${appName}`);
    expect(resultBuildInfo.stdout).toContain(`Executing command: ./mvnw spring-boot:build-info`)

    expect(() =>
      checkFilesExist(`apps/${appName}/mvnw`,`apps/${appName}/pom.xml`, `apps/${appName}/HELP.md`)
    ).not.toThrow();

    done();
  }, 180000);

  it('should create nx-spring-boot with given options', async (done) => {
    const appName = uniq('nx-spring-boot');
    const type = 'maven-project';
    const javaVersion = '15';
    const packageName = 'com.tinesoft.api';
    const groupId = 'com.tinesoft';
    const artifactId = 'api' ;
    const description = 'My sample app';
    const version = '1.2.3';

    ensureNxProject('@nxrocks/nx-spring-boot', 'dist/packages/nx-spring-boot');
    await runNxCommandAsync(
      `generate @nxrocks/nx-spring-boot:application ${appName} --type=${type} --packageName=${packageName} --groupId=${groupId} --artifactId=${artifactId} --description="${description}" --version=${version}`// --javaVersion="${javaVersion}"`
    );

    const resultBuildInfo= await runNxCommandAsync(`buildInfo ${appName}`);
    expect(resultBuildInfo.stdout).toContain(`Executing command: ./mvnw spring-boot:build-info`)

    expect(() =>
      checkFilesExist(
        `apps/${appName}/mvnw`,
        `apps/${appName}/pom.xml`, 
        `apps/${appName}/HELP.md`,
        `apps/${appName}/src/main/java/com/tinesoft/api/${toClassName(appName)}Application.java`)
    ).not.toThrow();

    const pomXml = readFile(`apps/${appName}/pom.xml`);
    expect(pomXml).toContain(`<groupId>${groupId}</groupId>`);
    expect(pomXml).toContain(`<artifactId>${artifactId}</artifactId>`);
    expect(pomXml).toContain(`<name>${appName}</name>`);
    expect(pomXml).toContain(`<description>${description}</description>`);
    expect(pomXml).toContain(`<version>${version}</version>`);
    //expect(pomXml).toContain(`<java.version>${javaVersion}</java.version>`);

    done();
  }, 180000);

  xdescribe('--type=gradle-project', () => {
    it('should create a gradle spring-boot project', async (done) => {
      const appName = uniq('nx-spring-boot');
      ensureNxProject(
        '@nxrocks/nx-spring-boot',
        'dist/packages/nx-spring-boot'
      );
      await runNxCommandAsync(
        `generate @nxrocks/nx-spring-boot:application ${appName} --type gradle-project`
      );

      const resultBuildInfo= await runNxCommandAsync(`buildInfo ${appName}`);
      expect(resultBuildInfo.stdout).toContain(`Executing command: ./gradlew bootBuildInfo`)
  
      expect(() =>
      checkFilesExist(`apps/${appName}/gradlew`,`apps/${appName}/build.gradle`, `apps/${appName}/HELP.md`)
      ).not.toThrow();
      done();
    }, 180000);
  });

  xdescribe('--type=gradle-project and --language=kotlin', () => {
    it('should create a gradle spring-boot project with kotlin', async (done) => {
      const appName = uniq('nx-spring-boot');
      ensureNxProject(
        '@nxrocks/nx-spring-boot',
        'dist/packages/nx-spring-boot'
      );
      await runNxCommandAsync(
        `generate @nxrocks/nx-spring-boot:application ${appName} --type gradle-project --language=kotlin`
      );

      const resultBuildInfo= await runNxCommandAsync(`buildInfo ${appName}`);
      expect(resultBuildInfo.stdout).toContain(`Executing command: ./gradlew bootBuildInfo`)
  
      expect(() =>
      checkFilesExist(`apps/${appName}/gradlew`,`apps/${appName}/build.gradle.kts`, `apps/${appName}/HELP.md`)
      ).not.toThrow();
      done();
    }, 180000);
  });
  

  xdescribe('--directory', () => {
    it('should create src in the specified directory', async (done) => {
      const appName = uniq('nx-spring-boot');
      ensureNxProject(
        '@nxrocks/nx-spring-boot',
        'dist/packages/nx-spring-boot'
      );
      await runNxCommandAsync(
        `generate @nxrocks/nx-spring-boot:application ${appName} --directory subdir`
      );
      expect(() =>
      checkFilesExist(`apps/subdir/${appName}/mvnw`,`apps/subdir/${appName}/pom.xml`, `apps/subdir/${appName}/HELP.md`)
      ).not.toThrow();
      done();
    }, 180000);
  });

  xdescribe('--tags', () => {
    it('should add tags to nx.json', async (done) => {
      const appName = uniq('nx-spring-boot');
      ensureNxProject(
        '@nxrocks/nx-spring-boot',
        'dist/packages/nx-spring-boot'
      );
      await runNxCommandAsync(
        `generate @nxrocks/nx-spring-boot:application ${appName} --tags e2etag,e2ePackage`
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[appName].tags).toEqual(['e2etag', 'e2ePackage']);
      done();
    }, 180000);
  });
});
