const { getJestProjects } = require('@nrwl/jest');

export default {
  projects: [
    ...getJestProjects(),
    '<rootDir>/e2e/nx-spring-boot-e2e',
    '<rootDir>/e2e/nx-flutter-e2e',
    '<rootDir>/e2e/nx-quarkus-e2e',
  ],
};
