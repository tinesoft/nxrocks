import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
describe('nx-flutter e2e', () => {
  it('should create nx-flutter project with default options', async (done) => {
    const appName = uniq('nx-flutter');
    ensureNxProject('@nxrocks/nx-flutter', 'dist/packages/nx-flutter');
    await runNxCommandAsync(`generate @nxrocks/nx-flutter:application ${appName}`);

    const builders = [
      { name: 'analyze', output: `Analyzing ${appName}` },
      
      //{ name: 'assemble', output: `Assembling ${appName}` },
      //{ name: 'attach', output: `Attaching ${appName}` },

      //build commands
      { name: 'buildApk', output: `Built build/app/outputs/flutter-apk/app-release.apk` },
      { name: 'buildAppbundle', output: `Built build/app/outputs/bundle/release/app-release.aab` },
      { name: 'buildBundle', output: `Done in` },

      //required an iOS certificate
      //{name: 'buildIos', output: `No valid code signing certificates were found`},
      //{name: 'buildIosFramework', output: `Building frameworks for iOS is only supported from a module`},
      //{name: 'buildIpa', output: `No valid code signing certificates were found`},

      { name: 'clean', output: `Deleting flutter_export_environment.sh...` },

      //required a test file under 'test_driver/main_test.dart' (default)
      //{ name: 'drive', output: `xxx` },

      { name: 'format', output: `Done in ` },

      //required arb files under 'lib/l10n'
      //{ name: 'genL10n', output: `The 'arb-dir' directory, 'LocalDirectory: 'lib/l10n'', does not exist` },

      //required a running device
      //{ name: 'install', output: `No target device found` },
      //{ name: 'run', output: `No target device found` },

      { name: 'test', output: `All tests passed!` },
    ];

    for(const builder of builders){
      const result = await runNxCommandAsync(`run ${appName}:${builder.name}`);
      expect(result.stdout).toContain(builder.output);
    }

    expect(() =>
      checkFilesExist(`apps/${appName}/pubspec.yaml`)
    ).not.toThrow();
    done();
  }, 600000);

  it('should create nx-flutter project with given options', async (done) => {
    const appName = uniq('nx-flutter');
    const org = 'com.tinesoft';
    const description = 'My flutter application';
    const androidLanguage = 'java';
    const iosLanguage = 'swift';
    const template = 'app';
    const platforms = 'android,ios,linux,macos,windows,web';
    const pub = true;
    const offline = true;

    ensureNxProject('@nxrocks/nx-flutter', 'dist/packages/nx-flutter');
    await runNxCommandAsync(`generate @nxrocks/nx-flutter:application ${appName} --org=${org} --description="${description}" --androidLanguage=${androidLanguage} --iosLanguage=${iosLanguage} --template=${template} --platforms="${platforms}" --pub=${pub} --offline=${offline} `);

    const builders = [

      { name: 'clean', output: `Deleting flutter_export_environment.sh...` },
      { name: 'format', output: `Done in ` },
      { name: 'test', output: `All tests passed!` },
    ];

    for(const builder of builders){
      const result = await runNxCommandAsync(`run ${appName}:${builder.name}`);
      expect(result.stdout).toContain(builder.output);
    }
    
    expect(() =>
      checkFilesExist(`apps/${appName}/pubspec.yaml`,
       `apps/${appName}/android/build.gradle`, 
       `apps/${appName}/ios/Runner.xcodeproj`,
       `apps/${appName}/android/app/src/main/java/com/tinesoft/${appName.replace('-','_')}/MainActivity.java`
       )
    ).not.toThrow();
    done();
  }, 600000);

  describe('--directory', () => {
    it('should create src in the specified directory', async (done) => {
      const appName = uniq('nx-flutter');
      ensureNxProject('@nxrocks/nx-flutter', 'dist/packages/nx-flutter');
      await runNxCommandAsync(
        `generate @nxrocks/nx-flutter:application ${appName} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`apps/subdir/${appName}/pubspec.yaml`)
      ).not.toThrow();
      done();
    }, 180000);
  });

  describe('--tags', () => {
    it('should add tags to nx.json', async (done) => {
      const appName = uniq('nx-flutter');
      ensureNxProject('@nxrocks/nx-flutter', 'dist/packages/nx-flutter');
      await runNxCommandAsync(
        `generate @nxrocks/nx-flutter:application ${appName} --tags e2etag,e2ePackage`
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[appName].tags).toEqual(['e2etag', 'e2ePackage']);
      done();
    }, 180000);
  });
});
