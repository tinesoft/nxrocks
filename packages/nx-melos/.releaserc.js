const { createScopedReleaseConfig } = require('../../tools/release');

module.exports = createScopedReleaseConfig({
  projectScope: 'nx-melos',
  projectRoot: 'packages/nx-melos',
  buildOutput: 'dist/packages/nx-melos',
});
