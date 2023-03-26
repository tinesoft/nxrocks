
const formatFile = file => `nx format:write --files ${file}`;
const copyFile = (file, dest) => `cp ${file} ${dest}`;

module.exports = {
  changelog: true,
  npm: true,
  github: true,
  repositoryUrl: "https://github.com/tinesoft/nxrocks",
  branches: [
    'master',
    'main',
    'next',
    { name: 'beta', prerelease: true },
    { name: 'alpha', prerelease: true },
  ],
  commitMessage: "chore(release): 🚀 release ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
  tagFormat: "${PROJECT_NAME}/v${VERSION}",
  plugins: [
    [
      '@semantic-release/exec',
      {
        prepareCmd: [
          formatFile('packages/${PROJECT_NAME}/CHANGELOG.md'),
          copyFile('packages/${PROJECT_NAME}/CHANGELOG.md', 'dist/packages/${PROJECT_NAME}'),
          copyFile('packages/${PROJECT_NAME}/README.md', 'dist/packages/${PROJECT_NAME}'),
          copyFile(`LICENSE`, 'dist/packages/${PROJECT_NAME}'),
        ].join(' && '),
        execCwd: '${WORKSPACE_DIR}'
      },
    ],
  ],
  buildTarget: "${PROJECT_NAME}:build",
  outputPath: '${WORKSPACE_DIR}/dist/packages/${PROJECT_NAME}'
}
