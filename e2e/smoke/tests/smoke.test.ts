import { uniq } from '@nrwl/nx-plugin/testing';
import { patchDependencyOfPlugin } from '@nxrocks/common/testing';

import { execSync, ExecSyncOptions } from 'child_process';
import { copySync } from 'fs-extra';
import { join, resolve } from 'path';

import { dirSync } from 'tmp';

let smokeDirectory: string;
let cleanup: () => void;

let workspaceRoot: string;

const workspaceName = 'nxrocks-host';
const packagesDistDirectory = resolve(__dirname, '../../../dist/packages');

const execSyncOptions: () => ExecSyncOptions = () => ({
  cwd: join(smokeDirectory, workspaceName),
  env: {
    ...process.env,
    GIT_COMMITTER_NAME: 'Smoke Test CI',
    GIT_COMMITTER_EMAIL: 'no-reply@fake.com',
    GIT_AUTHOR_NAME: 'Smoke Test CI',
    GIT_AUTHOR_EMAIL: 'no-reply@fake.com',
  },
  stdio: 'inherit',
});

const bootapp = uniq('boot-app-');
const bootlib = uniq('boot-lib-');
const quarkusapp = uniq('quarkus-app-');
const quarkuslib = uniq('quarkus-lib-');
const flutterapp = uniq('flutter-app-');
const flutterlib = uniq('flutter-lib-');
const mnApp = uniq('mnapp-');

describe('nxrocks smoke tests', () => {
  beforeEach(async () => {
    ({ name: smokeDirectory, removeCallback: cleanup } = dirSync({
      unsafeCleanup: true,
    }));
    workspaceRoot = join(smokeDirectory, workspaceName);

  });

  afterEach(async () => {
    cleanup();
  });

  it('should sucessfully run using latest Nx workspace and latest plugins(from local)', async () => {

    if(!process.env.CI) {
      console.log('Skipping smoke test because not running on CI');
      return;
    }

    execSync(
      `npx create-nx-workspace@latest ${workspaceName} --preset empty --nxCloud false`,
      {
        cwd: smokeDirectory,
        env: process.env,
        stdio: 'inherit',
      },
    );

    copySync(packagesDistDirectory, join(workspaceRoot, 'packages')); //copy dist packages (from nxrocks) into host, to avoid them to be affected when installing them locally

    execSync('git init', execSyncOptions()); 

    execSync(`npm i --save-dev ${workspaceRoot}/packages/common ${workspaceRoot}/packages/nx-spring-boot ${workspaceRoot}/packages/nx-quarkus ${workspaceRoot}/packages/nx-flutter ${workspaceRoot}/packages/nx-micronaut`, execSyncOptions());

    patchDependencyOfPlugin('packages/nx-spring-boot', '@nxrocks/common', 'packages/common', workspaceRoot);
    patchDependencyOfPlugin('packages/nx-micronaut', '@nxrocks/common', 'packages/common', workspaceRoot);
    patchDependencyOfPlugin('packages/nx-quarkus', '@nxrocks/common', 'packages/common', workspaceRoot);
    patchDependencyOfPlugin('packages/nx-flutter', '@nxrocks/common', 'packages/common', workspaceRoot);

    execSync('npm install', execSyncOptions());

    execSync(
      `npx nx g @nxrocks/nx-spring-boot:new ${bootapp} --projectType application --no-interactive`,
      execSyncOptions(),
    );
    execSync(
      `npx nx g @nxrocks/nx-spring-boot:new ${bootlib} --projectType library --no-interactive`,
      execSyncOptions(),
    );

    execSync(
      `npx nx g @nxrocks/nx-quarkus:new ${quarkusapp} --projectType application --no-interactive`,
      execSyncOptions(),
    );
    execSync(
      `npx nx g @nxrocks/nx-quarkus:new ${quarkuslib} --projectType library --no-interactive`,
      execSyncOptions(),
    );

    execSync(
      `npx nx g @nxrocks/nx-flutter:new ${flutterapp} --projectType application --interactive=false`,
      execSyncOptions(),
    );
    execSync(
      `npx nx g @nxrocks/nx-flutter:new ${flutterlib} --projectType library --interactive=false`,
      execSyncOptions(),
    );

    execSync(
      `npx nx g @nxrocks/nx-micronaut:new ${mnApp} --projectType application --no-interactive`,
      execSyncOptions(),
    );

    execSync(`git commit -am "chore: scaffold projects"`, execSyncOptions());

    execSync('npx nx print-affected --target build', {
      ...execSyncOptions(),
      stdio: ['ignore', 'ignore', 'inherit'],
    });


    execSync(`npx nx build ${bootapp}`, execSyncOptions());
    execSync(`npx nx build ${bootlib}`, execSyncOptions());
    execSync(`npx nx build ${quarkusapp}`, execSyncOptions());
    execSync(`npx nx build ${quarkuslib}`, execSyncOptions());
    execSync(`npx nx build ${flutterapp}`, execSyncOptions());
    execSync(`npx nx build ${flutterlib}`, execSyncOptions());
    execSync(`npx nx build ${mnApp}`, execSyncOptions());

    expect(true).toBeTruthy();
  }, 1500000);

  xit('should sucessfully run using latest Nx workspace and latest published plugins(from NPM)', async () => {

    if(!process.env.CI) {
      console.log('Skipping smoke test because not running on CI');
      return;
    }

    execSync(
      `npx create-nx-workspace@latest ${workspaceName} --preset empty --nxCloud false`,
      {
        cwd: smokeDirectory,
        env: process.env,
        stdio: 'inherit',
      },
    );

    execSync('git init', execSyncOptions()); 

    execSync(`npm i --save-dev @nxrocks/nx-spring-boot @nxrocks/nx-quarkus @nxrocks/nx-flutter @nxrocks/nx-micronaut`, execSyncOptions());

    execSync(
      `npx nx g @nxrocks/nx-spring-boot:new ${bootapp} --projectType application --no-interactive`,
      execSyncOptions(),
    );
    execSync(
      `npx nx g @nxrocks/nx-spring-boot:new ${bootlib} --projectType library --no-interactive`,
      execSyncOptions(),
    );

    execSync(
      `npx nx g @nxrocks/nx-quarkus:new ${quarkusapp} --projectType application --no-interactive`,
      execSyncOptions(),
    );
    execSync(
      `npx nx g @nxrocks/nx-quarkus:new ${quarkuslib} --projectType library --no-interactive`,
      execSyncOptions(),
    );

    execSync(
      `npx nx g @nxrocks/nx-flutter:new ${flutterapp} --projectType application --interactive=false`,
      execSyncOptions(),
    );
    execSync(
      `npx nx g @nxrocks/nx-flutter:new ${flutterlib} --projectType library --interactive=false`,
      execSyncOptions(),
    );

    execSync(
      `npx nx g @nxrocks/nx-micronaut:new ${mnApp} --projectType application --no-interactive`,
      execSyncOptions(),
    );


    execSync(`git commit -am "chore: scaffold projects"`, execSyncOptions());

    execSync('npx nx print-affected --target build', {
      ...execSyncOptions(),
      stdio: ['ignore', 'ignore', 'inherit'],
    });


    execSync(`npx nx build ${bootapp}`, execSyncOptions());
    execSync(`npx nx build ${bootlib}`, execSyncOptions());
    execSync(`npx nx build ${quarkusapp}`, execSyncOptions());
    execSync(`npx nx build ${quarkuslib}`, execSyncOptions());
    execSync(`npx nx build ${flutterapp}`, execSyncOptions());
    execSync(`npx nx build ${flutterlib}`, execSyncOptions());
    execSync(`npx nx build ${mnApp}`, execSyncOptions());

    expect(true).toBeTruthy();
  }, 1500000);
});