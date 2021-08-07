const { getJestProjects } = require('@nrwl/jest');

module.exports = {
  projects: [
    ...getJestProjects(),
    '<rootDir>/e2e/nx-spring-boot-e2e',
    '<rootDir>/e2e/nx-flutter-e2e',
    '<rootDir>/e2e/nx-quarkus-e2e',
  ],
};
