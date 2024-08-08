## 4.1.5 (2024-08-08)


### 🩹 Fixes

- migrate to `workspace references` strategy for tracking versions of packages ([1a40ba7](https://github.com/tinesoft/nxrocks/commit/1a40ba7))


### ❤️  Thank You

- Tine Kondo @tinesoft

## 4.1.4 (2024-08-07)


### 🩹 Fixes

- fix incorrect versioning of packages and their internal dependencies ([080f250](https://github.com/tinesoft/nxrocks/commit/080f250))


### 🧱 Updated Dependencies

- Updated common-jvm to 2.0.6


### ❤️  Thank You

- Tine Kondo @tinesoft

## 4.1.3 (2024-07-21)


### 🧱 Updated Dependencies

- Updated common-jvm to 2.0.5

## 4.1.2 (2024-07-19)


### 🩹 Fixes

- generating projects does not properly consider the option to keep project level wrapper files ([74b38d5](https://github.com/tinesoft/nxrocks/commit/74b38d5))


### 🧱 Updated Dependencies

- Updated common-jvm to 2.0.4


### ❤️  Thank You

- Tine Kondo @tinesoft

## 4.1.1 (2024-06-23)

### 🩹 Fixes

- fix `mvnw` or `gradlew` no longer generated when creating simple projects ([95ee167](https://github.com/tinesoft/nxrocks/commit/95ee167))

### 🧱 Updated Dependencies

- Updated common-jvm to null

### ❤️ Thank You

- Tine Kondo @tinesoft

## 4.1.0 (2024-06-19)

### 🚀 Features

- remove the prompt to keep project level wrapper (`false` by default) ([d3b89b3](https://github.com/tinesoft/nxrocks/commit/d3b89b3))

### 🩹 Fixes

- make `build` target cacheable again ([bc523a2](https://github.com/tinesoft/nxrocks/commit/bc523a2))

### 🧱 Updated Dependencies

- Updated common-jvm to null

### ❤️ Thank You

- Tine Kondo @tinesoft

## 4.0.3 (2024-06-16)

### 🩹 Fixes

- add empty `targets` in `project.json` when generating projects with inferred tasks ([88a6e8a](https://github.com/tinesoft/nxrocks/commit/88a6e8a))

### 🧱 Updated Dependencies

- Updated common-jvm to 2.0.3

### ❤️ Thank You

- Tine Kondo @tinesoft

## 4.0.2 (2024-05-01)

### 🩹 Fixes

- bump internal packages version ([232e7d7](https://github.com/tinesoft/nxrocks/commit/232e7d7))

### ❤️ Thank You

- Tine Kondo @tinesoft

## 4.0.1 (2024-03-28)

### 🩹 Fixes

- bump versions of packages to include changes in `common@4.0.1` ([796333a](https://github.com/tinesoft/nxrocks/commit/796333a))

### ❤️ Thank You

- Tine Kondo @tinesoft

# 4.0.0 (2024-03-26)

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

# [3.3.0](https://github.com/tinesoft/nxrocks/compare/nx-ktor/v3.2.2...nx-ktor/v3.3.0) (2024-02-18)

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
- **nx-ktor:** migrate Project Graph generation to `v2` API ([4dd0a9d](https://github.com/tinesoft/nxrocks/commit/4dd0a9d4e762a16a5e6954a2e7d457c6ed50f3a9))

## [3.2.2](https://github.com/tinesoft/nxrocks/compare/nx-ktor/v3.2.1...nx-ktor/v3.2.2) (2023-12-16)

### Bug Fixes

- **common-jvm:** fix `checkForModule` util to match gradle child module names w/ arbitrary paths ([759c02f](https://github.com/tinesoft/nxrocks/commit/759c02f69bc63e25067af981dcade650a639ea52))

## [3.2.1](https://github.com/tinesoft/nxrocks/compare/nx-ktor/v3.2.0...nx-ktor/v3.2.1) (2023-12-12)

### Bug Fixes

- **nx-spring-boot:** fix generated parent `pom.xml` of a multi-module project was not valid ([02b1e2d](https://github.com/tinesoft/nxrocks/commit/02b1e2ddec341ca611fe73c497703a33f96ab156))

# [3.2.0](https://github.com/tinesoft/nxrocks/compare/nx-ktor/v3.1.1...nx-ktor/v3.2.0) (2023-12-12)

### Features

- add `projectNameAndRootFormat` option to better control where projects are generated ([5c449b5](https://github.com/tinesoft/nxrocks/commit/5c449b58265295b953a355890a7102b20c3ab094))
- add migrations to automate making `serve`-like targets depend on `^install` ([f3449ea](https://github.com/tinesoft/nxrocks/commit/f3449ea8a2843d4b763dd9c361e72e034fb84982))
- make `serve`-like targets depend on `^install` to automatically install dependencies first ([c85b7a6](https://github.com/tinesoft/nxrocks/commit/c85b7a6c398a849cddb403a8013c68723d47f9b9))

## [3.1.1](https://github.com/tinesoft/nxrocks/compare/nx-ktor/v3.1.0...nx-ktor/v3.1.1) (2023-11-25)

### Bug Fixes

- **common-jvm:** fix bug when checking if an xml node is empty ([9f956a0](https://github.com/tinesoft/nxrocks/commit/9f956a04b7234319ee7be3e02c1c5f871050de5b))

# [3.1.0](https://github.com/tinesoft/nxrocks/compare/nx-ktor/v3.0.3...nx-ktor/v3.1.0) (2023-11-22)

### Bug Fixes

- **common-jvm:** improve utility method to disable a Gradle plugin ([8e1e5b9](https://github.com/tinesoft/nxrocks/commit/8e1e5b9fc9b9e07fd0c8f9d2cbfc31a809416873))

### Features

- make `install` target depend on the one from the dependency ([b2878dc](https://github.com/tinesoft/nxrocks/commit/b2878dca47f660c8faa9e1caf0733550abda17cb))

## [3.0.3](https://github.com/tinesoft/nxrocks/compare/nx-ktor/v3.0.2...nx-ktor/v3.0.3) (2023-11-16)

### Bug Fixes

- hide `preset` generators from `Nx Console` and improve generators decription ([c868384](https://github.com/tinesoft/nxrocks/commit/c868384a03963c8636f5fe161d619ba4f32324c9))

## [3.0.2](https://github.com/tinesoft/nxrocks/compare/nx-ktor/v3.0.1...nx-ktor/v3.0.2) (2023-10-31)

### Bug Fixes

- **common-jvm:** fix parent module not found when `runFromParentModule` flag is `true` ([840f8f6](https://github.com/tinesoft/nxrocks/commit/840f8f6dfa4c4d2a69c1f6d0e7b7ba472862050d))

## [3.0.1](https://github.com/tinesoft/nxrocks/compare/nx-ktor/v3.0.0...nx-ktor/v3.0.1) (2023-10-28)

### Bug Fixes

- **common:** simplify the path to common utils ([c87be7f](https://github.com/tinesoft/nxrocks/commit/c87be7f883053cd31cd3015712b6929ddea4fdc7))
- **nx-ktor:** update the URL to generate Ktor projects ([3774c8a](https://github.com/tinesoft/nxrocks/commit/3774c8ae249ad8bc24c3fd9fe12f53e260eb847e))
- remove explicit dependency on `@nx/devkit` (inherited from `common`) ([a1d44c9](https://github.com/tinesoft/nxrocks/commit/a1d44c9eed3cf73216aaf70c9f47c9eef0753215))

# [3.0.0](https://github.com/tinesoft/nxrocks/compare/nx-ktor/v2.1.0...nx-ktor/v3.0.0) (2023-10-22)

### Bug Fixes

- **common:** update dependencies used by the `common` module ([e78ae32](https://github.com/tinesoft/nxrocks/commit/e78ae32a157d7823aab64454ccd637a4f4a505dc))

### Features

- **common-jvm:** move common JVM-related utils to a dedicated package ([1bf12fb](https://github.com/tinesoft/nxrocks/commit/1bf12fb38650261584e7face404f5477470dc40d))
- **common:** allow setting cacheable operations when add the plugin to `nx.json` ([9fb5177](https://github.com/tinesoft/nxrocks/commit/9fb51770c991912a6c8d9bc1b99af4f171f1df58))
- **nx-ktor:** add `install` target to cacheable operations ([1e37b6c](https://github.com/tinesoft/nxrocks/commit/1e37b6c9993f6902d7c4b392255e4b83918eb839))
- **nx-ktor:** add migration to add `install` target in cacheable operations ([bb13ccb](https://github.com/tinesoft/nxrocks/commit/bb13ccb93e40200d9966dd7d243d10779532ff9b))
- update to Nx workspace `v17.x.x` ([c5b4ef3](https://github.com/tinesoft/nxrocks/commit/c5b4ef3db2bb8b5e5b2e09a09892a09c4c52b017)), closes [#195](https://github.com/tinesoft/nxrocks/issues/195)

### BREAKING CHANGES

- Nx `v17.x.x` is now the minimum required version to use the plugin

# [2.1.0](https://github.com/tinesoft/nxrocks/compare/nx-ktor/v2.0.5...nx-ktor/v2.1.0) (2023-10-08)

### Bug Fixes

- **common:** fix ProjectGraph for `Gradle` multi-module projects ([0ef0d17](https://github.com/tinesoft/nxrocks/commit/0ef0d1736fe100002ab2d547b830ab9de0e42a19))

### Features

- **common-cli:** add `common-cli` to share code among our `create-*` CLI packages ([bcb5fd2](https://github.com/tinesoft/nxrocks/commit/bcb5fd2a0cda945b708fb0e42195bde82cac47c7))
- **common:** add utilities for multi-module `maven`/`gradle` projects ([f2e4939](https://github.com/tinesoft/nxrocks/commit/f2e49396bd5fec312c401040c5511567a092a18c))
- **common:** add utilities to add `maven`/`gradle` modules ([2237201](https://github.com/tinesoft/nxrocks/commit/2237201646307ade853c180f5b25e9e2e56e5ad7))
- **create-nx-ktor:** add custom CLI to create Ktor projects ([882d382](https://github.com/tinesoft/nxrocks/commit/882d3826e4bc6ec3ed386ded3cc0d752bd5c4077))
- **create-nx-spring-boot:** add custom CLI to create Spring Boot projects ([32ca53c](https://github.com/tinesoft/nxrocks/commit/32ca53c61cc1c25027d72434e13b71ec1a100acb))
- **nx-ktor:** add support for creating multi-modules projects ([b1ad355](https://github.com/tinesoft/nxrocks/commit/b1ad35545774ec1d1937608f25a10c41303595db))
- **nx-spring-boot:** add support for creating multi-modules projects ([7c2de5a](https://github.com/tinesoft/nxrocks/commit/7c2de5a07f92fad481f3bda5ce61a71ba78c89c0))
- update dependencies and fix lint issues ([cfac383](https://github.com/tinesoft/nxrocks/commit/cfac383c7d2aebd329a98f410df66b726b64d28a))

## [2.0.5](https://github.com/tinesoft/nxrocks/compare/nx-ktor/v2.0.4...nx-ktor/v2.0.5) (2023-05-25)

### Bug Fixes

- **nx-ktor:** add missing executors in the `executors.json` file ([ef6aed5](https://github.com/tinesoft/nxrocks/commit/ef6aed5c1d221bc1ee59f7e07883da582cd8303f))
- **nx-ktor:** remove `library` project type in `project` generator ([c5c47c7](https://github.com/tinesoft/nxrocks/commit/c5c47c7a2cfb34647fce43a49809e75e7cc243f5))

## [2.0.4](https://github.com/tinesoft/nxrocks/compare/nx-ktor/v2.0.3...nx-ktor/v2.0.4) (2023-05-25)

### Bug Fixes

- **nx-ktor:** update and align default versions with `Ktor Starter` ([134c709](https://github.com/tinesoft/nxrocks/commit/134c709cf5e944c6a37fa464110ab1b21c8b3506))

## [2.0.3](https://github.com/tinesoft/nxrocks/compare/nx-ktor/v2.0.2...nx-ktor/v2.0.3) (2023-05-12)

### Bug Fixes

- **common:** fix dependency graph generation failure on `windows` OS ([26ef7c4](https://github.com/tinesoft/nxrocks/commit/26ef7c476cd4bc158b4df818a84be428a25c6adc)), closes [#170](https://github.com/tinesoft/nxrocks/issues/170)
- **common:** fix deprecated usage of dependency graph API ([badf089](https://github.com/tinesoft/nxrocks/commit/badf089040b31682df94c97818bf7e96201d42f9))

## [2.0.2](https://github.com/tinesoft/nxrocks/compare/nx-ktor/v2.0.1...nx-ktor/v2.0.2) (2023-05-06)

### Bug Fixes

- loosen `peerDependencies` on `@nx/*` to support v16.0.0 AND higher ([fb2f8df](https://github.com/tinesoft/nxrocks/commit/fb2f8df907fe9a498cc310862f08571e6c87dd6b))

## [2.0.1](https://github.com/tinesoft/nxrocks/compare/nx-ktor/v2.0.0...nx-ktor/v2.0.1) (2023-05-04)

### Bug Fixes

- **common:** bump version of `@nxrocks/common` for Nx 16 support ([980a86f](https://github.com/tinesoft/nxrocks/commit/980a86fe0ee16e7d0efb5578b3eef45a00ac9654)), closes [#169](https://github.com/tinesoft/nxrocks/issues/169)

# [2.0.0](https://github.com/tinesoft/nxrocks/compare/nx-ktor/v1.0.1...nx-ktor/v2.0.0) (2023-05-03)

### Features

- update to Nx workspace `v16.0.0` ([ab11ea8](https://github.com/tinesoft/nxrocks/commit/ab11ea89becafa9555f43527c95167827089a6e6))

### BREAKING CHANGES

- Nx `v16.x.x` is now the minimum required version to use the plugin

## [1.0.1](https://github.com/tinesoft/nxrocks/compare/nx-ktor/v1.0.0...nx-ktor/v1.0.1) (2023-04-11)

### Bug Fixes

- **nx-ktor:** fix wrong `package.json` shipped ([cbfc734](https://github.com/tinesoft/nxrocks/commit/cbfc734762fee85e13583f2975eae720a371c9fd))

# 1.0.0 (2023-04-10)

### Features

- **nx-ktor:** add `nx-ktor` plugin ([cb74a79](https://github.com/tinesoft/nxrocks/commit/cb74a79d23a79b1eda79c2555d092d8151cf7e49))
