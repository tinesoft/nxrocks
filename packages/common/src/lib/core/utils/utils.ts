import { execSync } from 'child_process';

export function getPackageLatestNpmVersion(pkg: string): string {
  try {
    return execSync(`npm show ${pkg} version`, {
      stdio: 'ignore',
    }).toString().trim() || 'latest';
  } catch (e) {
    return 'latest';
  }
}
