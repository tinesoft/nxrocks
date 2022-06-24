const { createScopedReleaseConfig } = require('../../tools/release');

module.exports = createScopedReleaseConfig({
  projectScope: 'nx-micronaut',
  projectRoot: 'packages/nx-micronaut',
  buildOutput: 'dist/packages/nx-micronaut',
});
