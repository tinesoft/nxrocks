const { createScopedReleaseConfig } = require('../../tools/release');

module.exports = createScopedReleaseConfig({
  projectScope: 'nx-quarkus',
  projectRoot: 'packages/nx-quarkus',
  buildOutput: 'dist/packages/nx-quarkus',
});
