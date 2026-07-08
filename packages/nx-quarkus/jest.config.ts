import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Reading the SWC compilation config for the spec files
const swcJestConfig = JSON.parse(
  readFileSync(fileURLToPath(new URL('.spec.swcrc', import.meta.url)), 'utf-8')
);

// Disable .swcrc look-up by SWC core because we're passing in swcJestConfig ourselves
swcJestConfig.swcrc = false;

export default {
  displayName: 'nx-quarkus',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['@swc/jest', swcJestConfig],
  },
  transformIgnorePatterns: ['/node_modules/(?!@nxrocks)'],
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: 'test-output/jest/coverage',
};
