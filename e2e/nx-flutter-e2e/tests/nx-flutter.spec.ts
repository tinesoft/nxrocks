import {
  uniq,
} from '@nx/plugin/testing';
import { checkFilesExist, createTestProject, readJson, runNxCommandAsync } from '@nxrocks/common/testing';
import { execSync } from 'child_process';
import { rmSync } from 'fs-extra';

//jest.mock('enquirer'); // we mock 'enquirer' to bypass the interactive prompt
import * as enquirer from 'enquirer';

describe('nx-flutter e2e', () => {
  let projectDirectory: string;

  beforeAll(() => {
    projectDirectory = createTestProject('pnpm');

    // The plugin has been built and published to a local registry in the jest globalSetup
    // Install the plugin built with the latest source code into the test repo
    execSync(`pnpm install @nxrocks/nx-flutter@0.0.0-e2e`, {
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
    execSync('npm ls @nxrocks/nx-flutter', {
      cwd: projectDirectory,
      stdio: 'inherit',
    });
  });

  beforeEach(() => {
    jest.spyOn(enquirer, 'prompt').mockResolvedValue({
      platforms: ['android', 'ios', 'web', 'linux', 'windows', 'macos'],
      androidLanguage: 'kotlin',
      iosLanguage: 'swift',
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create nx-flutter project with default options', async () => {
    const appName = uniq('nx-flutter');

    const sep = process.platform === 'win32' ? '\\' : '/';
    await runNxCommandAsync(
      `generate @nxrocks/nx-flutter:create ${appName} --no-interactive`
    );

    const executors = [
      { name: 'analyze', output: `Analyzing ${appName}` },

      //{ name: 'assemble', output: `Assembling ${appName}` },
      //{ name: 'attach', output: `Attaching ${appName}` },

      //build commands
      //{ name: 'build-aar', output: `Running Gradle task 'assembleAarDebug'...` }, // only for module or plugin projects
      {
        name: 'build-apk',
        output: `Built build${sep}app${sep}outputs${sep}flutter-apk${sep}app-release.apk`,
      },
      //{ name: 'build-appbundle', output: `Built build/app/outputs/bundle/release/app-release.aab` },
      //{ name: 'build-bundle', output: `Done in` },

      //required an iOS certificate
      //{name: 'build-ios', output: `No valid code signing certificates were found`},
      //{name: 'build-ios-framework', output: `Building frameworks for iOS is only supported from a module`},
      //{name: 'build-ipa', output: `No valid code signing certificates were found`},

      //{ name: 'clean', output: `Deleting flutter_export_environment.sh...` },

      //required a test file under 'test_driver/main_test.dart' (default)
      //{ name: 'drive', output: `xxx` },

      //{ name: 'format', output: `Formatted no files ` },

      //required arb files under 'lib/l10n'
      //{ name: 'gen-l10n', output: `The 'arb-dir' directory, 'LocalDirectory: 'lib/l10n'', does not exist` },

      //required a running device
      //{ name: 'install', output: `No target device found` },
      //{ name: 'run', output: `No target device found` },

      //{ name: 'test', output: `All tests passed!` },
    ];

    let totalExecutorsTime = 0;
    for (const executor of executors) {
      const start = new Date().getTime();
      const result = await runNxCommandAsync(`run ${appName}:${executor.name}`);
      const end = new Date().getTime();
      console.log(`${executor.name} took ${end - start}ms`);
      totalExecutorsTime += end - start;
      expect(result.stdout).toContain(executor.output);
    }
    console.log(`Total executors time: ${totalExecutorsTime}ms`);

    expect(() => checkFilesExist(`${appName}/pubspec.yaml`)).not.toThrow();
  }, 400000);

  it('should create nx-flutter project with given options', async () => {
    const appName = uniq('nx-flutter');
    const org = 'com.tinesoft';
    const description = 'My flutter application';
    const androidLanguage = 'java';
    const iosLanguage = 'swift';
    const template = 'app';
    const platforms = 'android,ios,linux,macos,windows,web';
    const pub = true;
    const offline = true;

    await runNxCommandAsync(
      `generate @nxrocks/nx-flutter:create ${appName} --org=${org} --description="${description}" --androidLanguage=${androidLanguage} --iosLanguage=${iosLanguage} --template=${template} --platforms="${platforms}" --pub=${pub} --offline=${offline} --no-interactive`
    );

    const executors = [
      { name: 'clean', output: `Deleting flutter_export_environment.sh...` },
      { name: 'format', output: `Formatted no files ` },
      //{ name: 'test', output: `All tests passed!` },
    ];

    for (const executor of executors) {
      const result = await runNxCommandAsync(`run ${appName}:${executor.name}`);
      expect(result.stdout).toContain(executor.output);
    }

    expect(() =>
      checkFilesExist(
        `${appName}/pubspec.yaml`,
        `${appName}/android/build.gradle`,
        `${appName}/ios/Runner.xcodeproj`,
        `${appName}/android/app/src/main/java/com/tinesoft/${appName.replace(
          '-',
          '_'
        )}/MainActivity.java`
      )
    ).not.toThrow();
  }, 200000);

  describe('--directory', () => {
    it('should create src in the specified directory', async () => {
      const appName = uniq('nx-flutter');

      await runNxCommandAsync(
        `generate @nxrocks/nx-flutter:create ${appName} --directory subdir --no-interactive`
      );
      expect(() =>
        checkFilesExist(`subdir/${appName}/pubspec.yaml`)
      ).not.toThrow();
    }, 200000);
  });

  describe('--tags', () => {
    it('should add tags to nx.json', async () => {
      const appName = uniq('nx-flutter');

      await runNxCommandAsync(
        `generate @nxrocks/nx-flutter:create ${appName} --tags e2etag,e2ePackage --no-interactive`
      );
      const project = readJson(`${appName}/project.json`);
      expect(project.tags).toEqual(['e2etag', 'e2ePackage']);
    }, 200000);
  });
});
