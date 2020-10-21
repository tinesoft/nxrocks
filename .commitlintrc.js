module.exports = {
  extends: ['@commitlint/config-angular'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        // Minor
        'feat',
        'perf',
        // Patch
        'fix',
        // None
        'chore',
        'ci',
        'revert',
        'test',
        'docs',
        'build',
        'refactor'
      ],
    ],
    'scope-empty': [0],
    'scope-enum': [
      2,
      'always',
      // prettier-ignore
      [
        'nx-spring-boot'
      ],
    ],
  },
  ignores: [message => message.toLowerCase().startsWith('wip')],
};
