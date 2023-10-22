# [6.1.0](https://github.com/tinesoft/nxrocks/compare/nx-quarkus/v6.0.3...nx-quarkus/v6.1.0) (2023-10-08)


### Bug Fixes

* **common:** fix ProjectGraph for `Gradle` multi-module projects ([0ef0d17](https://github.com/tinesoft/nxrocks/commit/0ef0d1736fe100002ab2d547b830ab9de0e42a19))


### Features

* **common-cli:** add `common-cli` to share code among our `create-*` CLI packages ([bcb5fd2](https://github.com/tinesoft/nxrocks/commit/bcb5fd2a0cda945b708fb0e42195bde82cac47c7))
* **common:** add utilities for multi-module `maven`/`gradle` projects ([f2e4939](https://github.com/tinesoft/nxrocks/commit/f2e49396bd5fec312c401040c5511567a092a18c))
* **common:** add utilities to add `maven`/`gradle` modules ([2237201](https://github.com/tinesoft/nxrocks/commit/2237201646307ade853c180f5b25e9e2e56e5ad7))
* **create-nx-quarkus:** add custom CLI to create Quarkus projects ([7c6dae3](https://github.com/tinesoft/nxrocks/commit/7c6dae368e8ea4b3d81e3a1ec9070e6eb16ff13b))
* **create-nx-spring-boot:** add custom CLI to create Spring Boot projects ([32ca53c](https://github.com/tinesoft/nxrocks/commit/32ca53c61cc1c25027d72434e13b71ec1a100acb))
* **nx-quarkus:** add support for creating multi-modules projects ([e8094f7](https://github.com/tinesoft/nxrocks/commit/e8094f7632ad2a19a943fcb0eeb3a8f63fc310ab))
* **nx-spring-boot:** add support for creating multi-modules projects ([7c2de5a](https://github.com/tinesoft/nxrocks/commit/7c2de5a07f92fad481f3bda5ce61a71ba78c89c0))
* update dependencies and fix lint issues ([cfac383](https://github.com/tinesoft/nxrocks/commit/cfac383c7d2aebd329a98f410df66b726b64d28a))

## [6.0.3](https://github.com/tinesoft/nxrocks/compare/nx-quarkus/v6.0.2...nx-quarkus/v6.0.3) (2023-05-12)


### Bug Fixes

* **common:** fix dependency graph generation failure on `windows` OS ([26ef7c4](https://github.com/tinesoft/nxrocks/commit/26ef7c476cd4bc158b4df818a84be428a25c6adc)), closes [#170](https://github.com/tinesoft/nxrocks/issues/170)
* **common:** fix deprecated usage of dependency graph API ([badf089](https://github.com/tinesoft/nxrocks/commit/badf089040b31682df94c97818bf7e96201d42f9))

## [6.0.2](https://github.com/tinesoft/nxrocks/compare/nx-quarkus/v6.0.1...nx-quarkus/v6.0.2) (2023-05-06)


### Bug Fixes

* loosen `peerDependencies` on `@nx/*` to support v16.0.0 AND higher ([fb2f8df](https://github.com/tinesoft/nxrocks/commit/fb2f8df907fe9a498cc310862f08571e6c87dd6b))

## [6.0.1](https://github.com/tinesoft/nxrocks/compare/nx-quarkus/v6.0.0...nx-quarkus/v6.0.1) (2023-05-04)


### Bug Fixes

* **common:** bump version of `@nxrocks/common` for Nx 16 support ([980a86f](https://github.com/tinesoft/nxrocks/commit/980a86fe0ee16e7d0efb5578b3eef45a00ac9654)), closes [#169](https://github.com/tinesoft/nxrocks/issues/169)

# [6.0.0](https://github.com/tinesoft/nxrocks/compare/nx-quarkus/v5.0.0...nx-quarkus/v6.0.0) (2023-05-03)


### Features

* update to Nx workspace `v16.0.0` ([ab11ea8](https://github.com/tinesoft/nxrocks/commit/ab11ea89becafa9555f43527c95167827089a6e6))


### BREAKING CHANGES

* Nx `v16.x.x` is now the minimum required version to use the plugin

# [5.0.0](https://github.com/tinesoft/nxrocks/compare/nx-quarkus/v4.3.0...nx-quarkus/v5.0.0) (2023-04-10)


### Bug Fixes

* **common:** connections over Proxy not using correct `HTTP` protocol ([5cd3551](https://github.com/tinesoft/nxrocks/commit/5cd3551cf91acf5eca05b26ce4df1944011f86b8)), closes [#158](https://github.com/tinesoft/nxrocks/issues/158)
* **nx-quarkus:** add `x-dropdown` to improve UX of `link` generator ([a6cc550](https://github.com/tinesoft/nxrocks/commit/a6cc5508a0ca348042e2ea9704c62ad3178f7565))


### Features

* **common:** add `addMavenProperty` helper and improve `xpath` matching ([9f89c08](https://github.com/tinesoft/nxrocks/commit/9f89c081eefc9bd168e964bf80416c5e7ad3289a))
* **common:** add `MavenDependency` model ([5ab8c1d](https://github.com/tinesoft/nxrocks/commit/5ab8c1d89d0cc31a997bc65d3cd7d9042604a3fc))
* **nx-ktor:** add `nx-ktor` plugin ([cb74a79](https://github.com/tinesoft/nxrocks/commit/cb74a79d23a79b1eda79c2555d092d8151cf7e49))
* **nx-quarkus:** add dynamic prompt to fetch quarkus extensions list ([e937649](https://github.com/tinesoft/nxrocks/commit/e937649289696fbdaf7bacd19d0f736ee53a1534))
* **nx-quarkus:** improve logging when cannot generate project ([115c7de](https://github.com/tinesoft/nxrocks/commit/115c7de21ca3d2558989580c5de901f5e6ca914d))


### BREAKING CHANGES

* **nx-quarkus:** Nx `v15.8.x` is now the minimum required version to run the plugin

We now leverage Nx's new `NX_INTERACTIVE` environment variable to check whether we are running in interactive mode (normal cli) or not.
When true, we automatically fetch `Quarkus` extensions and present them in an **autocomplete** prompt with **multi-select** support,
so you can easily select which ones you want to include in your project.

# [@nxrocks/nx-quarkus-v4.3.0](https://github.com/tinesoft/nxrocks/compare/nx-quarkus/v4.2.1...nx-quarkus/v4.3.0) (2023-02-28)

### Bug Fixes

- improve schemas of generators for a better UX in `Nx Console` ([0214736](https://github.com/tinesoft/nxrocks/commit/02147369d855247538becf7730f088765f7734d4))

### Features

- **nx-quarkus:** add `test` executor to cached outputs ([e353208](https://github.com/tinesoft/nxrocks/commit/e353208547def1ba74c8e695b552038fa0f8768f))

# [@nxrocks/nx-quarkus-v4.2.0](https://github.com/tinesoft/nxrocks/compare/nx-quarkus/v4.1.0...nx-quarkus/v4.2.0) (2023-01-10)

### Bug Fixes

- **common:** fix bug when fetching dependencies of maven based projects ([2ada704](https://github.com/tinesoft/nxrocks/commit/2ada704f17bdf4a2bec5314b1faf2147c460e4b2))

# [@nxrocks/nx-quarkus-v4.1.0](https://github.com/tinesoft/nxrocks/compare/nx-quarkus/v4.0.0...nx-quarkus/v4.1.0) (2022-12-05)

### Bug Fixes

- add `{workspaceRoot}` prefix (from Nx `v15+`) to targets' `outputs` ([411b402](https://github.com/tinesoft/nxrocks/commit/411b402273b5cb17d48c98dd71b2d5808dcaea96))
- **common:** fix `Error [ERR_STREAM_PREMATURE_CLOSE]: Premature close` ([fb5f797](https://github.com/tinesoft/nxrocks/commit/fb5f797d568affe2e3282387faf5af62a9cab623)), closes [#142](https://github.com/tinesoft/nxrocks/issues/142)
- enforce plugin `peerDependencies` on Nx `v15.0.0` and later ([4c220bb](https://github.com/tinesoft/nxrocks/commit/4c220bb55499972e05a318f656ed91e79a5f91e0))
- fix transitive `dependencies` from `@nxrocks/common` ([3594b1e](https://github.com/tinesoft/nxrocks/commit/3594b1ebb345f91b743e2f58a314020a851ad61b)), closes [#131](https://github.com/tinesoft/nxrocks/issues/131)
- fix transitive dependencies from @nxrocks/common ([56631b2](https://github.com/tinesoft/nxrocks/commit/56631b2fba89a79a54abaae7bd7b0944b4765d41)), closes [#131](https://github.com/tinesoft/nxrocks/issues/131) [#150](https://github.com/tinesoft/nxrocks/issues/150) [#152](https://github.com/tinesoft/nxrocks/issues/152) [#153](https://github.com/tinesoft/nxrocks/issues/153)

### Features

- **nx-spring-boot:** add support for `Kotlin DSL` when using `gradle` ([31063fe](https://github.com/tinesoft/nxrocks/commit/31063fea75eb1abe23490204859df81dde019328))
- **nx-spring-boot:** align Java versions with `Spring Initializr` ([1f6545d](https://github.com/tinesoft/nxrocks/commit/1f6545d9a2c230846a3eadd5c8eb2e9b2b1f1663))
- **nx-spring-boot:** set `Java 17` as default version ([f41c555](https://github.com/tinesoft/nxrocks/commit/f41c555a0368753ad218d5c10ef9328a86a7f52a))

# [@nxrocks/nx-quarkus-v4.0.0](https://github.com/tinesoft/nxrocks/compare/nx-quarkus/v3.0.2...nx-quarkus/v4.0.0) (2022-10-17)

### Bug Fixes

- **common:** fix regex used to fetch gradle dependencies ([f1779a4](https://github.com/tinesoft/nxrocks/commit/f1779a472c6c5ebeeec30674540b6d017478e4f7))
- **nx-micronaut:** fix generation without feature ([#136](https://github.com/tinesoft/nxrocks/issues/136)) ([76db010](https://github.com/tinesoft/nxrocks/commit/76db0106c1943a2f7517ca02b34e2cdf3c02f8f8))

### Features

- **common:** increase the `maxBuffer` when running executors commands ([4bc388d](https://github.com/tinesoft/nxrocks/commit/4bc388d5068aa73003bf09776757fe7b357bb0cf))
- **nx-micronaut:** update JDK version from `16` -> `17` ([a0e81e1](https://github.com/tinesoft/nxrocks/commit/a0e81e194a1c2ca21ec43d7d2831a6b4c7eb9ef8)), closes [#135](https://github.com/tinesoft/nxrocks/issues/135)
- update to Nx workspace `v15.0.0` ([a0af206](https://github.com/tinesoft/nxrocks/commit/a0af2064acbd8e65b4f603ca9e3ce2c6ce990795)), closes [#138](https://github.com/tinesoft/nxrocks/issues/138)

### BREAKING CHANGES

- Nx `v15.x.x` is now the minimum required version to use the plugin

# [@nxrocks/nx-quarkus-v3.0.2](https://github.com/tinesoft/nxrocks/compare/nx-quarkus/v3.0.1...nx-quarkus/v3.0.2) (2022-08-25)

### Bug Fixes

- fix executor output not restored when found in Nx cache ([fbb385a](https://github.com/tinesoft/nxrocks/commit/fbb385ab2cb468c8b41b224e353d9b891bb4e48c)), closes [#111](https://github.com/tinesoft/nxrocks/issues/111)

# [@nxrocks/nx-quarkus-v3.0.1](https://github.com/tinesoft/nxrocks/compare/nx-quarkus/v3.0.0...nx-quarkus/v3.0.1) (2022-08-22)

### Bug Fixes

- fix installation issue due to `hpagent` not being found ([3620d23](https://github.com/tinesoft/nxrocks/commit/3620d2329103076bbb4713bac48c4f0c734bd545)), closes [#128](https://github.com/tinesoft/nxrocks/issues/128)

# [@nxrocks/nx-quarkus-v3.0.0](https://github.com/tinesoft/nxrocks/compare/nx-quarkus/v2.2.0...nx-quarkus/v3.0.0) (2022-08-21)

### Bug Fixes

- **nx-quarkus:** fix `serve` and `apply-format` alias executors ([46b9695](https://github.com/tinesoft/nxrocks/commit/46b9695dc7926923177a4bba7e59f1b722101fb3))
- set `@nrwl/*` packages as `peerDependencies` ([d03b709](https://github.com/tinesoft/nxrocks/commit/d03b70983f278a86c19c8fa28d99603682cad2cd)), closes [#106](https://github.com/tinesoft/nxrocks/issues/106)

### Features

- **nx-micronaut:** add `skipFormat` to control code formatting ([bbc0df2](https://github.com/tinesoft/nxrocks/commit/bbc0df241ca8bd6f09a99d71fa5b73d610cedb10))
- **nx-quarkus:** add proxy support for project generation ([eaefe9a](https://github.com/tinesoft/nxrocks/commit/eaefe9a3d78e1731d83a781d1e867da5ad95d801))
- **nx-quarkus:** add `skipFormat` to control code formatting ([197fe5e](https://github.com/tinesoft/nxrocks/commit/197fe5ecc667f824716d27d8f4e7cb36bc87e6bb))
- **nx-quarkus:** add install executor + make build depend on it ([a18a9aa](https://github.com/tinesoft/nxrocks/commit/a18a9aaaeb92a779b98dfb82fdf72ac702c7ca34)), closes [#65](https://github.com/tinesoft/nxrocks/issues/65)
- **nx-quarkus:** check if source is a valid quarkus project on linking ([dc97a41](https://github.com/tinesoft/nxrocks/commit/dc97a413037d02fa85057a52737398bc53b10332))
- **nx-quarkus:** improve logging when project zip can't be fetched ([cb983f9](https://github.com/tinesoft/nxrocks/commit/cb983f9fa78676c591feef922a4f0ec1fff3a7c4))
- **nx-quarkus:** make `build` executor results cacheable ([6fb6a36](https://github.com/tinesoft/nxrocks/commit/6fb6a363dcdca95b8bc38206613f80e003948211))
- **nx-quarkus:** rename executors to use `kebab-case` ([a8dd56c](https://github.com/tinesoft/nxrocks/commit/a8dd56cd253270c496360a4182cd069919979eb6))
- **nx-quarkus:** unselect by default adding code formatting support ([4892ad8](https://github.com/tinesoft/nxrocks/commit/4892ad81f8e4f17d7dc83d8ca037133ffa164dd7))

### BREAKING CHANGES

- **nx-quarkus:** `format-check` executor was renamed into `check-format` and `do-fomat` was removed
- **nx-quarkus:** All executors of this plugin now use `kebab-case` over `camelCase` for consistency

This only affects `remoteDev`, `addExtension` and `listExtensions` executors, which have been renamed into `remote-dev`, `add-extension`, and `list-extensions` respectively.

# [@nxrocks/nx-quarkus-v2.2.0](https://github.com/tinesoft/nxrocks/compare/nx-quarkus/v2.1.2...nx-quarkus/v2.2.0) (2022-06-21)

### Bug Fixes

- **nx-quarkus:** fix `Premature close` error when generating project ([6ebcd85](https://github.com/tinesoft/nxrocks/commit/6ebcd85fd18cd923627f44630f0b1ad18fb88a57)), closes [#97](https://github.com/tinesoft/nxrocks/issues/97)

### Features

- **nx-quarkus:** add `link` generator to link projects implicitly ([2655b4f](https://github.com/tinesoft/nxrocks/commit/2655b4f326f4386893706d4ae024f6f84f419eac))

# [@nxrocks/nx-quarkus-v2.1.2](https://github.com/tinesoft/nxrocks/compare/nx-quarkus/v2.1.1...nx-quarkus/v2.1.2) (2022-02-16)

### Bug Fixes

- wrong `@nxrocks/common` version referenced in dependent packages ([1b4b0e6](https://github.com/tinesoft/nxrocks/commit/1b4b0e6b1df604177585e703e092cf3652ef86b0))

# [@nxrocks/nx-quarkus-v2.1.1](https://github.com/tinesoft/nxrocks/compare/nx-quarkus/v2.1.0...nx-quarkus/v2.1.1) (2022-02-15)

### Bug Fixes

- include updated `package.json` in git when semantic releasing ([cb87139](https://github.com/tinesoft/nxrocks/commit/cb87139c95ba2f7256a8df7ff0c94410394ccb4f))

# [@nxrocks/nx-quarkus-v2.1.0](https://github.com/tinesoft/nxrocks/compare/nx-quarkus/v2.0.0...nx-quarkus/v2.1.0) (2022-02-14)

### Bug Fixes

- **nx-quarkus:** remove `ratchetFrom` from the default Spotless config ([59cb372](https://github.com/tinesoft/nxrocks/commit/59cb3728aaefcf658ef17fa4666e552b66e7d69c))

### Features

- **nx-quarkus:** add `format` executor ([89e6c4d](https://github.com/tinesoft/nxrocks/commit/89e6c4d4c6f9ab94c4c0b5da7cd56104791a83c2))
- **nx-quarkus:** add `format-check` executor to check code format ([d19f5ca](https://github.com/tinesoft/nxrocks/commit/d19f5ca5cc574dc680e515377af2a5df3576032e))
- **nx-quarkus:** add aliases for the format executor ([bcedf98](https://github.com/tinesoft/nxrocks/commit/bcedf98548ab96fedd8f9a05dace97ab3ffcc44a))

# [@nxrocks/nx-quarkus-v2.0.0](https://github.com/tinesoft/nxrocks/compare/nx-quarkus/v1.0.0...nx-quarkus/v2.0.0) (2021-08-23)

### Bug Fixes

- **nx-quarkus:** add plugin to `nx.json` only if not included already ([a964652](https://github.com/tinesoft/nxrocks/commit/a964652ea79290f6095b481de61ebb398d29831c))
- correct `TypeError: builder.getProjectGraph is not a function` ([3458f66](https://github.com/tinesoft/nxrocks/commit/3458f668f6f3420140fef25f908b08c26511f433)), closes [#72](https://github.com/tinesoft/nxrocks/issues/72)

### Features

- **nx-quarkus:** improve detection of quarkus projects in the workspace ([ee4731d](https://github.com/tinesoft/nxrocks/commit/ee4731d14f352ebec5a12a6e3face14282a4cec3))
- **nx-quarkus:** use `NX_VERBOSE_LOGGING` to control logs in dep graph ([5eaa639](https://github.com/tinesoft/nxrocks/commit/5eaa63992db1454d678b9220a63f751b049b882b))

### BREAKING CHANGES

- Nx v12.6.x is now the minimum version required to use the plugins

This is due to breaking changes in DevKit's project graph API starting from v12.6.x

# @nxrocks/nx-quarkus-v1.0.0 (2021-05-18)

### Features

- **nx-quarkus:** add plugin to integrate `Quarkus` inside Nx workspace ([2f7c6c0](https://github.com/tinesoft/nxrocks/commit/2f7c6c0537629027ebffce3173df2cc6278ca29d))
