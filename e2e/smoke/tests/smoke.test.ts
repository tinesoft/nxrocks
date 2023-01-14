import { ensureLocalPluginsWithDeps } from '@nxrocks/common/testing';

import { execSync, ExecSyncOptions } from 'child_process';
import { copySync } from 'fs-extra';
import { join, resolve } from 'path';

import { dirSync } from 'tmp';

process.env.NODE_OPTIONS="--max-old-space-size=8192"; // to avoid oom error during the tests

let smokeDirectory: string;
let cleanup: () => void;

let workspaceRoot: string;

const workspaceName = 'host';
const packagesDistDirectory = resolve(__dirname, '../../../dist/packages');

const execSyncOptions: (cwd?:string) => ExecSyncOptions = (cwd:string = join(smokeDirectory, workspaceName)) => ({
  cwd: cwd,
  env: {
    ...process.env,
    GIT_COMMITTER_NAME: 'Smoke Test CI',
    GIT_COMMITTER_EMAIL: 'no-reply@fake.com',
    GIT_AUTHOR_NAME: 'Smoke Test CI',
    GIT_AUTHOR_EMAIL: 'no-reply@fake.com',
  },
  stdio: 'inherit',
});

const bootapp = 'bootapp';
const bootlib = 'bootlib';
const quarkusapp = 'quarkusapp';
const quarkuslib = 'quarkuslib';
const flutterapp = 'flutterapp';
const flutterlib = 'flutterlib';
const mnApp = 'mnapp';

describe('nxrocks smoke tests', () => {
  beforeEach(async () => {
    ({ name: smokeDirectory, removeCallback: cleanup } = dirSync({
      prefix: 'nxrocks-smoke',
      keep: !!process.env.KEEP_SMOKE_TESTS_DIR,
      unsafeCleanup: true,
    }));
    workspaceRoot = join(smokeDirectory, workspaceName);

  });

  afterEach(async () => {
    if(!process.env.KEEP_SMOKE_TESTS_DIR) {
      cleanup();
    }
    else {
      console.warn(`Keeping smoke test directory at '${workspaceRoot}'. Do not forget to remove it when done!`);
    }
  });

  it.each`
  pkgManager  | createCommand                               | addDevCommand             | runCommand
  ${'npm'}    | ${'npx --yes create-nx-workspace@latest'}   | ${'npm i --save-dev'}     | ${'npx'}
  ${'yarn'}   | ${'yarn create nx-workspace'}               | ${'yarn add --dev'}       | ${'yarn'}
  ${'pnpm'}   | ${'pnpm dlx create-nx-workspace@latest'}    | ${'pnpm add --save-dev'}  | ${'pnpm exec'}
`(`should sucessfully run using latest Nx workspace, latest plugins(from local) and $pkgManager package manager`, async ({createCommand, addDevCommand, runCommand }) => {

    if(!process.env.CI && !process.env.FORCE_SMOKE_TESTS) {
      console.log('Skipping smoke test because not running on CI and FORCE_SMOKE_TESTS is not set');
      return;
    }

    execSync(
      `${createCommand} ${workspaceName} --preset empty --nxCloud false`,
      {
        cwd: smokeDirectory,
        env: process.env,
        stdio: 'inherit',
      },
    );

    copySync(packagesDistDirectory, join(workspaceRoot, 'packages')); //copy dist packages (from nxrocks) into host, to avoid them to be affected when installing them locally

    execSync('git init', execSyncOptions()); 

    ensureLocalPluginsWithDeps([
      {name: '@nxrocks/nx-spring-boot', path:'packages/nx-spring-boot'},
      {name: '@nxrocks/nx-micronaut', path:'packages/nx-micronaut'},
      {name: '@nxrocks/nx-quarkus', path:'packages/nx-quarkus'},
      {name: '@nxrocks/nx-flutter', path:'packages/nx-flutter'},
      {name: '@nxrocks/nx-melos', path:'packages/nx-melos'}],
      [{name:'@nxrocks/common', path:'packages/common'}], 
      workspaceRoot);
      
    execSync(
      `${runCommand} nx g @nxrocks/nx-spring-boot:new ${bootapp} --skip-format=false --projectType application --no-interactive`,
      execSyncOptions(),
    );
    execSync(
      `${runCommand} nx g @nxrocks/nx-spring-boot:new ${bootlib} --skip-format=false --projectType library --no-interactive`,
      execSyncOptions(),
    );

    execSync(
      `${runCommand} nx g @nxrocks/nx-quarkus:new ${quarkusapp} --skip-format=false --projectType application --no-interactive`,
      execSyncOptions(),
    );
    execSync(
      `${runCommand} nx g @nxrocks/nx-quarkus:new ${quarkuslib} --skip-format=false --projectType library --no-interactive`,
      execSyncOptions(),
    );
    
    execSync(
      `${runCommand} nx g @nxrocks/nx-micronaut:new ${mnApp} --skip-format=false --projectType application --no-interactive`,
      execSyncOptions(),
    );

    execSync(
      `${runCommand} nx g @nxrocks/nx-melos:init --scriptNameSeparator=-`,
      execSyncOptions(),
    );
    
    execSync(
      `${runCommand} nx g @nxrocks/nx-flutter:new ${flutterapp} --template app --no-interactive --skipAdditionalPrompts=true`,
      execSyncOptions(),
    );
    execSync(
      `${runCommand} nx g @nxrocks/nx-flutter:new ${flutterlib} --template plugin --no-interactive --skipAdditionalPrompts=true`,
      execSyncOptions(),
    );

    execSync(`git commit -am "chore: scaffold projects"`, execSyncOptions());

    execSync(`${runCommand} nx print-affected --target build`, {
      ...execSyncOptions(),
      stdio: ['ignore', 'ignore', 'inherit'],
    });

    execSync(`${runCommand} nx build ${bootapp}`, execSyncOptions());
    execSync(`${runCommand} nx build ${bootlib}`, execSyncOptions());
    execSync(`${runCommand} nx build ${quarkusapp}`, execSyncOptions());
    execSync(`${runCommand} nx build ${quarkuslib}`, execSyncOptions());
    execSync(`${runCommand} nx build ${mnApp}`, execSyncOptions());
    execSync(`${runCommand} nx melos-bootstrap`, execSyncOptions());
    execSync(`${runCommand} nx clean ${flutterapp}`, execSyncOptions());
    execSync(`${runCommand} nx clean ${flutterlib}`, execSyncOptions());

    expect(true).toBeTruthy();
  }, 1500000);

  it.each`
  pkgManager  | createCommand                               | addDevCommand             | runCommand
  ${'npm'}    | ${'npx --yes create-nx-workspace@latest'}   | ${'npm i --save-dev'}     | ${'npx'}
  ${'yarn'}   | ${'yarn create nx-workspace'}               | ${'yarn add --dev'}       | ${'yarn'}
  ${'pnpm'}   | ${'pnpm dlx create-nx-workspace@latest'}    | ${'pnpm add --save-dev'}  | ${'pnpm exec'}
`(`should sucessfully run using latest Nx workspace, latest published plugins(from npm registry) and $pkgManager package manager`, async ({createCommand, addDevCommand, runCommand }) => {

    if(!process.env.CI && !process.env.FORCE_SMOKE_TESTS) {
      console.log('Skipping smoke test because not running on CI and FORCE_SMOKE_TESTS is not set');
      return;
    }

    execSync(
      `${createCommand} ${workspaceName} --preset empty --nxCloud false`,
      {
        cwd: smokeDirectory,
        env: process.env,
        stdio: 'inherit',
      },
    );

    execSync('git init', execSyncOptions()); 

    execSync(`${addDevCommand} @nxrocks/nx-spring-boot @nxrocks/nx-quarkus @nxrocks/nx-flutter @nxrocks/nx-micronaut @nxrocks/nx-melos`, execSyncOptions());

    execSync(
      `${runCommand} nx g @nxrocks/nx-spring-boot:new ${bootapp} --skip-format=false --projectType application --no-interactive`,
      execSyncOptions(),
    );
    execSync(
      `${runCommand} nx g @nxrocks/nx-spring-boot:new ${bootlib} --skip-format=false --projectType library --no-interactive`,
      execSyncOptions(),
    );

    execSync(
      `${runCommand} nx g @nxrocks/nx-quarkus:new ${quarkusapp} --skip-format=false --projectType application --no-interactive`,
      execSyncOptions(),
    );
    execSync(
      `${runCommand} nx g @nxrocks/nx-quarkus:new ${quarkuslib} --skip-format=false --projectType library --no-interactive`,
      execSyncOptions(),
    );
    
    execSync(
      `${runCommand} nx g @nxrocks/nx-micronaut:new ${mnApp} --skip-format=false --projectType application --no-interactive`,
      execSyncOptions(),
    );

    execSync(
      `${runCommand} nx g @nxrocks/nx-melos:init --scriptNameSeparator=-`,
      execSyncOptions(),
    );

    execSync(
      `${runCommand} nx g @nxrocks/nx-flutter:new ${flutterapp} --template app --no-interactive --skipAdditionalPrompts=true`,
      execSyncOptions(),
    );
    execSync(
      `${runCommand} nx g @nxrocks/nx-flutter:new ${flutterlib} --template plugin --no-interactive --skipAdditionalPrompts=true`,
      execSyncOptions(),
    );

    execSync(`git commit -am "chore: scaffold projects"`, execSyncOptions());

    execSync(`${runCommand} nx print-affected --target build`, {
      ...execSyncOptions(),
      stdio: ['ignore', 'ignore', 'inherit'],
    });

    execSync(`${runCommand} nx build ${bootapp}`, execSyncOptions());
    execSync(`${runCommand} nx build ${bootlib}`, execSyncOptions());
    execSync(`${runCommand} nx build ${quarkusapp}`, execSyncOptions());
    execSync(`${runCommand} nx build ${quarkuslib}`, execSyncOptions());
    execSync(`${runCommand} nx build ${mnApp}`, execSyncOptions());
    execSync(`${runCommand} nx melos-bootstrap`, execSyncOptions());
    execSync(`${runCommand} nx clean ${flutterapp}`, execSyncOptions());
    execSync(`${runCommand} nx clean ${flutterlib}`, execSyncOptions());


    expect(true).toBeTruthy();
  }, 1500000);


it(`should sucessfully create flutter app/lib without oome`, async () => {

if(!process.env.CI && !process.env.FORCE_SMOKE_TESTS) {
  console.log('Skipping smoke test because not running on CI and FORCE_SMOKE_TESTS is not set');
  return;
}

execSync(
  `npx --yes create-nx-workspace@latest ${workspaceName} --preset empty --nxCloud false`,
  {
    cwd: smokeDirectory,
    env: process.env,
    stdio: 'inherit',
  },
);

copySync(packagesDistDirectory, join(workspaceRoot, 'packages')); //copy dist packages (from nxrocks) into host, to avoid them to be affected when installing them locally

execSync('git init', execSyncOptions()); 

ensureLocalPluginsWithDeps([
  {name: '@nxrocks/nx-flutter', path:'packages/nx-flutter'}],
  [{name:'@nxrocks/common', path:'packages/common'}], 
  workspaceRoot);
  
execSync(
  `npx nx g @nxrocks/nx-flutter:new ${flutterapp} --template app --no-interactive --skipAdditionalPrompts=true`,
  execSyncOptions(),
);
execSync(
  `npx nx g @nxrocks/nx-flutter:new ${flutterlib} --template plugin --no-interactive --skipAdditionalPrompts=true`,
  execSyncOptions(),
);

execSync(`git commit -am "chore: scaffold projects"`, execSyncOptions());

execSync(`npx nx clean ${flutterapp}`, execSyncOptions());
execSync(`npx nx clean ${flutterlib}`, execSyncOptions());

expect(true).toBeTruthy();
}, 1500000);

});