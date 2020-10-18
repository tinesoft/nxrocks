import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
describe('nx-spring-boot e2e', () => {
  it('should create nx-spring-boot', async (done) => {
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


  describe('--type=gradle-project', () => {
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

  describe('--directory', () => {
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

  describe('--tags', () => {
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
