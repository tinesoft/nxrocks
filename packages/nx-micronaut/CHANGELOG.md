## [5.0.2](https://github.com/tinesoft/nxrocks/compare/nx-micronaut/v5.0.1...nx-micronaut/v5.0.2) (2023-10-31)


### Bug Fixes

* **common-jvm:** fix parent module not found when `runFromParentModule` flag is `true` ([840f8f6](https://github.com/tinesoft/nxrocks/commit/840f8f6dfa4c4d2a69c1f6d0e7b7ba472862050d))

## [5.0.1](https://github.com/tinesoft/nxrocks/compare/nx-micronaut/v5.0.0...nx-micronaut/v5.0.1) (2023-10-28)


### Bug Fixes

* **common:** simplify the path to common utils ([c87be7f](https://github.com/tinesoft/nxrocks/commit/c87be7f883053cd31cd3015712b6929ddea4fdc7))
* remove explicit dependency on `@nx/devkit` (inherited from `common`) ([a1d44c9](https://github.com/tinesoft/nxrocks/commit/a1d44c9eed3cf73216aaf70c9f47c9eef0753215))

# [5.0.0](https://github.com/tinesoft/nxrocks/compare/nx-micronaut/v4.1.0...nx-micronaut/v5.0.0) (2023-10-22)


### Bug Fixes

* **common:**  update dependencies used by the `common` module ([e78ae32](https://github.com/tinesoft/nxrocks/commit/e78ae32a157d7823aab64454ccd637a4f4a505dc))


### Features

* **common-jvm:** move common JVM-related utils to a dedicated package ([1bf12fb](https://github.com/tinesoft/nxrocks/commit/1bf12fb38650261584e7face404f5477470dc40d))
* **common:** allow setting cacheable operations when add the plugin to `nx.json` ([9fb5177](https://github.com/tinesoft/nxrocks/commit/9fb51770c991912a6c8d9bc1b99af4f171f1df58))
* **nx-micronaut:** add `install`  target to cacheable operations ([9c0684f](https://github.com/tinesoft/nxrocks/commit/9c0684fa3c7d23e7f1aecdc5ea86f5aa808283dc))
* **nx-micronaut:** add migration to add `install` target in cacheable operations ([c4ea7ab](https://github.com/tinesoft/nxrocks/commit/c4ea7ab54f82da6b54235996ea5e59e73937c0a7))
* update to Nx workspace `v17.x.x` ([c5b4ef3](https://github.com/tinesoft/nxrocks/commit/c5b4ef3db2bb8b5e5b2e09a09892a09c4c52b017)), closes [#195](https://github.com/tinesoft/nxrocks/issues/195)


### BREAKING CHANGES

* Nx `v17.x.x` is now the minimum required version to use the plugin

# [4.1.0](https://github.com/tinesoft/nxrocks/compare/nx-micronaut/v4.0.3...nx-micronaut/v4.1.0) (2023-10-08)


### Bug Fixes

* **common:** fix ProjectGraph for `Gradle` multi-module projects ([0ef0d17](https://github.com/tinesoft/nxrocks/commit/0ef0d1736fe100002ab2d547b830ab9de0e42a19))


### Features

* **common-cli:** add `common-cli` to share code among our `create-*` CLI packages ([bcb5fd2](https://github.com/tinesoft/nxrocks/commit/bcb5fd2a0cda945b708fb0e42195bde82cac47c7))
* **common:** add utilities for multi-module `maven`/`gradle` projects ([f2e4939](https://github.com/tinesoft/nxrocks/commit/f2e49396bd5fec312c401040c5511567a092a18c))
* **common:** add utilities to add `maven`/`gradle` modules ([2237201](https://github.com/tinesoft/nxrocks/commit/2237201646307ade853c180f5b25e9e2e56e5ad7))
* **create-nx-micronaut:** add custom CLI to create Micronaut projects ([2dce944](https://github.com/tinesoft/nxrocks/commit/2dce94402adb75213e185eaf778ef2c254f5561f))
* **create-nx-spring-boot:** add custom CLI to create Spring Boot projects ([32ca53c](https://github.com/tinesoft/nxrocks/commit/32ca53c61cc1c25027d72434e13b71ec1a100acb))
* **nx-micronaut:** add support for creating multi-modules projects ([b20eb48](https://github.com/tinesoft/nxrocks/commit/b20eb48de174059f7af935a96eaf1a30ec6e2b85))
* **nx-micronaut:** change default build system to `gradle` ([910d69c](https://github.com/tinesoft/nxrocks/commit/910d69c4710fbd70e6a9a9d6c9191862f0455524))
* **nx-spring-boot:** add support for creating multi-modules projects ([7c2de5a](https://github.com/tinesoft/nxrocks/commit/7c2de5a07f92fad481f3bda5ce61a71ba78c89c0))
* update dependencies and fix lint issues ([cfac383](https://github.com/tinesoft/nxrocks/commit/cfac383c7d2aebd329a98f410df66b726b64d28a))

## [4.0.3](https://github.com/tinesoft/nxrocks/compare/nx-micronaut/v4.0.2...nx-micronaut/v4.0.3) (2023-05-12)


### Bug Fixes

* **common:** fix dependency graph generation failure on `windows` OS ([26ef7c4](https://github.com/tinesoft/nxrocks/commit/26ef7c476cd4bc158b4df818a84be428a25c6adc)), closes [#170](https://github.com/tinesoft/nxrocks/issues/170)
* **common:** fix deprecated usage of dependency graph API ([badf089](https://github.com/tinesoft/nxrocks/commit/badf089040b31682df94c97818bf7e96201d42f9))

## [4.0.2](https://github.com/tinesoft/nxrocks/compare/nx-micronaut/v4.0.1...nx-micronaut/v4.0.2) (2023-05-06)


### Bug Fixes

* loosen `peerDependencies` on `@nx/*` to support v16.0.0 AND higher ([fb2f8df](https://github.com/tinesoft/nxrocks/commit/fb2f8df907fe9a498cc310862f08571e6c87dd6b))

## [4.0.1](https://github.com/tinesoft/nxrocks/compare/nx-micronaut/v4.0.0...nx-micronaut/v4.0.1) (2023-05-04)


### Bug Fixes

* **common:** bump version of `@nxrocks/common` for Nx 16 support ([980a86f](https://github.com/tinesoft/nxrocks/commit/980a86fe0ee16e7d0efb5578b3eef45a00ac9654)), closes [#169](https://github.com/tinesoft/nxrocks/issues/169)

# [4.0.0](https://github.com/tinesoft/nxrocks/compare/nx-micronaut/v3.0.0...nx-micronaut/v4.0.0) (2023-05-03)


### Features

* update to Nx workspace `v16.0.0` ([ab11ea8](https://github.com/tinesoft/nxrocks/commit/ab11ea89becafa9555f43527c95167827089a6e6))


### BREAKING CHANGES

* Nx `v16.x.x` is now the minimum required version to use the plugin

# [3.0.0](https://github.com/tinesoft/nxrocks/compare/nx-micronaut/v2.3.0...nx-micronaut/v3.0.0) (2023-04-10)


### Bug Fixes

* **common:** connections over Proxy not using correct `HTTP` protocol ([5cd3551](https://github.com/tinesoft/nxrocks/commit/5cd3551cf91acf5eca05b26ce4df1944011f86b8)), closes [#158](https://github.com/tinesoft/nxrocks/issues/158)
* **nx-micronaut:** add `x-dropdown` to improve UX of `link` generator ([e0f551b](https://github.com/tinesoft/nxrocks/commit/e0f551b3c543a3b84d6f1901636d575abf03a4af))


### Features

* **common:** add `addMavenProperty` helper and improve `xpath` matching ([9f89c08](https://github.com/tinesoft/nxrocks/commit/9f89c081eefc9bd168e964bf80416c5e7ad3289a))
* **common:** add `MavenDependency` model ([5ab8c1d](https://github.com/tinesoft/nxrocks/commit/5ab8c1d89d0cc31a997bc65d3cd7d9042604a3fc))
* **nx-ktor:** add `nx-ktor` plugin ([cb74a79](https://github.com/tinesoft/nxrocks/commit/cb74a79d23a79b1eda79c2555d092d8151cf7e49))
* **nx-micronaut:** add dynamic prompt to fetch micronaut features list ([d23d4bc](https://github.com/tinesoft/nxrocks/commit/d23d4bccdacea6a27828c269cacd98d53f242f75))
* **nx-micronaut:** improve logging when cannot generate project ([15ace81](https://github.com/tinesoft/nxrocks/commit/15ace81ea8548b846562a04f1860b0e9cbf0b8c9))


### BREAKING CHANGES

* **nx-micronaut:** Nx `v15.8.x` is now the minimum required version to run the plugin

We now leverage Nx's new `NX_INTERACTIVE` environment variable to check whether we are running in interactive mode (normal cli) or not.
When true, we automatically fetch `Micronaut` features and present them in an **autocomplete** prompt with **multi-select** support,
so you can easily select which ones you want to include in your project.

# [@nxrocks/nx-micronaut-v2.3.0](https://github.com/tinesoft/nxrocks/compare/nx-micronaut/v2.2.1...nx-micronaut/v2.3.0) (2023-02-28)

### Bug Fixes

- improve schemas of generators for a better UX in `Nx Console` ([0214736](https://github.com/tinesoft/nxrocks/commit/02147369d855247538becf7730f088765f7734d4))

### Features

- **nx-micronaut:** add `test` executor to cached outputs ([be7920e](https://github.com/tinesoft/nxrocks/commit/be7920e79032c60e1dcde727a261885a88623183))

# [@nxrocks/nx-micronaut-v2.2.0](https://github.com/tinesoft/nxrocks/compare/nx-micronaut/v2.1.0...nx-micronaut/v2.2.0) (2023-01-10)

### Bug Fixes

- **common:** fix bug when fetching dependencies of maven based projects ([2ada704](https://github.com/tinesoft/nxrocks/commit/2ada704f17bdf4a2bec5314b1faf2147c460e4b2))

# [@nxrocks/nx-micronaut-v2.1.0](https://github.com/tinesoft/nxrocks/compare/nx-micronaut/v2.0.0...nx-micronaut/v2.1.0) (2022-12-05)

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

# [@nxrocks/nx-micronaut-v2.0.0](https://github.com/tinesoft/nxrocks/compare/nx-micronaut/v1.0.2...nx-micronaut/v2.0.0) (2022-10-17)

### Bug Fixes

- **common:** fix regex used to fetch gradle dependencies ([f1779a4](https://github.com/tinesoft/nxrocks/commit/f1779a472c6c5ebeeec30674540b6d017478e4f7))
- **nx-micronaut:** fix generation without feature ([#136](https://github.com/tinesoft/nxrocks/issues/136)) ([76db010](https://github.com/tinesoft/nxrocks/commit/76db0106c1943a2f7517ca02b34e2cdf3c02f8f8))

### Features

- **common:** increase the `maxBuffer` when running executors commands ([4bc388d](https://github.com/tinesoft/nxrocks/commit/4bc388d5068aa73003bf09776757fe7b357bb0cf))
- **nx-micronaut:** update JDK version from `16` -> `17` ([a0e81e1](https://github.com/tinesoft/nxrocks/commit/a0e81e194a1c2ca21ec43d7d2831a6b4c7eb9ef8)), closes [#135](https://github.com/tinesoft/nxrocks/issues/135)
- update to Nx workspace `v15.0.0` ([a0af206](https://github.com/tinesoft/nxrocks/commit/a0af2064acbd8e65b4f603ca9e3ce2c6ce990795)), closes [#138](https://github.com/tinesoft/nxrocks/issues/138)

### BREAKING CHANGES

- Nx `v15.x.x` is now the minimum required version to use the plugin

# [@nxrocks/nx-micronaut-v1.0.2](https://github.com/tinesoft/nxrocks/compare/nx-micronaut/v1.0.1...nx-micronaut/v1.0.2) (2022-08-25)

### Bug Fixes

- fix executor output not restored when found in Nx cache ([fbb385a](https://github.com/tinesoft/nxrocks/commit/fbb385ab2cb468c8b41b224e353d9b891bb4e48c)), closes [#111](https://github.com/tinesoft/nxrocks/issues/111)

# [@nxrocks/nx-micronaut-v1.0.1](https://github.com/tinesoft/nxrocks/compare/nx-micronaut/v1.0.0...nx-micronaut/v1.0.1) (2022-08-22)

### Bug Fixes

- fix installation issue due to `hpagent` not being found ([3620d23](https://github.com/tinesoft/nxrocks/commit/3620d2329103076bbb4713bac48c4f0c734bd545)), closes [#128](https://github.com/tinesoft/nxrocks/issues/128)

# @nxrocks/nx-micronaut-v1.0.0 (2022-08-21)

### Bug Fixes

- wrong `@nxrocks/common` version referenced in dependent packages ([1b4b0e6](https://github.com/tinesoft/nxrocks/commit/1b4b0e6b1df604177585e703e092cf3652ef86b0))
- correct `TypeError: builder.getProjectGraph is not a function` ([3458f66](https://github.com/tinesoft/nxrocks/commit/3458f668f6f3420140fef25f908b08c26511f433)), closes [#72](https://github.com/tinesoft/nxrocks/issues/72)
- include updated `package.json` in git when semantic releasing ([cb87139](https://github.com/tinesoft/nxrocks/commit/cb87139c95ba2f7256a8df7ff0c94410394ccb4f))
- **nx-micronaut:** fix `serve` and `apply-format` alias executors ([30d75d7](https://github.com/tinesoft/nxrocks/commit/30d75d767d4a473617c5b0fb2da4377b3c4eb79d))
- **nx-micronaut:** fix project's base package/artifact name computation ([f2f2983](https://github.com/tinesoft/nxrocks/commit/f2f2983f821c41cbf94a2d3f20afb147221d19b5))
- plugins include spec files in distributed pkg ([21bac53](https://github.com/tinesoft/nxrocks/commit/21bac5398c05be293cd250e46814b8f86468bc4f))
- set `@nrwl/*` packages as `peerDependencies` ([d03b709](https://github.com/tinesoft/nxrocks/commit/d03b70983f278a86c19c8fa28d99603682cad2cd)), closes [#106](https://github.com/tinesoft/nxrocks/issues/106)

### Features

- **nx-micronaut:** add proxy support for project generation ([615c412](https://github.com/tinesoft/nxrocks/commit/615c41204e481add401487459f104917a3dd3dd3))
- **nx-micronaut:** add `nx-micronaut` plugin ([08d6099](https://github.com/tinesoft/nxrocks/commit/08d6099001bbfff830963584598da3d6a3eac66c))
- **nx-micronaut:** add `skipFormat` to control code formatting ([bbc0df2](https://github.com/tinesoft/nxrocks/commit/bbc0df241ca8bd6f09a99d71fa5b73d610cedb10))
- **nx-micronaut:** add install executor + make build depend on it ([10ab5b7](https://github.com/tinesoft/nxrocks/commit/10ab5b7e843d740cf1575ca967fba9356dfc6344))
- **nx-micronaut:** make `build` executor results cacheable ([d116760](https://github.com/tinesoft/nxrocks/commit/d116760d34ec5402a1911f6d06af235c0fbf24b3))
- **nx-micronaut:** rename executors to use `kebab-case` ([7bfc305](https://github.com/tinesoft/nxrocks/commit/7bfc305ace8fc8e38a6d5732049a6b435223b10e))
- **nx-micronaut:** unselect by default adding code formatting support ([cb52710](https://github.com/tinesoft/nxrocks/commit/cb527103af9c3ed27aa063f49a4c0907e16bee1c))

### BREAKING CHANGES

- **nx-micronaut:** `format-check` executor was renamed into `check-format` and `do-fomat` was removed
- **nx-micronaut:** All executors of this plugin now use `kebab-case` over `camelCase` for consistency

This only affects `aotSampleConfig` executor, which has been renamed into `aot-sample-config`.

- Nx v12.6.x is now the minimum version required to use the plugins

This is due to breaking changes in DevKit's project graph API starting from v12.6.x
