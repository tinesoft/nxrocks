const { getJestProjects } = require('@nrwl/jest');

export default {
  projects: [
    ...getJestProjects(),
    '<rootDir>/e2e/nx-flutter-e2e'
  ],
};
