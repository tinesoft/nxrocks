import { join, resolve } from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';

interface PackageJson {
  name: string;
  version: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

/**
 * Read the version number for a specific package
 * from a parsed "package.json".
 */
function getPackageVersion(
  packageName: string,
  packageJson: PackageJson,
): string | undefined {
  if (packageName === packageJson.name) {
    return packageJson.version;
  }

  return (
    (packageJson.dependencies && packageJson.dependencies[packageName]) ||
    (packageJson.devDependencies && packageJson.devDependencies[packageName]) ||
    (packageJson.peerDependencies && packageJson.peerDependencies[packageName])
  );
}

/**
 * Insert a specific package version as replacement for a wildcard.
 */
function replacePackageVersion(
  packageName: string,
  packageVersion: string,
  versionsJs: string,
): string {
  return versionsJs.replace(
    `'${packageName}': '*'`,
    `'${packageName}': '${packageVersion}'`,
  );
}

/**
 * Replace wildcard versions in "src/utils/versions.js"
 * with specific version numbers based on the "package.json"
 * in provided package root path.
 */
async function insertVersions(packageRoot: string) {
  const resolvedPackageRoot = resolve(packageRoot);

  const packageJsonPath = join(resolvedPackageRoot, 'package.json');
  const versionsJsPath = join(
    resolvedPackageRoot,
    'src',
    'utils',
    'versions.js',
  );

  if (!existsSync(packageJsonPath)) {
    throw new Error(
      `No package.json found in package directory: ${resolvedPackageRoot}`,
    );
  }
  if (!existsSync(versionsJsPath)) {
    console.info(`No version number utility file found: ${versionsJsPath}`);
    return;
  }

  const packageJson = await import(packageJsonPath);
  const { versions } = await import(versionsJsPath);
  const packages = Object.keys(versions);

  const originalVersionsJs = readFileSync(versionsJsPath, 'utf8');

  const updatedVersionsJs = packages.reduce((versionsJs, packageName) => {
    const packageVersion = getPackageVersion(packageName, packageJson);
    if (!packageVersion) {
      return versionsJs;
    }
    return replacePackageVersion(packageName, packageVersion, versionsJs);
  }, originalVersionsJs);

  writeFileSync(versionsJsPath, updatedVersionsJs);
}

const packagePath = process.argv[2];
insertVersions(packagePath).catch(console.error);
