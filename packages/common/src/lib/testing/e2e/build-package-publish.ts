import { execSync } from 'child_process';
import { writeFileSync, remove } from 'fs-extra';
import { existsSync, readdirSync } from 'fs';

process.env.PUBLISHED_VERSION = `0.0.0-development`; // 9999.0.2

export async function buildAndPublishPackages(port = 4873) {
  process.env.npm_config_registry = `http://localhost:${port}`;
  process.env.YARN_REGISTRY = process.env.npm_config_registry;

  if (!process.env.NX_E2E_SKIP_BUILD_CLEANUP) {
    if (!process.env.CI) {
      console.log(`
  Did you know that you can run the command with:
    > NX_E2E_SKIP_BUILD_CLEANUP - saves time by reusing the previously built local packages
    > CI - simulate the CI environment settings\n`);
    }
    await Promise.all([
      remove('./dist'),
      remove('./dist/local-registry'),
    ]);
  }
  if (!process.env.NX_E2E_SKIP_BUILD_CLEANUP || !existsSync('./dist/local-registry/storage/@nxrocks')) {
    build();
    try {
      await updateVersionsAndPublishPackages();
      console.log('✨ Done publishing packages');
    } catch (e) {
      console.log(e);
      process.exit(1);
    }
  } else {
    console.log(`\n⏩ Project building skipped. Reusing the existing packages`);
  }
}

const getDirectories = (source: string) =>
  readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

async function updateVersionsAndPublishPackages() {
  const npmMajorVersion = execSync(`npm --version`)
    .toString('utf-8')
    .trim()
    .split('.')[0];

  const directories = getDirectories('./dist/packages');

  await Promise.all(
    directories.map(async (pkg) => {
      updateVersion(`./dist/packages/${pkg}`);
      publishPackage(`./dist/packages/${pkg}`, +npmMajorVersion);
    })
  );
}

function updateVersion(packagePath: string) {
  return execSync(`npm version ${process.env.PUBLISHED_VERSION} --allow-same-version`, {
    cwd: packagePath,
  });
}

async function publishPackage(packagePath: string, npmMajorVersion: number) {
  if (process.env.npm_config_registry.indexOf('http://localhost') === -1) {
    throw Error(`
      ------------------
      💣 ERROR 💣 => $NPM_REGISTRY does not look like a local registry'
      ------------------
    `);
  }
  try {
    console.log(` 📦 Publishing package '${packagePath}' to '${process.env.npm_config_registry}'...`);

    // NPM@7 requires a token to publish, thus, is just a matter of fake a token to bypass npm.
    // See: https://twitter.com/verdaccio_npm/status/1357798427283910660
    if (npmMajorVersion >= 7) {
      writeFileSync(
        `${packagePath}/.npmrc`,
        `registry=${
          process.env.npm_config_registry
        }\n${process.env.npm_config_registry.replace(
          'http:',
          ''
        )}/:_authToken=fake`
      );
    }

    execSync(`npm publish`, {
      cwd: packagePath,
      env: process.env,
      stdio: ['ignore', 'ignore', 'ignore'],
    });
  } catch (e: unknown) {
    console.log(e);
    if(e instanceof Error && e.message.indexOf('Cannot publish over existing version') > -1) {
      console.log('Version to publish already exists in registry. Ignoring');
      process.exit(0);
    } else {
      process.exit(1);
    }
  }
}

function build() {
  try {
    const startTime = new Date().getTime();
    execSync('npx nx run-many --target=build --all --parallel=8', {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, NX_INVOKED_BY_RUNNER: 'false' },
    });
    const endTime = new Date().getTime();
    console.log(`🏗 Packages built successfully in ${endTime - startTime}ms`);
  } catch (e) {
    console.log(e.output.toString());
    console.log('Build failed. See error above.');
    process.exit(1);
  }
}
