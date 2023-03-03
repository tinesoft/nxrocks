import { workspaceRoot } from '@nrwl/tao/src/utils/app-root';

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

export function patchSemanticReleaseMonorepo() {
  // patch the check from `semantic-release-monorepo` to also include scopeless commits 
  const fileToPatch = 'node_modules/semantic-release-monorepo/src/only-package-commits.js';
  const onlyPackageCommitsJs = readFileSync(join(workspaceRoot, fileToPatch), 'utf8');
  const patchedFile = onlyPackageCommitsJs

    .replace('  return commitsWithFiles.filter(({ files, subject }) => {', '  return commitsWithFiles.filter(async ({ files, subject }) => {')
    .replace(
      `    if (packageFile) {
      debug(
        'Including commit "%s" because it modified package file "%s".',
        subject,
        packageFile
      );
    }

    return !!packageFile;`,

      `    // attempt 1:  check if the commit must be included because it modified a direct file in the package
    if (packageFile) {
      debug(
        'Including commit "%s" because it modified package file "%s".',
        subject,
        packageFile
      );
      return true;
    }

    // attempt 2:  check if the commit must be included because no scope was specified
    const isScopelessCommit = /^[a-z]+\:/.test(subject);
    if (isScopelessCommit) {
      debug(
        'Including commit "%s" because it had no specific scope.',
        subject
      );
      return true;
    }

    // attempt 3:  check if the commit must be included because it modifed a file in a dependent package (like in 'common')
    const scopePkg = packageSegments[1];
    const commitScopePkg = /^[a-z]+\(([^)]+)\):/.exec(subject)?.[1];
    const depGraph = JSON.parse(require('fs').readFileSync(path.resolve(await getRoot(), 'dist', 'deps.json'))).graph;
    const isDependentCommit = depGraph.dependencies[scopePkg]?.some((depPkg) => depPkg.target === commitScopePkg );
    if(isDependentCommit){
      debug(
        'Including commit "%s" because it modified file "%s" from dependent package "*s".',
        subject,
        packageFile,
        commitScopePkg
      );
      return true;
    }

    return false;`);

  writeFileSync(join(workspaceRoot, fileToPatch), patchedFile);
}