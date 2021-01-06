const { createReleaseConfigWithScopeFilter } = require('../../tools/release');

module.exports = createReleaseConfigWithScopeFilter({
  projectScope: 'nx-flutter',
  projectRoot: 'packages/nx-flutter',
  buildOutput: 'dist/packages/nx-flutter',
});
