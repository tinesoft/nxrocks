
const buildReversePath = path =>
  path
    .split('/')
    .map(() => '..')
    .join('/');

const formatFile = file => `nx format:write --files ${file}`;
const copyFile = (file, dest) => `cp ${file} ${dest}`;


function createScopedReleaseConfig({
  projectScope,
  projectRoot,
  buildOutput,
}) {
  projectRoot = projectRoot || `packages/${projectScope}`;
  buildOutput = buildOutput || `dist/packages/${projectScope}`;

  const relativeWorkspaceRoot = buildReversePath(projectRoot);
  const relativeBuildOutput = `${relativeWorkspaceRoot}/${buildOutput}`;

  const releaseCommit = `chore(${projectScope}): 🚀 release \${nextRelease.version}\n\n\${nextRelease.notes}\n\n***\n[skip ci]`;
  return {
    extends: 'semantic-release-monorepo',
    preset: 'angular',
    plugins: [
      '@semantic-release/commit-analyzer',
      [
        '@semantic-release/release-notes-generator', 
        {
          writerOpts: {
            commitsSort: ['subject', 'scope']
          }
        }
      ],
      '@semantic-release/changelog',
      '@semantic-release/github',
      ['@semantic-release/npm', { pkgRoot: relativeBuildOutput }],
      [
        '@semantic-release/exec',
        {
          prepareCmd: [
            formatFile(`${projectRoot}/CHANGELOG.md`),
            copyFile(`${projectRoot}/CHANGELOG.md`, buildOutput),
            copyFile(`${projectRoot}/RELEASE.md`, buildOutput),
            copyFile(`${projectRoot}/package.json`, buildOutput),
            copyFile(`LICENSE`, buildOutput),
          ].join(' && '),
          execCwd: relativeWorkspaceRoot,
        },
      ],
      [
        '@semantic-release/git',
        {
          message: releaseCommit,
        },
      ],
    ],
    tagFormat: `${projectScope}/v\${version}`
  };
}

module.exports = {
  createScopedReleaseConfig,
};
