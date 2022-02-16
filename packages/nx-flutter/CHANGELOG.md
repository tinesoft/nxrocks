# [@nxrocks/nx-flutter-v3.0.2](https://github.com/tinesoft/nxrocks/compare/nx-flutter/v3.0.1...nx-flutter/v3.0.2) (2022-02-16)

### Bug Fixes

- wrong `@nxrocks/common` version referenced in dependent packages ([1b4b0e6](https://github.com/tinesoft/nxrocks/commit/1b4b0e6b1df604177585e703e092cf3652ef86b0))

# [@nxrocks/nx-flutter-v3.0.1](https://github.com/tinesoft/nxrocks/compare/nx-flutter/v3.0.0...nx-flutter/v3.0.1) (2022-02-15)

### Bug Fixes

- include updated `package.json` in git when semantic releasing ([cb87139](https://github.com/tinesoft/nxrocks/commit/cb87139c95ba2f7256a8df7ff0c94410394ccb4f))

# [@nxrocks/nx-flutter-v3.0.0](https://github.com/tinesoft/nxrocks/compare/nx-flutter/v2.1.0...nx-flutter/v3.0.0) (2021-08-23)

### Bug Fixes

- correct `TypeError: builder.getProjectGraph is not a function` ([3458f66](https://github.com/tinesoft/nxrocks/commit/3458f668f6f3420140fef25f908b08c26511f433)), closes [#72](https://github.com/tinesoft/nxrocks/issues/72)
- **nx-flutter:** add plugin to nx.json only if not included already ([b98c1e9](https://github.com/tinesoft/nxrocks/commit/b98c1e930fb4a2e1b3ca4bba98de66937f270084))

### Features

- **nx-flutter:** use `NX_VERBOSE_LOGGING` to control logs in dep graph ([e678ed5](https://github.com/tinesoft/nxrocks/commit/e678ed5255aff9ea0fcd2a515f61de3d13539b64))

### BREAKING CHANGES

- Nx v12.6.x is now the minimum version required to use the plugins

This is due to breaking changes in DevKit's project graph API starting from v12.6.x

# [@nxrocks/nx-flutter-v2.1.0](https://github.com/tinesoft/nxrocks/compare/nx-flutter/v2.0.0...nx-flutter/v2.1.0) (2021-04-26)

### Features

- **nx-flutter:** add support for Nx 's dependency graph generation ([6fb58de](https://github.com/tinesoft/nxrocks/commit/6fb58de673c968f78e72eec6eda7806760a72419)), closes [#28](https://github.com/tinesoft/nxrocks/issues/28)

# [@nxrocks/nx-flutter-v2.0.0](https://github.com/tinesoft/nxrocks/compare/nx-flutter/v1.3.0...nx-flutter/v2.0.0) (2021-04-02)

### Bug Fixes

- **nx-flutter:** fix error when generating module or package ([86eb3f8](https://github.com/tinesoft/nxrocks/commit/86eb3f872e9c89ec304f86352081299ea8cb0edd)), closes [#44](https://github.com/tinesoft/nxrocks/issues/44)

### Features

- **nx-flutter:** create project in `apps` or `libs` based on `template` ([dc20e0b](https://github.com/tinesoft/nxrocks/commit/dc20e0bf5b66d2b4fa9838f57fa91a55358e0a38)), closes [#41](https://github.com/tinesoft/nxrocks/issues/41)
- **nx-flutter:** migrate to Nrwl's DevKit executors/generators API ([8c72ed5](https://github.com/tinesoft/nxrocks/commit/8c72ed5dbbb7f382f1206ebe6b019d74362f046b))
- **nx-flutter:** rename the `application` generator into `project` ([6361557](https://github.com/tinesoft/nxrocks/commit/63615577bf48de00b10d1110a1d6582c2abbfda3))

### BREAKING CHANGES

- **nx-flutter:** the `app` alias has been replaced with one of [`proj`, `new`, `gen`, `init`, `generate`].
- **nx-flutter:** Nx workspace v11 is now the minimum version required to use this plugin.

In fact, all executors/schematics have been rewritten into executors/generators using its new `@nrwl/devkit` API.

# [@nxrocks/nx-flutter-v2.0.0-beta.1](https://github.com/tinesoft/nxrocks/compare/nx-flutter/v1.3.0...nx-flutter/v2.0.0-beta.1) (2021-04-02)

### Bug Fixes

- **nx-flutter:** fix error when generating module or package ([86eb3f8](https://github.com/tinesoft/nxrocks/commit/86eb3f872e9c89ec304f86352081299ea8cb0edd)), closes [#44](https://github.com/tinesoft/nxrocks/issues/44)

### Features

- **nx-flutter:** create project in `apps` or `libs` based on `template` ([dc20e0b](https://github.com/tinesoft/nxrocks/commit/dc20e0bf5b66d2b4fa9838f57fa91a55358e0a38)), closes [#41](https://github.com/tinesoft/nxrocks/issues/41)
- **nx-flutter:** migrate to Nrwl's DevKit executors/generators API ([8c72ed5](https://github.com/tinesoft/nxrocks/commit/8c72ed5dbbb7f382f1206ebe6b019d74362f046b))
- **nx-flutter:** rename the `application` generator into `project` ([6361557](https://github.com/tinesoft/nxrocks/commit/63615577bf48de00b10d1110a1d6582c2abbfda3))

### BREAKING CHANGES

- **nx-flutter:** the `app` alias has been replaced with one of [`proj`, `new`, `gen`, `init`, `generate`].
- **nx-flutter:** Nx workspace v11 is now the minimum version required to use this plugin.

In fact, all executors/schematics have been rewritten into executors/generators using its new `@nrwl/devkit` API.

# [1.3.0](https://github.com/tinesoft/nxrocks/compare/nx-flutter/v1.2.1...nx-flutter/v1.3.0) (2021-02-01)

### Bug Fixes

- **nx-flutter:** add missing `buildAar` builder ([44432eb](https://github.com/tinesoft/nxrocks/commit/44432eb37d2c849437a06af88f063a48d292d990))

### Features

- **nx-flutter:** add `create` alias to project generation schematics ([0386629](https://github.com/tinesoft/nxrocks/commit/03866292ea1a354a6eca43cb9ae7e691188736bd)), closes [#27](https://github.com/tinesoft/nxrocks/issues/27)
- **nx-flutter:** auto-adapt prompt & executors based on previous answers ([668dd28](https://github.com/tinesoft/nxrocks/commit/668dd285aad1a37b7444cadc6702d14b2482f795)), closes [#26](https://github.com/tinesoft/nxrocks/issues/26)

## [1.2.1](https://github.com/tinesoft/nxrocks/compare/nx-flutter/v1.2.0...nx-flutter/v1.2.1) (2021-01-13)

### Bug Fixes

- **nx-flutter:** correct generation error on multi word `description` ([1ed2d97](https://github.com/tinesoft/nxrocks/commit/1ed2d977421557fd8b6a7aad2ad05f93d226e552)), closes [#23](https://github.com/tinesoft/nxrocks/issues/23)

# [1.2.0](https://github.com/tinesoft/nxrocks/compare/nx-flutter/v1.1.0...nx-flutter/v1.2.0) (2021-01-12)

### Bug Fixes

- **nx-flutter:** correct generation error due to `platforms` option ([fc56c5e](https://github.com/tinesoft/nxrocks/commit/fc56c5e1f93f3af3a8529c5e24ad08ae4f63da4a)), closes [#22](https://github.com/tinesoft/nxrocks/issues/22)

### Features

- **nx-flutter:** add special instructions to generate the app ([d5f768a](https://github.com/tinesoft/nxrocks/commit/d5f768a87b375725af1a484277aca154abaa4ac6))

## [1.1.1](https://github.com/tinesoft/nxrocks/compare/nx-flutter/v1.1.0...nx-flutter/v1.1.1) (2021-01-11)

### Bug Fixes

- **nx-flutter:** correct generation error due to `platforms` option ([1b22dc6](https://github.com/tinesoft/nxrocks/commit/1b22dc6c26f2154cd7fce2a928a16261a4b21022)), closes [#22](https://github.com/tinesoft/nxrocks/issues/22)

# [1.1.0](https://github.com/tinesoft/nxrocks/compare/nx-flutter/v1.0.0...nx-flutter/v1.1.0) (2021-01-10)

### Features

- **nx-flutter:** improve typings for `template` and `platforms` options ([b614dc4](https://github.com/tinesoft/nxrocks/commit/b614dc41ebd92c4a1f2be34e3ff83ecf0608ba83))

# 1.0.0 (2021-01-06)

### Bug Fixes

- **nx-flutter:** add missing config for semantic-releasing ([06fd1bd](https://github.com/tinesoft/nxrocks/commit/06fd1bd3ea061a7b1f27d765ae077ec9906264d1))

### Features

- **nx-flutter:** add nx-flutter plugin ([e7426e9](https://github.com/tinesoft/nxrocks/commit/e7426e99a449c774d3f9408ac49711974d9855a0))
