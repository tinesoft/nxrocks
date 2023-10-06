const { readdirSync } = require('fs');
const path = require('path');

const packageScopes = [
  "smoke",
  ...(readdirSync(path.resolve(__dirname, 'packages'), { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name))
  ];

module.exports = {
  extends: ['@commitlint/config-angular'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        // Minor
        'feat',
        // Patch
        'perf',
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
        ...packageScopes,
        "release"
      ],
    ],
    'header-max-length': [2, 'always', 100],
  },
  ignores: [message => message.toLowerCase().startsWith('wip')],
};
