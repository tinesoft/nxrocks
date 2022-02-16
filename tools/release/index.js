
const buildReversePath = path =>
  path
    .split('/')
    .map(() => '..')
    .join('/');

const toolsScript = (script, ...args) =>
  [
    'ts-node',
    '--project tools/tsconfig.tools.json',
    `tools/${script}`,
    ...args,
  ].join(' ');

const formatFile = file => `nx format:write --files ${file}`;
const copyFile = (file, dest) => `cp ${file} ${dest}`;
const patchVersions = () => toolsScript('release/patch-versions.ts');

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
      '@semantic-release/release-notes-generator', 
      '@semantic-release/changelog',
      '@semantic-release/github',
      ['@semantic-release/npm', { pkgRoot: relativeBuildOutput }],
      [
        '@semantic-release/exec',
        {
          prepareCmd: [
            formatFile(`${projectRoot}/CHANGELOG.md`),
            copyFile(`${projectRoot}/CHANGELOG.md`, buildOutput),
            copyFile(`${projectRoot}/README.md`, buildOutput),
            copyFile(`LICENSE`, buildOutput),
            patchVersions(),
          ].join(' && '),
          execCwd: relativeWorkspaceRoot,
        },
      ],
      [
        '@semantic-release/git',
        {
          assets: ["package.json", "CHANGELOG.md"],
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
