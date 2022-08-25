# [@nxrocks/nx-spring-boot-v5.0.2](https://github.com/tinesoft/nxrocks/compare/nx-spring-boot/v5.0.1...nx-spring-boot/v5.0.2) (2022-08-25)

### Bug Fixes

- fix executor output not restored when found in Nx cache ([fbb385a](https://github.com/tinesoft/nxrocks/commit/fbb385ab2cb468c8b41b224e353d9b891bb4e48c)), closes [#111](https://github.com/tinesoft/nxrocks/issues/111)

# [@nxrocks/nx-spring-boot-v5.0.1](https://github.com/tinesoft/nxrocks/compare/nx-spring-boot/v5.0.0...nx-spring-boot/v5.0.1) (2022-08-22)

### Bug Fixes

- fix installation issue due to `hpagent` not being found ([3620d23](https://github.com/tinesoft/nxrocks/commit/3620d2329103076bbb4713bac48c4f0c734bd545)), closes [#128](https://github.com/tinesoft/nxrocks/issues/128)

# [@nxrocks/nx-spring-boot-v5.0.0](https://github.com/tinesoft/nxrocks/compare/nx-spring-boot/v4.1.0...nx-spring-boot/v5.0.0) (2022-08-21)

### Bug Fixes

- **nx-spring-boot:** fix `serve` and `apply-format` alias executors ([29f5183](https://github.com/tinesoft/nxrocks/commit/29f5183ff00efcd62916a0dcefff005ab9659bdc))
- **nx-spring-boot:** fix creating spring boot libraries with `gradle` ([500a7d0](https://github.com/tinesoft/nxrocks/commit/500a7d04f09b843014329990c8e0644fa60d35f2))
- **nx-spring-boot:** fix library projects should not be executable ([b118a4e](https://github.com/tinesoft/nxrocks/commit/b118a4e414d3dcae0f81cec3e366ce2096aa34e3)), closes [#113](https://github.com/tinesoft/nxrocks/issues/113)
- set `@nrwl/*` packages as `peerDependencies` ([d03b709](https://github.com/tinesoft/nxrocks/commit/d03b70983f278a86c19c8fa28d99603682cad2cd)), closes [#106](https://github.com/tinesoft/nxrocks/issues/106)

### Features

- **nx-spring-boot:** add proxy support for project generation ([bd3ac7e](https://github.com/tinesoft/nxrocks/commit/bd3ac7e7c577714df272c1fa972c1d0280b91c14)), closes [#125](https://github.com/tinesoft/nxrocks/issues/125)
- **nx-spring-boot:** add `install` executor + make `build` depend on it ([68e1a5e](https://github.com/tinesoft/nxrocks/commit/68e1a5ef5ed266c65ee348c6ced022f87edb1fb7)), closes [#65](https://github.com/tinesoft/nxrocks/issues/65) [#66](https://github.com/tinesoft/nxrocks/issues/66) [#71](https://github.com/tinesoft/nxrocks/issues/71)
- **nx-spring-boot:** add `skipFormat` to control code formatting ([8bff29b](https://github.com/tinesoft/nxrocks/commit/8bff29bf849138cea75a0cbf09e5d164a732e470))
- **nx-spring-boot:** check if source is a valid boot project on linking ([f74e524](https://github.com/tinesoft/nxrocks/commit/f74e5248c6a86296e7f9757d1349f9e166ec529f))
- **nx-spring-boot:** improve logging when project zip can't be fetched ([f1a5229](https://github.com/tinesoft/nxrocks/commit/f1a52297d5c2ca636b1cefd57aad018ba7108055))
- **nx-spring-boot:** make `build` executor results cacheable ([4528715](https://github.com/tinesoft/nxrocks/commit/45287156e1c85f29b27edb53d8fb14ad04a74ecc))
- **nx-spring-boot:** rename executors to use `kebab-case` ([1e5d9f4](https://github.com/tinesoft/nxrocks/commit/1e5d9f4f3e41853afd00c6756e8841028800c280)), closes [#117](https://github.com/tinesoft/nxrocks/issues/117)
- **nx-spring-boot:** unselect by default adding code formatting support ([005ad95](https://github.com/tinesoft/nxrocks/commit/005ad950d75d2886f62847cfcb1ef51abb1942a0))

### BREAKING CHANGES

- **nx-spring-boot:** `format-check` executor was renamed into `check-format`
- **nx-spring-boot:** All executors of this plugin now use `kebab-case` over `camelCase` for consistency

This only affect `buildImage` and `buildInfo` executors, which have been renamed into `build-image` and `build-info` respectively.

# [@nxrocks/nx-spring-boot-v4.1.0](https://github.com/tinesoft/nxrocks/compare/nx-spring-boot/v4.0.2...nx-spring-boot/v4.1.0) (2022-06-21)

### Bug Fixes

- **nx-spring-boot:** fix `Premature close` error when generating project ([f6b433d](https://github.com/tinesoft/nxrocks/commit/f6b433d458b0f94c297b4581cd18f0bef3c0c5e6)), closes [#97](https://github.com/tinesoft/nxrocks/issues/97)
- **nx-spring-boot:** fix generation error when setting `javaVersion` ([364b228](https://github.com/tinesoft/nxrocks/commit/364b22885e74706fd3f6d10323325323439aa2f1)), closes [#98](https://github.com/tinesoft/nxrocks/issues/98)

### Features

- **nx-spring-boot:** add `link` generator to link projects implicitly ([1142d04](https://github.com/tinesoft/nxrocks/commit/1142d0438a1c2d28668efcdce8804c43bef56717))
- **nx-spring-boot:** add support for Java 18 ([6dd94e1](https://github.com/tinesoft/nxrocks/commit/6dd94e1a34a2d5a597284332b0eac66c569fa559))

# [@nxrocks/nx-spring-boot-v4.0.2](https://github.com/tinesoft/nxrocks/compare/nx-spring-boot/v4.0.1...nx-spring-boot/v4.0.2) (2022-02-16)

### Bug Fixes

- wrong `@nxrocks/common` version referenced in dependent packages ([1b4b0e6](https://github.com/tinesoft/nxrocks/commit/1b4b0e6b1df604177585e703e092cf3652ef86b0))

# [@nxrocks/nx-spring-boot-v4.0.1](https://github.com/tinesoft/nxrocks/compare/nx-spring-boot/v4.0.0...nx-spring-boot/v4.0.1) (2022-02-15)

### Bug Fixes

- include updated `package.json` in git when semantic releasing ([cb87139](https://github.com/tinesoft/nxrocks/commit/cb87139c95ba2f7256a8df7ff0c94410394ccb4f))

# [@nxrocks/nx-spring-boot-v4.0.0](https://github.com/tinesoft/nxrocks/compare/nx-spring-boot/v3.0.0...nx-spring-boot/v4.0.0) (2022-02-14)

### Bug Fixes

- **nx-spring-boot:** remove `ratchetFrom` from the default Spotless conf ([1462022](https://github.com/tinesoft/nxrocks/commit/1462022a22eb4714bb590b7b18b3addb8643387e))

### Features

- **nx-spring-boot:** add java 17 support to align w/ Spring Initializr ([131df91](https://github.com/tinesoft/nxrocks/commit/131df91c89ece06ddfae7eb93d1ace2cccad0cc9))
- **nx-spring-boot:** add `format-check` executor to check code format ([337fca8](https://github.com/tinesoft/nxrocks/commit/337fca8356fba17a1ff54e32204a6d4351d63f8c))
- **nx-spring-boot:** add `format` executor ([b5362ae](https://github.com/tinesoft/nxrocks/commit/b5362ae72fcec47be07df22df3e3ec3e9f047e9a))
- **nx-spring-boot:** add aliases for the format executor ([cbcee00](https://github.com/tinesoft/nxrocks/commit/cbcee00da217a4b609efeecfa80c2d16bd44e170))
- **nx-spring-boot:** merge `buildJar` and `buildWar` executors ([9fdfec2](https://github.com/tinesoft/nxrocks/commit/9fdfec2c629fd11c8e266ee81567196e6178136a)), closes [#43](https://github.com/tinesoft/nxrocks/issues/43)

### BREAKING CHANGES

- **nx-spring-boot:** `build` is now the only executor to use to build the final jar or war

# [@nxrocks/nx-spring-boot-v3.0.0](https://github.com/tinesoft/nxrocks/compare/nx-spring-boot/v2.1.0...nx-spring-boot/v3.0.0) (2021-08-23)

### Bug Fixes

- **nx-spring-boot:** add plugin to nx.json only if not included already ([15511ae](https://github.com/tinesoft/nxrocks/commit/15511ae8ebdbc4d8cd412afd266457cf08b14f72))
- correct `TypeError: builder.getProjectGraph is not a function` ([3458f66](https://github.com/tinesoft/nxrocks/commit/3458f668f6f3420140fef25f908b08c26511f433)), closes [#72](https://github.com/tinesoft/nxrocks/issues/72)

### Features

- **nx-spring-boot:** improve detection of boot projects in workspace ([bfb99ed](https://github.com/tinesoft/nxrocks/commit/bfb99ed2e18e1dfe38d424f7763583831dae9bc2))
- **nx-spring-boot:** make jar of `library` projects not executable ([1e2984f](https://github.com/tinesoft/nxrocks/commit/1e2984ff00ca2f94ffbc07b94de26c476b14e500)), closes [#67](https://github.com/tinesoft/nxrocks/issues/67)
- **nx-spring-boot:** use `NX_VERBOSE_LOGGING` to control dep graph logs ([ed9e444](https://github.com/tinesoft/nxrocks/commit/ed9e444488aeb9dbe86338d3e894bae85029663f)), closes [#68](https://github.com/tinesoft/nxrocks/issues/68)

### BREAKING CHANGES

- Nx v12.6.x is now the minimum version required to use the plugins

This is due to breaking changes in DevKit's project graph API starting from v12.6.x

# [@nxrocks/nx-spring-boot-v2.1.0](https://github.com/tinesoft/nxrocks/compare/nx-spring-boot/v2.0.1...nx-spring-boot/v2.1.0) (2021-04-26)

### Features

- **nx-spring-boot:** add support for Nx's dependency graph generation ([95abe9d](https://github.com/tinesoft/nxrocks/commit/95abe9d297d166199f3ab1e6c761efdeffca02d0))

# [@nxrocks/nx-spring-boot-v2.0.1](https://github.com/tinesoft/nxrocks/compare/nx-spring-boot/v2.0.0...nx-spring-boot/v2.0.1) (2021-04-06)

### Bug Fixes

- **nx-spring-boot:** set correct path for executors ([89e16d3](https://github.com/tinesoft/nxrocks/commit/89e16d37c329965a61b4812cde1d3155ac8e2827))

# [@nxrocks/nx-spring-boot-v2.0.0](https://github.com/tinesoft/nxrocks/compare/nx-spring-boot/v1.3.1...nx-spring-boot/v2.0.0) (2021-04-02)

### Bug Fixes

- **nx-spring-boot:** correct wrong extension for `gradlew` on windows ([77899ce](https://github.com/tinesoft/nxrocks/commit/77899ceeac48fb9321b3b07b81958c8dbb1c078d))
- **nx-spring-boot:** remove extra char in `dependencies` prompt ([5bc0290](https://github.com/tinesoft/nxrocks/commit/5bc0290601b5b3815de9a95125c551c4f9448997))

### Features

- **nx-spring-boot:** add java 16 support to align w/ Spring Initializr ([89c1d1e](https://github.com/tinesoft/nxrocks/commit/89c1d1eb2eb91f317ac0adf7643f87db05db68e1))
- **nx-spring-boot:** allow generating `application` or `library` ([530186c](https://github.com/tinesoft/nxrocks/commit/530186c66ea65e621cb8e63c08e5281705209130))
- **nx-spring-boot:** migrate to Nrwl's DevKit executors/generators API ([47231fd](https://github.com/tinesoft/nxrocks/commit/47231fd9a2a9791e929837144b4dbf080be0385f))
- **nx-spring-boot:** rename the `application` generator into `project` ([05b5272](https://github.com/tinesoft/nxrocks/commit/05b5272bdffbc38644d8c5999f5965f6f64df531))

### BREAKING CHANGES

- **nx-spring-boot:** the `app` alias has been replaced with one of [`proj`, `new`, `gen`, `init`, `create`, `generate`].
- **nx-spring-boot:** Nx workspace v11 is now the minimum version required to use this plugin.

In fact, all executors/schematics have been rewritten into executors/generators using its new `@nrwl/devkit` API.

# [@nxrocks/nx-spring-boot-v2.0.0-beta.1](https://github.com/tinesoft/nxrocks/compare/nx-spring-boot/v1.3.1...nx-spring-boot/v2.0.0-beta.1) (2021-04-02)

### Bug Fixes

- **nx-spring-boot:** correct wrong extension for `gradlew` on windows ([77899ce](https://github.com/tinesoft/nxrocks/commit/77899ceeac48fb9321b3b07b81958c8dbb1c078d))
- **nx-spring-boot:** remove extra char in `dependencies` prompt ([5bc0290](https://github.com/tinesoft/nxrocks/commit/5bc0290601b5b3815de9a95125c551c4f9448997))

### Features

- **nx-spring-boot:** add java 16 support to align w/ Spring Initializr ([89c1d1e](https://github.com/tinesoft/nxrocks/commit/89c1d1eb2eb91f317ac0adf7643f87db05db68e1))
- **nx-spring-boot:** allow generating `application` or `library` ([530186c](https://github.com/tinesoft/nxrocks/commit/530186c66ea65e621cb8e63c08e5281705209130))
- **nx-spring-boot:** migrate to Nrwl's DevKit executors/generators API ([47231fd](https://github.com/tinesoft/nxrocks/commit/47231fd9a2a9791e929837144b4dbf080be0385f))
- **nx-spring-boot:** rename the `application` generator into `project` ([05b5272](https://github.com/tinesoft/nxrocks/commit/05b5272bdffbc38644d8c5999f5965f6f64df531))

### BREAKING CHANGES

- **nx-spring-boot:** the `app` alias has been replaced with one of [`proj`, `new`, `gen`, `init`, `create`, `generate`].
- **nx-spring-boot:** Nx workspace v11 is now the minimum version required to use this plugin.

In fact, all executors/schematics have been rewritten into executors/generators using its new `@nrwl/devkit` API.

## [1.3.1](https://github.com/tinesoft/nxrocks/compare/nx-spring-boot/v1.3.0...nx-spring-boot/v1.3.1) (2021-02-08)

### Bug Fixes

- **nx-spring-boot:** always restore executable permissions on wrappers ([b9875d8](https://github.com/tinesoft/nxrocks/commit/b9875d879198a0a613041b00720c77923b54c6c1))
- **nx-spring-boot:** correct error when executing executors on Windows ([1a744ab](https://github.com/tinesoft/nxrocks/commit/1a744abf67cd07d0ebd259f12c4c02fc2bd8bdaa)), closes [#38](https://github.com/tinesoft/nxrocks/issues/38)
- **nx-spring-boot:** correct generation issue on Nx workspaces >=v11.2.0 ([d3c3816](https://github.com/tinesoft/nxrocks/commit/d3c3816fd739aa5f42133d05644e972d003c43ff)), closes [#37](https://github.com/tinesoft/nxrocks/issues/37)

# [1.3.0](https://github.com/tinesoft/nxrocks/compare/nx-spring-boot/v1.2.1...nx-spring-boot/v1.3.0) (2021-02-01)

### Features

- **nx-spring-boot:** add `clean` builder ([33a1435](https://github.com/tinesoft/nxrocks/commit/33a1435a298cf56568bcd2ea2ed11030e0a1c780))
- **nx-spring-boot:** add `ignoreWrapper` option to all executors ([e045bca](https://github.com/tinesoft/nxrocks/commit/e045bca8d89a68770bf9977c9bddedc65cdbf488)), closes [#31](https://github.com/tinesoft/nxrocks/issues/31)
- **nx-spring-boot:** add `test` builder ([e257d27](https://github.com/tinesoft/nxrocks/commit/e257d273f4d7d17a837d38390c6e6045d3685521)), closes [#30](https://github.com/tinesoft/nxrocks/issues/30)
- **nx-spring-boot:** better determine the underlying build system ([0edfe51](https://github.com/tinesoft/nxrocks/commit/0edfe51e2633ceb9b7491f88c9b1640f2fdd04b0))

## [1.2.1](https://github.com/tinesoft/nxrocks/compare/nx-spring-boot/v1.2.0...nx-spring-boot/v1.2.1) (2021-01-03)

### Bug Fixes

- **nx-spring-boot:** some user options were not used during generation ([6813e7d](https://github.com/tinesoft/nxrocks/commit/6813e7d62f4919fe616b52fc2903ca4a6129a50a)), closes [#17](https://github.com/tinesoft/nxrocks/issues/17)

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

- **nx-spring-boot:** fix wrong 'cwd' used to execute executors commands ([b39e7e7](https://github.com/tinesoft/nxrocks/commit/b39e7e7a6d6266939ce153ad97b121573372a74b))
- **nx-spring-boot:** make executors executable platform independant ([b27bc4c](https://github.com/tinesoft/nxrocks/commit/b27bc4cc81454727bc15f12e896756a679ecd845))

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
- **nx-spring-boot:** add executors for run, buildJar/War, buildImage and buildInfo commands ([5c75781](https://github.com/tinesoft/nxrocks/commit/5c757815c2a07231d49d66f4da44c1ffe268efe7))
- **nx-spring-boot:** add support for additional params for `buildJar` and `buildWar` executors ([b85ad9c](https://github.com/tinesoft/nxrocks/commit/b85ad9cdd401e9fb98a9992877f9cc56c76f199d))
- **nx-spring-boot:** add support for additional params for `run` and `buildImage` executors ([1d9fbb3](https://github.com/tinesoft/nxrocks/commit/1d9fbb3b232e1ea662376dd02650ec875b0807a7))
