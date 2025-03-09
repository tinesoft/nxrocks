import { getPackageManagerCommand } from '@nx/devkit';
import {
  createTestProject,
  isLocalNxMatchingLatestFeatureVersion,
  runNxCommand,
} from '@nxrocks/common/testing';
import { execSync } from 'child_process';
import { rmSync } from 'fs-extra';

process.env.NODE_OPTIONS = '--max-old-space-size=8192'; // to avoid oom error during the tests

let projectDirectory: string;

const execSyncOptions: (cwd?: string) => {
  silenceError?: boolean;
  env?: NodeJS.ProcessEnv;
  cwd?: string;
} = (cwd: string = projectDirectory) => ({
  cwd: cwd,
  env: {
    ...process.env,
    GIT_COMMITTER_NAME: 'Smoke Test CI',
    GIT_COMMITTER_EMAIL: 'no-reply@fake.com',
    GIT_AUTHOR_NAME: 'Smoke Test CI',
    GIT_AUTHOR_EMAIL: 'no-reply@fake.com',
  },
  silentError: 'false',
});

const bootapp = 'bootapp';
const bootlib = 'bootlib';
const quarkusapp = 'quarkusapp';
const quarkuslib = 'quarkuslib';
const flutterapp = 'flutterapp';
const flutterlib = 'flutterlib';
const mnApp = 'mnapp';
const krApp = 'krapp';

describe('nxrocks smoke tests', () => {
  afterEach(async () => {
    if (!process.env.KEEP_SMOKE_TESTS_DIR) {
      // Cleanup the test project
      projectDirectory &&
        rmSync(projectDirectory, {
          recursive: true,
          force: true,
        });
    } else {
      console.warn(
        `Keeping smoke test directory at '${projectDirectory}'. Do not forget to remove it when done!`
      );
    }
  });

  it.each`
    pkgManager | workspaceVersion | pluginVersion
    ${'npm'}   | ${'latest'}      | ${'0.0.0-e2e'}
    ${'yarn'}  | ${'latest'}      | ${'0.0.0-e2e'}
    ${'pnpm'}  | ${'latest'}      | ${'0.0.0-e2e'}
    ${'bun'}   | ${'latest'}      | ${'0.0.0-e2e'}
    ${'npm'}   | ${'local'}       | ${'0.0.0-e2e'}
    ${'yarn'}  | ${'local'}       | ${'0.0.0-e2e'}
    ${'pnpm'}  | ${'local'}       | ${'0.0.0-e2e'}
    ${'bun'}   | ${'local'}       | ${'0.0.0-e2e'}
  `(
    `should sucessfully run using '$workspaceVersion' Nx workspace, $pluginVersion plugins version and $pkgManager package manager`,
    async ({ pkgManager, workspaceVersion, pluginVersion }) => {
      if (!process.env.CI && !process.env.FORCE_SMOKE_TESTS) {
        console.log(
          'Skipping smoke test because not running on CI and FORCE_SMOKE_TESTS is not set'
        );
        return;
      }

      if (
        workspaceVersion === 'latest' &&
        isLocalNxMatchingLatestFeatureVersion()
      ) {
        console.log(
          'Skipping current test case because we are already using most recent version of Nx'
        );
        return;
      }

      projectDirectory = createTestProject(
        'nxrocks-smoke',
        pkgManager,
        workspaceVersion
      );

      execSync('git init', execSyncOptions());

      const pluginPkgs = [
        `@nxrocks/nx-spring-boot@${pluginVersion}`,
        `@nxrocks/nx-quarkus@${pluginVersion}`,
        `@nxrocks/nx-micronaut@${pluginVersion}`,
        `@nxrocks/nx-flutter@${pluginVersion}`,
        `@nxrocks/nx-melos@${pluginVersion}`,
        `@nxrocks/nx-ktor@${pluginVersion}`,
      ].join(' ');

      execSync(
        `${getPackageManagerCommand(pkgManager).addDev} ${pluginPkgs}`,
        execSyncOptions(projectDirectory)
      );

      runNxCommand(
        `generate @nxrocks/nx-spring-boot:new ${bootapp} --skip-format=false --projectType application --no-interactive`,
        pkgManager,
        execSyncOptions()
      );
      runNxCommand(
        `generate @nxrocks/nx-spring-boot:new ${bootlib} --skip-format=false --projectType library --no-interactive`,
        pkgManager,
        execSyncOptions()
      );

      runNxCommand(
        `generate @nxrocks/nx-quarkus:new ${quarkusapp} --skip-format=false --projectType application --no-interactive`,
        pkgManager,
        execSyncOptions()
      );
      runNxCommand(
        `generate @nxrocks/nx-quarkus:new ${quarkuslib} --skip-format=false --projectType library --no-interactive`,
        pkgManager,
        execSyncOptions()
      );

      runNxCommand(
        `generate @nxrocks/nx-micronaut:new ${mnApp} --skip-format=false --no-interactive`,
        pkgManager,
        execSyncOptions()
      );

      runNxCommand(
        `generate @nxrocks/nx-melos:init --scriptNameSeparator=-`,
        pkgManager,
        execSyncOptions()
      );

      runNxCommand(
        `generate @nxrocks/nx-ktor:new ${krApp} --skip-format=false --no-interactive`,
        pkgManager,
        execSyncOptions()
      );

      runNxCommand(
        `generate @nxrocks/nx-flutter:new ${flutterapp} --template app --no-interactive`,
        pkgManager,
        execSyncOptions()
      );
      runNxCommand(
        `generate @nxrocks/nx-flutter:new ${flutterlib} --template plugin --no-interactive`,
        pkgManager,
        execSyncOptions()
      );

      execSync(`git add -A`, execSyncOptions());
      execSync(`git commit -am "chore: scaffold projects"`, execSyncOptions());

      runNxCommand(`clean ${bootapp}`, pkgManager, execSyncOptions());
      runNxCommand(`clean ${bootlib}`, pkgManager, execSyncOptions());
      runNxCommand(`clean ${quarkusapp}`, pkgManager, execSyncOptions());
      runNxCommand(`clean ${quarkuslib}`, pkgManager, execSyncOptions());
      runNxCommand(`clean ${mnApp}`, pkgManager, execSyncOptions());
      runNxCommand(`melos-bootstrap`, pkgManager, execSyncOptions());
      runNxCommand(`clean ${flutterapp}`, pkgManager, execSyncOptions());
      runNxCommand(`clean ${flutterlib}`, pkgManager, execSyncOptions());
      runNxCommand(`clean ${krApp}`, pkgManager, execSyncOptions());

      expect(true).toBeTruthy();
    },
    3600000
  );
});
