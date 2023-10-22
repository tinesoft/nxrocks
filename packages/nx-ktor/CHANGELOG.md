# [2.1.0](https://github.com/tinesoft/nxrocks/compare/nx-ktor/v2.0.5...nx-ktor/v2.1.0) (2023-10-08)


### Bug Fixes

* **common:** fix ProjectGraph for `Gradle` multi-module projects ([0ef0d17](https://github.com/tinesoft/nxrocks/commit/0ef0d1736fe100002ab2d547b830ab9de0e42a19))


### Features

* **common-cli:** add `common-cli` to share code among our `create-*` CLI packages ([bcb5fd2](https://github.com/tinesoft/nxrocks/commit/bcb5fd2a0cda945b708fb0e42195bde82cac47c7))
* **common:** add utilities for multi-module `maven`/`gradle` projects ([f2e4939](https://github.com/tinesoft/nxrocks/commit/f2e49396bd5fec312c401040c5511567a092a18c))
* **common:** add utilities to add `maven`/`gradle` modules ([2237201](https://github.com/tinesoft/nxrocks/commit/2237201646307ade853c180f5b25e9e2e56e5ad7))
* **create-nx-ktor:** add custom CLI to create Ktor projects ([882d382](https://github.com/tinesoft/nxrocks/commit/882d3826e4bc6ec3ed386ded3cc0d752bd5c4077))
* **create-nx-spring-boot:** add custom CLI to create Spring Boot projects ([32ca53c](https://github.com/tinesoft/nxrocks/commit/32ca53c61cc1c25027d72434e13b71ec1a100acb))
* **nx-ktor:** add support for creating multi-modules projects ([b1ad355](https://github.com/tinesoft/nxrocks/commit/b1ad35545774ec1d1937608f25a10c41303595db))
* **nx-spring-boot:** add support for creating multi-modules projects ([7c2de5a](https://github.com/tinesoft/nxrocks/commit/7c2de5a07f92fad481f3bda5ce61a71ba78c89c0))
* update dependencies and fix lint issues ([cfac383](https://github.com/tinesoft/nxrocks/commit/cfac383c7d2aebd329a98f410df66b726b64d28a))

## [2.0.5](https://github.com/tinesoft/nxrocks/compare/nx-ktor/v2.0.4...nx-ktor/v2.0.5) (2023-05-25)


### Bug Fixes

* **nx-ktor:** add missing executors in the `executors.json` file ([ef6aed5](https://github.com/tinesoft/nxrocks/commit/ef6aed5c1d221bc1ee59f7e07883da582cd8303f))
* **nx-ktor:** remove `library` project type in `project` generator ([c5c47c7](https://github.com/tinesoft/nxrocks/commit/c5c47c7a2cfb34647fce43a49809e75e7cc243f5))

## [2.0.4](https://github.com/tinesoft/nxrocks/compare/nx-ktor/v2.0.3...nx-ktor/v2.0.4) (2023-05-25)


### Bug Fixes

* **nx-ktor:** update and align default versions with  `Ktor Starter` ([134c709](https://github.com/tinesoft/nxrocks/commit/134c709cf5e944c6a37fa464110ab1b21c8b3506))

## [2.0.3](https://github.com/tinesoft/nxrocks/compare/nx-ktor/v2.0.2...nx-ktor/v2.0.3) (2023-05-12)


### Bug Fixes

* **common:** fix dependency graph generation failure on `windows` OS ([26ef7c4](https://github.com/tinesoft/nxrocks/commit/26ef7c476cd4bc158b4df818a84be428a25c6adc)), closes [#170](https://github.com/tinesoft/nxrocks/issues/170)
* **common:** fix deprecated usage of dependency graph API ([badf089](https://github.com/tinesoft/nxrocks/commit/badf089040b31682df94c97818bf7e96201d42f9))

## [2.0.2](https://github.com/tinesoft/nxrocks/compare/nx-ktor/v2.0.1...nx-ktor/v2.0.2) (2023-05-06)


### Bug Fixes

* loosen `peerDependencies` on `@nx/*` to support v16.0.0 AND higher ([fb2f8df](https://github.com/tinesoft/nxrocks/commit/fb2f8df907fe9a498cc310862f08571e6c87dd6b))

## [2.0.1](https://github.com/tinesoft/nxrocks/compare/nx-ktor/v2.0.0...nx-ktor/v2.0.1) (2023-05-04)


### Bug Fixes

* **common:** bump version of `@nxrocks/common` for Nx 16 support ([980a86f](https://github.com/tinesoft/nxrocks/commit/980a86fe0ee16e7d0efb5578b3eef45a00ac9654)), closes [#169](https://github.com/tinesoft/nxrocks/issues/169)

# [2.0.0](https://github.com/tinesoft/nxrocks/compare/nx-ktor/v1.0.1...nx-ktor/v2.0.0) (2023-05-03)


### Features

* update to Nx workspace `v16.0.0` ([ab11ea8](https://github.com/tinesoft/nxrocks/commit/ab11ea89becafa9555f43527c95167827089a6e6))


### BREAKING CHANGES

* Nx `v16.x.x` is now the minimum required version to use the plugin

## [1.0.1](https://github.com/tinesoft/nxrocks/compare/nx-ktor/v1.0.0...nx-ktor/v1.0.1) (2023-04-11)


### Bug Fixes

* **nx-ktor:** fix wrong `package.json` shipped ([cbfc734](https://github.com/tinesoft/nxrocks/commit/cbfc734762fee85e13583f2975eae720a371c9fd))

# 1.0.0 (2023-04-10)


### Features

* **nx-ktor:** add `nx-ktor` plugin ([cb74a79](https://github.com/tinesoft/nxrocks/commit/cb74a79d23a79b1eda79c2555d092d8151cf7e49))
