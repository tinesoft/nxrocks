## 2.2.1 (2024-03-26)


### 🩹 Fixes

- fix base version for `@nx/devkit` to `>=18.0.0` ([d048cfe](https://github.com/tinesoft/nxrocks/commit/d048cfe))


### ❤️  Thank You

- Tine Kondo @tinesoft

# [2.2.0](https://github.com/tinesoft/nxrocks/compare/common-cli/v2.1.0...common-cli/v2.2.0) (2024-02-18)


### Bug Fixes

* fix `create-nx-*` broken due to changes in Nx Cloud setup since Nx `v17.3.0` ([6c981d4](https://github.com/tinesoft/nxrocks/commit/6c981d4a75e6b53bd595642e8087496b246edcbd))


### Features

* **common:** add utilities to generate Project Graph using `v2` API ([c6f70e0](https://github.com/tinesoft/nxrocks/commit/c6f70e0c4fc8ee9fe235dba05e14e453c3617b90))

# [2.1.0](https://github.com/tinesoft/nxrocks/compare/common-cli/v2.0.1...common-cli/v2.1.0) (2023-12-12)


### Features

* add `projectNameAndRootFormat` option to better control where projects are generated ([5c449b5](https://github.com/tinesoft/nxrocks/commit/5c449b58265295b953a355890a7102b20c3ab094))

## [2.0.1](https://github.com/tinesoft/nxrocks/compare/common-cli/v2.0.0...common-cli/v2.0.1) (2023-10-28)


### Bug Fixes

* **common-cli:** loosen dependencies on `@nx/devkit` and `create-nx-workspace` ([18b1175](https://github.com/tinesoft/nxrocks/commit/18b1175a15f52839aa0700dfbb9fa9ae309f109e))

# [2.0.0](https://github.com/tinesoft/nxrocks/compare/common-cli/v1.0.0...common-cli/v2.0.0) (2023-10-22)


### Features

* **common-jvm:** move common JVM-related utils to a dedicated package ([1bf12fb](https://github.com/tinesoft/nxrocks/commit/1bf12fb38650261584e7face404f5477470dc40d))
* update to Nx workspace `v17.x.x` ([c5b4ef3](https://github.com/tinesoft/nxrocks/commit/c5b4ef3db2bb8b5e5b2e09a09892a09c4c52b017)), closes [#195](https://github.com/tinesoft/nxrocks/issues/195)


### BREAKING CHANGES

* Nx `v17.x.x` is now the minimum required version to use the plugin

# 1.0.0 (2023-10-08)


### Bug Fixes

* correct `TypeError: builder.getProjectGraph is not a function` ([3458f66](https://github.com/tinesoft/nxrocks/commit/3458f668f6f3420140fef25f908b08c26511f433)), closes [#72](https://github.com/tinesoft/nxrocks/issues/72)
* plugins include spec files in distributed pkg ([21bac53](https://github.com/tinesoft/nxrocks/commit/21bac5398c05be293cd250e46814b8f86468bc4f))


### Features

* **common-cli:** add `common-cli` to share code among our `create-*` CLI packages ([bcb5fd2](https://github.com/tinesoft/nxrocks/commit/bcb5fd2a0cda945b708fb0e42195bde82cac47c7))
* **common:** add utility method to get http[s] proxy agent ([da61925](https://github.com/tinesoft/nxrocks/commit/da619254be5699930a6f5bd2e7ea65475509b730))
* **common:** add utility to unzip a zip stream ([a472c00](https://github.com/tinesoft/nxrocks/commit/a472c00cdf32bf6513914cf031de4adef107e9f6))
* **create-nx-spring-boot:** add custom CLI to create Spring Boot projects ([32ca53c](https://github.com/tinesoft/nxrocks/commit/32ca53c61cc1c25027d72434e13b71ec1a100acb))
* **nx-flutter:** add nx-flutter plugin ([e7426e9](https://github.com/tinesoft/nxrocks/commit/e7426e99a449c774d3f9408ac49711974d9855a0))
* **nx-flutter:** add support for Nx 's dependency graph generation ([6fb58de](https://github.com/tinesoft/nxrocks/commit/6fb58de673c968f78e72eec6eda7806760a72419)), closes [#28](https://github.com/tinesoft/nxrocks/issues/28)
* **nx-flutter:** auto-adapt prompt & builders based on previous answers ([668dd28](https://github.com/tinesoft/nxrocks/commit/668dd285aad1a37b7444cadc6702d14b2482f795)), closes [#26](https://github.com/tinesoft/nxrocks/issues/26)
* **nx-flutter:** migrate to Nrwl's DevKit executors/generators API ([8c72ed5](https://github.com/tinesoft/nxrocks/commit/8c72ed5dbbb7f382f1206ebe6b019d74362f046b))
* **nx-ktor:** add `nx-ktor` plugin ([cb74a79](https://github.com/tinesoft/nxrocks/commit/cb74a79d23a79b1eda79c2555d092d8151cf7e49))
* **nx-melos:** add `nx-melos` plugin ([4fb5da8](https://github.com/tinesoft/nxrocks/commit/4fb5da8c7883e9a8703383bcf683a533269fc047))
* **nx-micronaut:** add `nx-micronaut` plugin ([08d6099](https://github.com/tinesoft/nxrocks/commit/08d6099001bbfff830963584598da3d6a3eac66c))
* **nx-quarkus:** add plugin to integrate `Quarkus` inside Nx workspace ([2f7c6c0](https://github.com/tinesoft/nxrocks/commit/2f7c6c0537629027ebffce3173df2cc6278ca29d))
* **nx-spring-boot:** add `application` schematics ([f22e63f](https://github.com/tinesoft/nxrocks/commit/f22e63f1f133d92907cf457a8d817a5e9df13dfe))
* **nx-spring-boot:** add support for Nx's dependency graph generation ([95abe9d](https://github.com/tinesoft/nxrocks/commit/95abe9d297d166199f3ab1e6c761efdeffca02d0))
* **nx-spring-boot:** migrate to Nrwl's DevKit executors/generators API ([47231fd](https://github.com/tinesoft/nxrocks/commit/47231fd9a2a9791e929837144b4dbf080be0385f))
* update dependencies and fix lint issues ([cfac383](https://github.com/tinesoft/nxrocks/commit/cfac383c7d2aebd329a98f410df66b726b64d28a))
* update to Nx workspace `v15.0.0` ([a0af206](https://github.com/tinesoft/nxrocks/commit/a0af2064acbd8e65b4f603ca9e3ce2c6ce990795)), closes [#138](https://github.com/tinesoft/nxrocks/issues/138)


### BREAKING CHANGES

* Nx `v15.x.x` is now the minimum required version to use the plugin
* Nx v12.6.x is now the minimum version required to use the plugins

This is due to breaking changes in DevKit's project graph API starting from v12.6.x
* **nx-flutter:** Nx workspace v11 is now the minimum version required to use this plugin.

In fact, all builders/schematics have been rewritten into executors/generators using its new `@nrwl/devkit` API.
* **nx-spring-boot:** Nx workspace v11 is now the minimum version required to use this plugin.

In fact, all builders/schematics have been rewritten into executors/generators using its new `@nrwl/devkit` API.
