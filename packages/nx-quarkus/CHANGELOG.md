## 9.0.1 (2025-03-23)

### 🩹 Fixes

- update to Nx workspace to `v20.6.0` ([be507c7](https://github.com/tinesoft/nxrocks/commit/be507c7))

### 🧱 Updated Dependencies

- Updated common-jvm to 3.0.1

### ❤️ Thank You

- Tine Kondo @tinesoft

# 9.0.0 (2025-03-14)

### 🚀 Features

- ⚠️  update Nx workspace to `v20.1.2` ([8989698](https://github.com/tinesoft/nxrocks/commit/8989698))

### ⚠️  Breaking Changes

- Nx `v20` is now the minimal version to use the plugins

### 🧱 Updated Dependencies

- Updated common-jvm to 3.0.0

### ❤️ Thank You

- Tine Kondo

## 8.2.6 (2024-08-09)


### 🩹 Fixes

- migrate to `file references` strategy for tracking versions of packages ([31bc93b](https://github.com/tinesoft/nxrocks/commit/31bc93b))


### 🧱 Updated Dependencies

- Updated common-jvm to 2.0.8


### ❤️  Thank You

- Tine Kondo @tinesoft

## 8.2.5 (2024-08-08)


### 🩹 Fixes

- migrate to `workspace references` strategy for tracking versions of packages ([1a40ba7](https://github.com/tinesoft/nxrocks/commit/1a40ba7))


### ❤️  Thank You

- Tine Kondo @tinesoft

## 8.2.4 (2024-08-07)


### 🩹 Fixes

- fix incorrect versioning of packages and their internal dependencies ([080f250](https://github.com/tinesoft/nxrocks/commit/080f250))


### 🧱 Updated Dependencies

- Updated common-jvm to 2.0.6


### ❤️  Thank You

- Tine Kondo @tinesoft

## 8.2.3 (2024-07-21)


### 🧱 Updated Dependencies

- Updated common-jvm to 2.0.5

## 8.2.2 (2024-07-19)


### 🩹 Fixes

- generating projects does not properly consider the option to keep project level wrapper files ([74b38d5](https://github.com/tinesoft/nxrocks/commit/74b38d5))

- **nx-quarkus:** support javaVersion argument override for nx-quarkus package ([dcd4e37](https://github.com/tinesoft/nxrocks/commit/dcd4e37))


### 🧱 Updated Dependencies

- Updated common-jvm to 2.0.4


### ❤️  Thank You

- Cameron-C-Chapman @Cameron-C-Chapman
- Tine Kondo @tinesoft

## 8.2.1 (2024-06-23)

### 🩹 Fixes

- fix `mvnw` or `gradlew` no longer generated when creating simple projects ([95ee167](https://github.com/tinesoft/nxrocks/commit/95ee167))

### 🧱 Updated Dependencies

- Updated common-jvm to null

### ❤️ Thank You

- Tine Kondo @tinesoft

## 8.2.0 (2024-06-19)

### 🚀 Features

- remove the prompt to keep project level wrapper (`false` by default) ([d3b89b3](https://github.com/tinesoft/nxrocks/commit/d3b89b3))

### 🩹 Fixes

- make `build` target cacheable again ([bc523a2](https://github.com/tinesoft/nxrocks/commit/bc523a2))

### 🧱 Updated Dependencies

- Updated common-jvm to null

### ❤️ Thank You

- Tine Kondo @tinesoft

## 8.1.0 (2024-06-16)

### 🚀 Features

- **nx-quarkus:** add option to choose which version of Java to use ([6ef262c](https://github.com/tinesoft/nxrocks/commit/6ef262c))

### 🩹 Fixes

- add empty `targets` in `project.json` when generating projects with inferred tasks ([88a6e8a](https://github.com/tinesoft/nxrocks/commit/88a6e8a))

### 🧱 Updated Dependencies

- Updated common-jvm to 2.0.3

### ❤️ Thank You

- Tine Kondo @tinesoft

## 8.0.2 (2024-05-01)

### 🩹 Fixes

- bump internal packages version ([232e7d7](https://github.com/tinesoft/nxrocks/commit/232e7d7))

- **nx-quarkus:** fix `undefined (reading 'applied')` when generating the project graph ([50ed737](https://github.com/tinesoft/nxrocks/commit/50ed737))

### ❤️ Thank You

- Tine Kondo @tinesoft

## 8.0.1 (2024-03-28)

### 🩹 Fixes

- bump versions of packages to include changes in `common@4.0.1` ([796333a](https://github.com/tinesoft/nxrocks/commit/796333a))

### ❤️ Thank You

- Tine Kondo @tinesoft

# 8.0.0 (2024-03-26)

### 🚀 Features

- ⚠️ update to support `inferred tasks` (Nx `Project Crystal`) ([8a21e3f](https://github.com/tinesoft/nxrocks/commit/8a21e3f))

### 🩹 Fixes

- remove `gen`, `init`, and `generate` aliases for `project` generator ([e39ad3a](https://github.com/tinesoft/nxrocks/commit/e39ad3a))

- ⚠️ do not generate `targets` at parent module level and lets Nx manage dependencies entirely ([f37531f](https://github.com/tinesoft/nxrocks/commit/f37531f))

- fix base version for `@nx/devkit` to `>=18.0.0` ([d048cfe](https://github.com/tinesoft/nxrocks/commit/d048cfe))

#### ⚠️ Breaking Changes

- Nx `v18` is now the minimal version to use the plugins
- `project.json` of parent module no longer contain `targets` (i.e no `build`, `install`, etc task anymore)

### ❤️ Thank You

- Tine Kondo @tinesoft

# [7.3.0](https://github.com/tinesoft/nxrocks/compare/nx-quarkus/v7.2.2...nx-quarkus/v7.3.0) (2024-02-18)

### Bug Fixes

- **common-jvm:** fix `Project Graph` dependencies collection for projects using `Gradle` ([6df1ff3](https://github.com/tinesoft/nxrocks/commit/6df1ff30ebcc516c21b654d5c5a3bb7107bfd732))
- **common-jvm:** include `settings.gradle[.kts]` files when creating nodes for ProjectGraph v2 ([df9f195](https://github.com/tinesoft/nxrocks/commit/df9f195df0dbaaa332b50122c73b452a09e85b08))
- **common:** fix creation of dependencies between nodes for ProjectGraph v2 ([fa08ae0](https://github.com/tinesoft/nxrocks/commit/fa08ae0517982d7e11086137abd4098efde9f788))
- fix `create-nx-*` broken due to changes in Nx Cloud setup since Nx `v17.3.0` ([6c981d4](https://github.com/tinesoft/nxrocks/commit/6c981d4a75e6b53bd595642e8087496b246edcbd))
- fix Project Graph generation when creating projects in nested folders ([b5698d3](https://github.com/tinesoft/nxrocks/commit/b5698d359b66d99a8e56d20798912a0dc66e598b))

### Features

- **common-jvm:** improve retrieval of `groupId`and `artifactId` when defined at parent level ([9ea99ca](https://github.com/tinesoft/nxrocks/commit/9ea99cafe6f13eeb86ea2e09f0de16af9bc344c6))
- **common-jvm:** add constant listing common JVM build files ([68cd945](https://github.com/tinesoft/nxrocks/commit/68cd94599cef3cb6922526e8ecc34296b5cf426e))
- **common-jvm:** extends the search for content inside a project file to its prent module ([869400d](https://github.com/tinesoft/nxrocks/commit/869400d4309fd180051f30d81a6592578d20a43c))
- **common-jvm:** update utils for better support for `Maven` and `Gradle` muti-module projects ([b211fda](https://github.com/tinesoft/nxrocks/commit/b211fdaf09a978e991c1222338d128da463e633b))
- **common:** add utilities to generate Project Graph using `v2` API ([c6f70e0](https://github.com/tinesoft/nxrocks/commit/c6f70e0c4fc8ee9fe235dba05e14e453c3617b90))
- **common:** update Project Graph generation for JVM projects with child modules ([d9aba7f](https://github.com/tinesoft/nxrocks/commit/d9aba7fee887945240765a05275c3120e061be94))
- generate the `build.gradle[.kts]` file when initializing the parent àGradle` module ([9b90c4f](https://github.com/tinesoft/nxrocks/commit/9b90c4f869418fc81b65f1c281d846cbd2d39475))
- improve multi-module support for `Maven` and `Gradle` projects ([c4e0389](https://github.com/tinesoft/nxrocks/commit/c4e0389b0c166a4c74d1d5202183b155a4064c5c))
- **nx-quarkus:** migrate Project Graph generation to `v2` API ([5aad2fc](https://github.com/tinesoft/nxrocks/commit/5aad2fc684e9f0343a66d20554f3752f5db153ca))

## [7.2.2](https://github.com/tinesoft/nxrocks/compare/nx-quarkus/v7.2.1...nx-quarkus/v7.2.2) (2023-12-16)

### Bug Fixes

- **common-jvm:** fix `checkForModule` util to match gradle child module names w/ arbitrary paths ([759c02f](https://github.com/tinesoft/nxrocks/commit/759c02f69bc63e25067af981dcade650a639ea52))

## [7.2.1](https://github.com/tinesoft/nxrocks/compare/nx-quarkus/v7.2.0...nx-quarkus/v7.2.1) (2023-12-12)

### Bug Fixes

- **nx-spring-boot:** fix generated parent `pom.xml` of a multi-module project was not valid ([02b1e2d](https://github.com/tinesoft/nxrocks/commit/02b1e2ddec341ca611fe73c497703a33f96ab156))

# [7.2.0](https://github.com/tinesoft/nxrocks/compare/nx-quarkus/v7.1.1...nx-quarkus/v7.2.0) (2023-12-12)

### Features

- add `projectNameAndRootFormat` option to better control where projects are generated ([5c449b5](https://github.com/tinesoft/nxrocks/commit/5c449b58265295b953a355890a7102b20c3ab094))
- add migrations to automate making `serve`-like targets depend on `^install` ([f3449ea](https://github.com/tinesoft/nxrocks/commit/f3449ea8a2843d4b763dd9c361e72e034fb84982))
- make `serve`-like targets depend on `^install` to automatically install dependencies first ([c85b7a6](https://github.com/tinesoft/nxrocks/commit/c85b7a6c398a849cddb403a8013c68723d47f9b9))

## [7.1.1](https://github.com/tinesoft/nxrocks/compare/nx-quarkus/v7.1.0...nx-quarkus/v7.1.1) (2023-11-25)

### Bug Fixes

- **common-jvm:** fix bug when checking if an xml node is empty ([9f956a0](https://github.com/tinesoft/nxrocks/commit/9f956a04b7234319ee7be3e02c1c5f871050de5b))

# [7.1.0](https://github.com/tinesoft/nxrocks/compare/nx-quarkus/v7.0.3...nx-quarkus/v7.1.0) (2023-11-22)

### Bug Fixes

- **common-jvm:** improve utility method to disable a Gradle plugin ([8e1e5b9](https://github.com/tinesoft/nxrocks/commit/8e1e5b9fc9b9e07fd0c8f9d2cbfc31a809416873))

### Features

- make `install` target depend on the one from the dependency ([b2878dc](https://github.com/tinesoft/nxrocks/commit/b2878dca47f660c8faa9e1caf0733550abda17cb))

## [7.0.3](https://github.com/tinesoft/nxrocks/compare/nx-quarkus/v7.0.2...nx-quarkus/v7.0.3) (2023-11-16)

### Bug Fixes

- hide `preset` generators from `Nx Console` and improve generators decription ([c868384](https://github.com/tinesoft/nxrocks/commit/c868384a03963c8636f5fe161d619ba4f32324c9))

## [7.0.2](https://github.com/tinesoft/nxrocks/compare/nx-quarkus/v7.0.1...nx-quarkus/v7.0.2) (2023-10-31)

### Bug Fixes

- **common-jvm:** fix parent module not found when `runFromParentModule` flag is `true` ([840f8f6](https://github.com/tinesoft/nxrocks/commit/840f8f6dfa4c4d2a69c1f6d0e7b7ba472862050d))

## [7.0.1](https://github.com/tinesoft/nxrocks/compare/nx-quarkus/v7.0.0...nx-quarkus/v7.0.1) (2023-10-28)

### Bug Fixes

- **common:** simplify the path to common utils ([c87be7f](https://github.com/tinesoft/nxrocks/commit/c87be7f883053cd31cd3015712b6929ddea4fdc7))
- remove explicit dependency on `@nx/devkit` (inherited from `common`) ([a1d44c9](https://github.com/tinesoft/nxrocks/commit/a1d44c9eed3cf73216aaf70c9f47c9eef0753215))

# [7.0.0](https://github.com/tinesoft/nxrocks/compare/nx-quarkus/v6.1.0...nx-quarkus/v7.0.0) (2023-10-22)

### Bug Fixes

- **common:** update dependencies used by the `common` module ([e78ae32](https://github.com/tinesoft/nxrocks/commit/e78ae32a157d7823aab64454ccd637a4f4a505dc))

### Features

- **common-jvm:** move common JVM-related utils to a dedicated package ([1bf12fb](https://github.com/tinesoft/nxrocks/commit/1bf12fb38650261584e7face404f5477470dc40d))
- **common:** allow setting cacheable operations when add the plugin to `nx.json` ([9fb5177](https://github.com/tinesoft/nxrocks/commit/9fb51770c991912a6c8d9bc1b99af4f171f1df58))
- **nx-quarkus:** add `install` target to cacheable operations ([613ff5f](https://github.com/tinesoft/nxrocks/commit/613ff5f0348ebc3209d65171ae9bdf61d6dc6f59))
- **nx-quarkus:** add migration to add `install` target in cacheable operations ([213720f](https://github.com/tinesoft/nxrocks/commit/213720fe2388b511b84e97a3fd1d456814bf9683))
- update to Nx workspace `v17.x.x` ([c5b4ef3](https://github.com/tinesoft/nxrocks/commit/c5b4ef3db2bb8b5e5b2e09a09892a09c4c52b017)), closes [#195](https://github.com/tinesoft/nxrocks/issues/195)

### BREAKING CHANGES

- Nx `v17.x.x` is now the minimum required version to use the plugin

# [6.1.0](https://github.com/tinesoft/nxrocks/compare/nx-quarkus/v6.0.3...nx-quarkus/v6.1.0) (2023-10-08)

### Bug Fixes

- **common:** fix ProjectGraph for `Gradle` multi-module projects ([0ef0d17](https://github.com/tinesoft/nxrocks/commit/0ef0d1736fe100002ab2d547b830ab9de0e42a19))

### Features

- **common-cli:** add `common-cli` to share code among our `create-*` CLI packages ([bcb5fd2](https://github.com/tinesoft/nxrocks/commit/bcb5fd2a0cda945b708fb0e42195bde82cac47c7))
- **common:** add utilities for multi-module `maven`/`gradle` projects ([f2e4939](https://github.com/tinesoft/nxrocks/commit/f2e49396bd5fec312c401040c5511567a092a18c))
- **common:** add utilities to add `maven`/`gradle` modules ([2237201](https://github.com/tinesoft/nxrocks/commit/2237201646307ade853c180f5b25e9e2e56e5ad7))
- **create-nx-quarkus:** add custom CLI to create Quarkus projects ([7c6dae3](https://github.com/tinesoft/nxrocks/commit/7c6dae368e8ea4b3d81e3a1ec9070e6eb16ff13b))
- **create-nx-spring-boot:** add custom CLI to create Spring Boot projects ([32ca53c](https://github.com/tinesoft/nxrocks/commit/32ca53c61cc1c25027d72434e13b71ec1a100acb))
- **nx-quarkus:** add support for creating multi-modules projects ([e8094f7](https://github.com/tinesoft/nxrocks/commit/e8094f7632ad2a19a943fcb0eeb3a8f63fc310ab))
- **nx-spring-boot:** add support for creating multi-modules projects ([7c2de5a](https://github.com/tinesoft/nxrocks/commit/7c2de5a07f92fad481f3bda5ce61a71ba78c89c0))
- update dependencies and fix lint issues ([cfac383](https://github.com/tinesoft/nxrocks/commit/cfac383c7d2aebd329a98f410df66b726b64d28a))

## [6.0.3](https://github.com/tinesoft/nxrocks/compare/nx-quarkus/v6.0.2...nx-quarkus/v6.0.3) (2023-05-12)

### Bug Fixes

- **common:** fix dependency graph generation failure on `windows` OS ([26ef7c4](https://github.com/tinesoft/nxrocks/commit/26ef7c476cd4bc158b4df818a84be428a25c6adc)), closes [#170](https://github.com/tinesoft/nxrocks/issues/170)
- **common:** fix deprecated usage of dependency graph API ([badf089](https://github.com/tinesoft/nxrocks/commit/badf089040b31682df94c97818bf7e96201d42f9))

## [6.0.2](https://github.com/tinesoft/nxrocks/compare/nx-quarkus/v6.0.1...nx-quarkus/v6.0.2) (2023-05-06)

### Bug Fixes

- loosen `peerDependencies` on `@nx/*` to support v16.0.0 AND higher ([fb2f8df](https://github.com/tinesoft/nxrocks/commit/fb2f8df907fe9a498cc310862f08571e6c87dd6b))

## [6.0.1](https://github.com/tinesoft/nxrocks/compare/nx-quarkus/v6.0.0...nx-quarkus/v6.0.1) (2023-05-04)

### Bug Fixes

- **common:** bump version of `@nxrocks/common` for Nx 16 support ([980a86f](https://github.com/tinesoft/nxrocks/commit/980a86fe0ee16e7d0efb5578b3eef45a00ac9654)), closes [#169](https://github.com/tinesoft/nxrocks/issues/169)

# [6.0.0](https://github.com/tinesoft/nxrocks/compare/nx-quarkus/v5.0.0...nx-quarkus/v6.0.0) (2023-05-03)

### Features

- update to Nx workspace `v16.0.0` ([ab11ea8](https://github.com/tinesoft/nxrocks/commit/ab11ea89becafa9555f43527c95167827089a6e6))

### BREAKING CHANGES

- Nx `v16.x.x` is now the minimum required version to use the plugin

# [5.0.0](https://github.com/tinesoft/nxrocks/compare/nx-quarkus/v4.3.0...nx-quarkus/v5.0.0) (2023-04-10)

### Bug Fixes

- **common:** connections over Proxy not using correct `HTTP` protocol ([5cd3551](https://github.com/tinesoft/nxrocks/commit/5cd3551cf91acf5eca05b26ce4df1944011f86b8)), closes [#158](https://github.com/tinesoft/nxrocks/issues/158)
- **nx-quarkus:** add `x-dropdown` to improve UX of `link` generator ([a6cc550](https://github.com/tinesoft/nxrocks/commit/a6cc5508a0ca348042e2ea9704c62ad3178f7565))

### Features

- **common:** add `addMavenProperty` helper and improve `xpath` matching ([9f89c08](https://github.com/tinesoft/nxrocks/commit/9f89c081eefc9bd168e964bf80416c5e7ad3289a))
- **common:** add `MavenDependency` model ([5ab8c1d](https://github.com/tinesoft/nxrocks/commit/5ab8c1d89d0cc31a997bc65d3cd7d9042604a3fc))
- **nx-ktor:** add `nx-ktor` plugin ([cb74a79](https://github.com/tinesoft/nxrocks/commit/cb74a79d23a79b1eda79c2555d092d8151cf7e49))
- **nx-quarkus:** add dynamic prompt to fetch quarkus extensions list ([e937649](https://github.com/tinesoft/nxrocks/commit/e937649289696fbdaf7bacd19d0f736ee53a1534))
- **nx-quarkus:** improve logging when cannot generate project ([115c7de](https://github.com/tinesoft/nxrocks/commit/115c7de21ca3d2558989580c5de901f5e6ca914d))

### BREAKING CHANGES

- **nx-quarkus:** Nx `v15.8.x` is now the minimum required version to run the plugin

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
