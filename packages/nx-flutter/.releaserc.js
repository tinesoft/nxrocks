const { createScopedReleaseConfig } = require('../../tools/release');

module.exports = createScopedReleaseConfig({
  projectScope: 'nx-flutter',
  projectRoot: 'packages/nx-flutter',
  buildOutput: 'dist/packages/nx-flutter',
});
