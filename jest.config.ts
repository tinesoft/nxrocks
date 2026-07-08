import type { Config } from 'jest';
const { getJestProjectsAsync } = require('@nx/jest');

const getJestConfig = async (): Promise<Config> => ({
  projects: await getJestProjectsAsync(),
});

module.exports = getJestConfig;
