const { createScopedReleaseConfig } = require('../../tools/release');

module.exports = createScopedReleaseConfig({
  projectScope: 'common',
  projectRoot: 'packages/common',
  buildOutput: 'dist/packages/common',
});
