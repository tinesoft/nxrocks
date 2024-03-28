## 10.0.1 (2024-03-28)


### 🩹 Fixes

- bump versions of packages to include changes in `common@4.0.1` ([796333a](https://github.com/tinesoft/nxrocks/commit/796333a))


### ❤️  Thank You

- Tine Kondo @tinesoft

# 10.0.0 (2024-03-26)


### 🚀 Features

- ⚠️  update to support `inferred tasks` (Nx `Project Crystal`) ([8a21e3f](https://github.com/tinesoft/nxrocks/commit/8a21e3f))


### 🩹 Fixes

- remove `gen`, `init`, and `generate` aliases for `project` generator ([e39ad3a](https://github.com/tinesoft/nxrocks/commit/e39ad3a))

- ⚠️  do not generate `targets` at parent module level and lets Nx manage dependencies entirely ([f37531f](https://github.com/tinesoft/nxrocks/commit/f37531f))

- fix base version for `@nx/devkit` to `>=18.0.0` ([d048cfe](https://github.com/tinesoft/nxrocks/commit/d048cfe))

- **nx-spring-boot:** fix generated  projects of type `library` with `kotlin` and `groovy` languages ([6ae3729](https://github.com/tinesoft/nxrocks/commit/6ae3729))


#### ⚠️  Breaking Changes

- Nx `v18` is now the minimal version to use the plugins
- `project.json` of parent module no longer contain `targets` (i.e no `build`, `install`, etc task anymore)

### ❤️  Thank You

- Tine Kondo @tinesoft

# [9.3.0](https://github.com/tinesoft/nxrocks/compare/nx-spring-boot/v9.2.2...nx-spring-boot/v9.3.0) (2024-02-18)


### Bug Fixes

* **common-jvm:** fix `Project Graph` dependencies collection for projects using `Gradle` ([6df1ff3](https://github.com/tinesoft/nxrocks/commit/6df1ff30ebcc516c21b654d5c5a3bb7107bfd732))
* **common-jvm:** include `settings.gradle[.kts]` files when creating nodes for ProjectGraph v2 ([df9f195](https://github.com/tinesoft/nxrocks/commit/df9f195df0dbaaa332b50122c73b452a09e85b08))
* **common:** fix creation of dependencies between  nodes for ProjectGraph v2 ([fa08ae0](https://github.com/tinesoft/nxrocks/commit/fa08ae0517982d7e11086137abd4098efde9f788))
* fix `create-nx-*` broken due to changes in Nx Cloud setup since Nx `v17.3.0` ([6c981d4](https://github.com/tinesoft/nxrocks/commit/6c981d4a75e6b53bd595642e8087496b246edcbd))
* fix Project Graph generation when creating projects in nested folders ([b5698d3](https://github.com/tinesoft/nxrocks/commit/b5698d359b66d99a8e56d20798912a0dc66e598b))
* **nx-spring-boot:**  fix how Spring Boot projects using `gradle` are detected ([93613d6](https://github.com/tinesoft/nxrocks/commit/93613d61ae6037993fb6c7f572ef32773fda156a))


### Features

* **common-jvm:**  improve retrieval of `groupId`and `artifactId` when defined at parent level ([9ea99ca](https://github.com/tinesoft/nxrocks/commit/9ea99cafe6f13eeb86ea2e09f0de16af9bc344c6))
* **common-jvm:** add constant listing common JVM build files ([68cd945](https://github.com/tinesoft/nxrocks/commit/68cd94599cef3cb6922526e8ecc34296b5cf426e))
* **common-jvm:** extends the search for content inside a project file to its prent module ([869400d](https://github.com/tinesoft/nxrocks/commit/869400d4309fd180051f30d81a6592578d20a43c))
* **common-jvm:** update utils for better support for `Maven` and `Gradle` muti-module projects ([b211fda](https://github.com/tinesoft/nxrocks/commit/b211fdaf09a978e991c1222338d128da463e633b))
* **common:** add utilities to generate Project Graph using `v2` API ([c6f70e0](https://github.com/tinesoft/nxrocks/commit/c6f70e0c4fc8ee9fe235dba05e14e453c3617b90))
* **common:** update Project Graph generation for JVM projects with child modules ([d9aba7f](https://github.com/tinesoft/nxrocks/commit/d9aba7fee887945240765a05275c3120e061be94))
* generate the `build.gradle[.kts]` file when initializing the parent àGradle` module ([9b90c4f](https://github.com/tinesoft/nxrocks/commit/9b90c4f869418fc81b65f1c281d846cbd2d39475))
* improve multi-module support for `Maven` and `Gradle` projects ([c4e0389](https://github.com/tinesoft/nxrocks/commit/c4e0389b0c166a4c74d1d5202183b155a4064c5c))
* **nx-spring-boot:** keep only  Java `21` and `17` to align w/ Spring Initializr ([9d41441](https://github.com/tinesoft/nxrocks/commit/9d41441ccd1efa776ed87ffa65030713a361de79))
* **nx-spring-boot:** migrate Project Graph generation to `v2` API ([7d94457](https://github.com/tinesoft/nxrocks/commit/7d94457b244c6ab058e8541f29252b5917ad92e6))

## [9.2.2](https://github.com/tinesoft/nxrocks/compare/nx-spring-boot/v9.2.1...nx-spring-boot/v9.2.2) (2023-12-16)


### Bug Fixes

* **common-jvm:** fix `checkForModule` util to match gradle child module names w/ arbitrary paths ([759c02f](https://github.com/tinesoft/nxrocks/commit/759c02f69bc63e25067af981dcade650a639ea52))

## [9.2.1](https://github.com/tinesoft/nxrocks/compare/nx-spring-boot/v9.2.0...nx-spring-boot/v9.2.1) (2023-12-12)


### Bug Fixes

* **nx-spring-boot:** fix generated parent `pom.xml`  of a multi-module project was not valid ([02b1e2d](https://github.com/tinesoft/nxrocks/commit/02b1e2ddec341ca611fe73c497703a33f96ab156))

# [9.2.0](https://github.com/tinesoft/nxrocks/compare/nx-spring-boot/v9.1.2...nx-spring-boot/v9.2.0) (2023-12-12)


### Features

* add `projectNameAndRootFormat` option to better control where projects are generated ([5c449b5](https://github.com/tinesoft/nxrocks/commit/5c449b58265295b953a355890a7102b20c3ab094))
* add migrations to automate making `serve`-like targets depend on `^install` ([f3449ea](https://github.com/tinesoft/nxrocks/commit/f3449ea8a2843d4b763dd9c361e72e034fb84982))
* make `serve`-like targets depend on `^install` to automatically install dependencies first ([c85b7a6](https://github.com/tinesoft/nxrocks/commit/c85b7a6c398a849cddb403a8013c68723d47f9b9))
* **nx-spring-boot:** prefix property in `ServiceProperties` with project name + remove `resources/` ([78be43f](https://github.com/tinesoft/nxrocks/commit/78be43f3c1b95ed6d231c45b590aa0b6a121c912))

## [9.1.2](https://github.com/tinesoft/nxrocks/compare/nx-spring-boot/v9.1.1...nx-spring-boot/v9.1.2) (2023-11-25)


### Bug Fixes

* **common-jvm:** fix bug when checking if an  xml node is empty ([9f956a0](https://github.com/tinesoft/nxrocks/commit/9f956a04b7234319ee7be3e02c1c5f871050de5b))
* **nx-spring-boot:** fix template files for `library` projects ([aa2ea8c](https://github.com/tinesoft/nxrocks/commit/aa2ea8cec900f8afd38dd6934319a8cf248b10c7))

## [9.1.1](https://github.com/tinesoft/nxrocks/compare/nx-spring-boot/v9.1.0...nx-spring-boot/v9.1.1) (2023-11-24)


### Bug Fixes

* **nx-spring-boot:** fix sample files not generated for `Maven` `library` projects ([6d2effd](https://github.com/tinesoft/nxrocks/commit/6d2effdb81d5a4c1e77491ff86d35d41811cb83b))
* **nx-spring-boot:** fix typing in `MyService.kt` when generating a `library` project ([340b666](https://github.com/tinesoft/nxrocks/commit/340b6667aeaa741d33c956dd01df2ea27f6ca7df))

# [9.1.0](https://github.com/tinesoft/nxrocks/compare/nx-spring-boot/v9.0.3...nx-spring-boot/v9.1.0) (2023-11-22)


### Bug Fixes

* **common-jvm:** improve utility method to disable a Gradle plugin ([8e1e5b9](https://github.com/tinesoft/nxrocks/commit/8e1e5b9fc9b9e07fd0c8f9d2cbfc31a809416873))
* **nx-spring-boot:** do not generate Application/ApplicationTests files when generating a `library` ([17fbb4a](https://github.com/tinesoft/nxrocks/commit/17fbb4a9b9094b2a7c544babec806e48b410c222))
* **nx-spring-boot:** fix Boot plugin not disabled for `library` project when using Gradle Kotlin ([fb0b1de](https://github.com/tinesoft/nxrocks/commit/fb0b1de4c1ed700ac40bbb0fe9c90597d45e3af5))
* **nx-spring-boot:** remove `bootBuildImage` gradle task when generating a `library` project ([03a2bd7](https://github.com/tinesoft/nxrocks/commit/03a2bd7f3b8cffd65f4ae0a2ffbe91976e43865f))


### Features

* make `install` target depend on the one from the dependency ([b2878dc](https://github.com/tinesoft/nxrocks/commit/b2878dca47f660c8faa9e1caf0733550abda17cb))
* **nx-spring-boot:** improve `project` generator by generating sample `library` files ([358f9ad](https://github.com/tinesoft/nxrocks/commit/358f9ad404e1d28b0d9c875bd02f4e0782c405f0))

## [9.0.3](https://github.com/tinesoft/nxrocks/compare/nx-spring-boot/v9.0.2...nx-spring-boot/v9.0.3) (2023-11-16)


### Bug Fixes

* hide `preset` generators from `Nx Console` and improve generators decription ([c868384](https://github.com/tinesoft/nxrocks/commit/c868384a03963c8636f5fe161d619ba4f32324c9))

## [9.0.2](https://github.com/tinesoft/nxrocks/compare/nx-spring-boot/v9.0.1...nx-spring-boot/v9.0.2) (2023-10-31)


### Bug Fixes

* **common-jvm:** fix parent module not found when `runFromParentModule` flag is `true` ([840f8f6](https://github.com/tinesoft/nxrocks/commit/840f8f6dfa4c4d2a69c1f6d0e7b7ba472862050d))

## [9.0.1](https://github.com/tinesoft/nxrocks/compare/nx-spring-boot/v9.0.0...nx-spring-boot/v9.0.1) (2023-10-28)


### Bug Fixes

* **common:** simplify the path to common utils ([c87be7f](https://github.com/tinesoft/nxrocks/commit/c87be7f883053cd31cd3015712b6929ddea4fdc7))
* remove explicit dependency on `@nx/devkit` (inherited from `common`) ([a1d44c9](https://github.com/tinesoft/nxrocks/commit/a1d44c9eed3cf73216aaf70c9f47c9eef0753215))

# [9.0.0](https://github.com/tinesoft/nxrocks/compare/nx-spring-boot/v8.1.0...nx-spring-boot/v9.0.0) (2023-10-22)


### Bug Fixes

* **common:**  update dependencies used by the `common` module ([e78ae32](https://github.com/tinesoft/nxrocks/commit/e78ae32a157d7823aab64454ccd637a4f4a505dc))


### Features

* **common-jvm:** move common JVM-related utils to a dedicated package ([1bf12fb](https://github.com/tinesoft/nxrocks/commit/1bf12fb38650261584e7face404f5477470dc40d))
* **common:** allow setting cacheable operations when add the plugin to `nx.json` ([9fb5177](https://github.com/tinesoft/nxrocks/commit/9fb51770c991912a6c8d9bc1b99af4f171f1df58))
* **nx-spring-boot:** add `install`  target to cacheable operations ([341aa6a](https://github.com/tinesoft/nxrocks/commit/341aa6af2490c59be4e668b5bac96be78a78ee36))
* **nx-spring-boot:** add migration to add `install` target in cacheable operations ([de11795](https://github.com/tinesoft/nxrocks/commit/de11795fe87ba4a6bef6c4dfabc574db54ae30f5))
* update to Nx workspace `v17.x.x` ([c5b4ef3](https://github.com/tinesoft/nxrocks/commit/c5b4ef3db2bb8b5e5b2e09a09892a09c4c52b017)), closes [#195](https://github.com/tinesoft/nxrocks/issues/195)


### BREAKING CHANGES

* Nx `v17.x.x` is now the minimum required version to use the plugin

# [8.1.0](https://github.com/tinesoft/nxrocks/compare/nx-spring-boot/v8.0.3...nx-spring-boot/v8.1.0) (2023-10-08)


### Bug Fixes

* **common:** fix ProjectGraph for `Gradle` multi-module projects ([0ef0d17](https://github.com/tinesoft/nxrocks/commit/0ef0d1736fe100002ab2d547b830ab9de0e42a19))


### Features

* **common-cli:** add `common-cli` to share code among our `create-*` CLI packages ([bcb5fd2](https://github.com/tinesoft/nxrocks/commit/bcb5fd2a0cda945b708fb0e42195bde82cac47c7))
* **common:** add utilities for multi-module `maven`/`gradle` projects ([f2e4939](https://github.com/tinesoft/nxrocks/commit/f2e49396bd5fec312c401040c5511567a092a18c))
* **common:** add utilities to add `maven`/`gradle` modules ([2237201](https://github.com/tinesoft/nxrocks/commit/2237201646307ade853c180f5b25e9e2e56e5ad7))
* **create-nx-spring-boot:** add custom CLI to create Spring Boot projects ([32ca53c](https://github.com/tinesoft/nxrocks/commit/32ca53c61cc1c25027d72434e13b71ec1a100acb))
* **nx-spring-boot:** add support for creating multi-modules projects ([7c2de5a](https://github.com/tinesoft/nxrocks/commit/7c2de5a07f92fad481f3bda5ce61a71ba78c89c0))
* **nx-spring-boot:** add support for Java 21 ([ba566e9](https://github.com/tinesoft/nxrocks/commit/ba566e9c2c82a1cd4422171a8394b63d3691c26a))
* update dependencies and fix lint issues ([cfac383](https://github.com/tinesoft/nxrocks/commit/cfac383c7d2aebd329a98f410df66b726b64d28a))

## [8.0.3](https://github.com/tinesoft/nxrocks/compare/nx-spring-boot/v8.0.2...nx-spring-boot/v8.0.3) (2023-05-12)


### Bug Fixes

* **common:** fix dependency graph generation failure on `windows` OS ([26ef7c4](https://github.com/tinesoft/nxrocks/commit/26ef7c476cd4bc158b4df818a84be428a25c6adc)), closes [#170](https://github.com/tinesoft/nxrocks/issues/170)
* **common:** fix deprecated usage of dependency graph API ([badf089](https://github.com/tinesoft/nxrocks/commit/badf089040b31682df94c97818bf7e96201d42f9))

## [8.0.2](https://github.com/tinesoft/nxrocks/compare/nx-spring-boot/v8.0.1...nx-spring-boot/v8.0.2) (2023-05-06)


### Bug Fixes

* loosen `peerDependencies` on `@nx/*` to support v16.0.0 AND higher ([fb2f8df](https://github.com/tinesoft/nxrocks/commit/fb2f8df907fe9a498cc310862f08571e6c87dd6b))

## [8.0.1](https://github.com/tinesoft/nxrocks/compare/nx-spring-boot/v8.0.0...nx-spring-boot/v8.0.1) (2023-05-04)


### Bug Fixes

* **common:** bump version of `@nxrocks/common` for Nx 16 support ([980a86f](https://github.com/tinesoft/nxrocks/commit/980a86fe0ee16e7d0efb5578b3eef45a00ac9654)), closes [#169](https://github.com/tinesoft/nxrocks/issues/169)

# [8.0.0](https://github.com/tinesoft/nxrocks/compare/nx-spring-boot/v7.0.0...nx-spring-boot/v8.0.0) (2023-05-03)


### Features

* update to Nx workspace `v16.0.0` ([ab11ea8](https://github.com/tinesoft/nxrocks/commit/ab11ea89becafa9555f43527c95167827089a6e6))


### BREAKING CHANGES

* Nx `v16.x.x` is now the minimum required version to use the plugin

# [7.0.0](https://github.com/tinesoft/nxrocks/compare/nx-spring-boot/v6.3.0...nx-spring-boot/v7.0.0) (2023-04-10)


### Bug Fixes

* **common:** connections over Proxy not using correct `HTTP` protocol ([5cd3551](https://github.com/tinesoft/nxrocks/commit/5cd3551cf91acf5eca05b26ce4df1944011f86b8)), closes [#158](https://github.com/tinesoft/nxrocks/issues/158)
* **nx-spring-boot:** add `x-dropdown` to improve UX of `link` generator ([b056117](https://github.com/tinesoft/nxrocks/commit/b056117bc2fc67fae3a17fdc886f36638b2f01b3))


### Features

* **common:** add `addMavenProperty` helper and improve `xpath` matching ([9f89c08](https://github.com/tinesoft/nxrocks/commit/9f89c081eefc9bd168e964bf80416c5e7ad3289a))
* **common:** add `MavenDependency` model ([5ab8c1d](https://github.com/tinesoft/nxrocks/commit/5ab8c1d89d0cc31a997bc65d3cd7d9042604a3fc))
* **nx-ktor:** add `nx-ktor` plugin ([cb74a79](https://github.com/tinesoft/nxrocks/commit/cb74a79d23a79b1eda79c2555d092d8151cf7e49))
* **nx-spring-boot:** add dynamic prompt to fetch boot dependencies list ([6d9f3e4](https://github.com/tinesoft/nxrocks/commit/6d9f3e46f39cd8352f8220968f837e054e187625))
* **nx-spring-boot:** improve logging when cannot generate project ([3cc8eb6](https://github.com/tinesoft/nxrocks/commit/3cc8eb6cf9339a830f542b1e8a2ff41491c0c29a))


### BREAKING CHANGES

* **nx-spring-boot:** Nx `v15.8.x` is now the minimum required version to run the plugin

We now leverage Nx's new `NX_INTERACTIVE` environment variable to check whether we are running in interactive mode (normal cli) or not.
When true, we automatically fetch `Spring Boot` dependencies and present them in an **autocomplete** prompt with **multi-select** support,
so you can easily select which ones you want to include in your project.

# [@nxrocks/nx-spring-boot-v6.3.0](https://github.com/tinesoft/nxrocks/compare/nx-spring-boot/v6.2.1...nx-spring-boot/v6.3.0) (2023-02-28)

### Bug Fixes

- improve schemas of generators for a better UX in `Nx Console` ([0214736](https://github.com/tinesoft/nxrocks/commit/02147369d855247538becf7730f088765f7734d4))

### Features

- **nx-spring-boot:** add `build-image` and `test` to cached outputs ([1cc3a71](https://github.com/tinesoft/nxrocks/commit/1cc3a712249a7e24c29e80a1d8a0a67c5d2e19f4))

# [@nxrocks/nx-spring-boot-v6.2.0](https://github.com/tinesoft/nxrocks/compare/nx-spring-boot/v6.1.0...nx-spring-boot/v6.2.0) (2023-01-10)

### Bug Fixes

- **common:** fix bug when fetching dependencies of maven based projects ([2ada704](https://github.com/tinesoft/nxrocks/commit/2ada704f17bdf4a2bec5314b1faf2147c460e4b2))

# [@nxrocks/nx-spring-boot-v6.1.0](https://github.com/tinesoft/nxrocks/compare/nx-spring-boot/v6.0.0...nx-spring-boot/v6.1.0) (2022-12-05)

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

# [@nxrocks/nx-spring-boot-v6.0.0](https://github.com/tinesoft/nxrocks/compare/nx-spring-boot/v5.0.2...nx-spring-boot/v6.0.0) (2022-10-17)

### Bug Fixes

- **common:** fix regex used to fetch gradle dependencies ([f1779a4](https://github.com/tinesoft/nxrocks/commit/f1779a472c6c5ebeeec30674540b6d017478e4f7))
- **nx-micronaut:** fix generation without feature ([#136](https://github.com/tinesoft/nxrocks/issues/136)) ([76db010](https://github.com/tinesoft/nxrocks/commit/76db0106c1943a2f7517ca02b34e2cdf3c02f8f8))

### Features

- **common:** increase the `maxBuffer` when running executors commands ([4bc388d](https://github.com/tinesoft/nxrocks/commit/4bc388d5068aa73003bf09776757fe7b357bb0cf))
- **nx-micronaut:** update JDK version from `16` -> `17` ([a0e81e1](https://github.com/tinesoft/nxrocks/commit/a0e81e194a1c2ca21ec43d7d2831a6b4c7eb9ef8)), closes [#135](https://github.com/tinesoft/nxrocks/issues/135)
- update to Nx workspace `v15.0.0` ([a0af206](https://github.com/tinesoft/nxrocks/commit/a0af2064acbd8e65b4f603ca9e3ce2c6ce990795)), closes [#138](https://github.com/tinesoft/nxrocks/issues/138)

### BREAKING CHANGES

- Nx `v15.x.x` is now the minimum required version to use the plugin

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
