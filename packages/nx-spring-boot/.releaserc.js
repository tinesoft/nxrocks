const { createScopedReleaseConfig } = require('../../tools/release');

module.exports = createScopedReleaseConfig({
  projectScope: 'nx-spring-boot',
  projectRoot: 'packages/nx-spring-boot',
  buildOutput: 'dist/packages/nx-spring-boot',
});
