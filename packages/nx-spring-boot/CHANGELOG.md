# [1.2.0](https://github.com/tinesoft/nxrocks/compare/nx-spring-boot/v1.1.0...nx-spring-boot/v1.2.0) (2020-12-22)

### Bug Fixes

- **nx-spring-boot:** fix error when generating a gradle/kotlin project ([abfbd04](https://github.com/tinesoft/nxrocks/commit/abfbd04bb97e5197bd60643e1a5adc4c16c3a5d5)), closes [#15](https://github.com/tinesoft/nxrocks/issues/15)

### Features

- **nx-spring-boot:** add `User-Agent` header to requests to Initializr ([4c7f345](https://github.com/tinesoft/nxrocks/commit/4c7f345a0c9e1e73dded4731cca50adaeb10f8d3)), closes [#11](https://github.com/tinesoft/nxrocks/issues/11)

# [1.1.0](https://github.com/tinesoft/nxrocks/compare/nx-spring-boot/v1.0.0...nx-spring-boot/v1.1.0) (2020-10-31)

### Bug Fixes

- **nx-spring-boot:** fix prompts not working generating the application ([b96e1ce](https://github.com/tinesoft/nxrocks/commit/b96e1ceb304ae70d0d91eb42507210199adf8de0)), closes [#6](https://github.com/tinesoft/nxrocks/issues/6)

### Features

- **nx-spring-boot:** add `serve` builder (alias to `run` builder) ([16dfdb4](https://github.com/tinesoft/nxrocks/commit/16dfdb4e662d8b6904db98030f0abcbfefaf634a)), closes [#8](https://github.com/tinesoft/nxrocks/issues/8)

# 1.0.0 (2020-10-25)

### Bug Fixes

- **nx-spring-boot:** fix wrong 'cwd' used to execute builders commands ([b39e7e7](https://github.com/tinesoft/nxrocks/commit/b39e7e7a6d6266939ce153ad97b121573372a74b))
- **nx-spring-boot:** make builders executable platform independant ([b27bc4c](https://github.com/tinesoft/nxrocks/commit/b27bc4cc81454727bc15f12e896756a679ecd845))

### Build System

- add github actions to run unit/e2e tests ([91335e2](https://github.com/tinesoft/nxrocks/commit/91335e29ed1317b467e872bef90b3139f1596506))
- make `develop` the target branch to trigger tests with github actions ([7926a6d](https://github.com/tinesoft/nxrocks/commit/7926a6d61ae20b17e6021d33e19a2a1959fd1988))

### Chores

- add `semantic-release` config ([2893599](https://github.com/tinesoft/nxrocks/commit/28935997556a5e511832f248f8291d8c5680b417))
- add github files for contributing, submitting issues or PRs ([4d53d28](https://github.com/tinesoft/nxrocks/commit/4d53d2850ccd95412afab10e66e7e421eac2e3a0))
- fix npm release error due to 1st publication of scoped package ([227ecf7](https://github.com/tinesoft/nxrocks/commit/227ecf7a1283c1e266d709ffc468abb3ac05472e))
- **nx-spring-boot:** add keywords section in `package.json` ([a17c107](https://github.com/tinesoft/nxrocks/commit/a17c107961122e1a046b93065744cc46437cd80d))
- initial commit ([197eb35](https://github.com/tinesoft/nxrocks/commit/197eb355f0dd2f467d3a68d24dcb6784a02706c8))
- replace `npm` by `Yarn` ( npm not yet fully supported by Nx for tests) ([6a45f87](https://github.com/tinesoft/nxrocks/commit/6a45f87ed8f09530f6a5ca6140f3711998031466))
- replace yarn by npm ([53f95bc](https://github.com/tinesoft/nxrocks/commit/53f95bcfd435c61f0e5dcd071705900bf6681cbb))
- setup nx-cloud to speed up builds ([1c83685](https://github.com/tinesoft/nxrocks/commit/1c836852d16aa6d5f1ae15cf74596d56b3865e4b))

### Documentation

- **nx-spring-boot:** update plugin `README.md` ([80fd624](https://github.com/tinesoft/nxrocks/commit/80fd6242de179b2f6f69ba8d58b2a694447440df))
- **nx-spring-boot:** update readme ([92a6bee](https://github.com/tinesoft/nxrocks/commit/92a6bee3b91f32d032313ebea34717e0e0cd48b3))
- update project 's readme ([34865f6](https://github.com/tinesoft/nxrocks/commit/34865f69bbbdeb939843133b3eaf679dc52bacab))

### Features

- **nx-spring-boot:** add `application` schematics ([f22e63f](https://github.com/tinesoft/nxrocks/commit/f22e63f1f133d92907cf457a8d817a5e9df13dfe))
- **nx-spring-boot:** add builders for run, buildJar/War, buildImage and buildInfo commands ([5c75781](https://github.com/tinesoft/nxrocks/commit/5c757815c2a07231d49d66f4da44c1ffe268efe7))
- **nx-spring-boot:** add support for additional params for `buildJar` and `buildWar` builders ([b85ad9c](https://github.com/tinesoft/nxrocks/commit/b85ad9cdd401e9fb98a9992877f9cc56c76f199d))
- **nx-spring-boot:** add support for additional params for `run` and `buildImage` builders ([1d9fbb3](https://github.com/tinesoft/nxrocks/commit/1d9fbb3b232e1ea662376dd02650ec875b0807a7))
