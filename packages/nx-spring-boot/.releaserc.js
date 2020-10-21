const { createReleaseConfigWithScopeFilter } = require('../../tools/release');

module.exports = createReleaseConfigWithScopeFilter({
  projectScope: 'nx-spring-boot',
  projectRoot: 'packages/nx-spring-boot',
  buildOutput: 'dist/packages/nx-spring-boot',
});
