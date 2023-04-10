# [6.0.0](https://github.com/tinesoft/nxrocks/compare/nx-flutter/v5.3.0...nx-flutter/v6.0.0) (2023-04-10)


### Bug Fixes

* **nx-flutter:** avoid generating files when running with `--dry-run` ([d539208](https://github.com/tinesoft/nxrocks/commit/d53920881014171e4b772173cc1f5f937fe2888f))


### Features

* **common:** add `addMavenProperty` helper and improve `xpath` matching ([9f89c08](https://github.com/tinesoft/nxrocks/commit/9f89c081eefc9bd168e964bf80416c5e7ad3289a))
* **common:** add `MavenDependency` model ([5ab8c1d](https://github.com/tinesoft/nxrocks/commit/5ab8c1d89d0cc31a997bc65d3cd7d9042604a3fc))
* **nx-flutter:** add support for Flutter Version Manager (`fvm`) ([e9af459](https://github.com/tinesoft/nxrocks/commit/e9af4590c5e8d2029cb4c39c86a1095253623beb))
* **nx-flutter:** leverage `NX_INTERACTIVE` for additional prompts ([ffb0591](https://github.com/tinesoft/nxrocks/commit/ffb0591cad36baef6afa68ccbcbe5418bdeb6086))
* **nx-ktor:** add `nx-ktor` plugin ([cb74a79](https://github.com/tinesoft/nxrocks/commit/cb74a79d23a79b1eda79c2555d092d8151cf7e49))


### BREAKING CHANGES

* **nx-flutter:** Nx `v15.8.x` is now the minimum required version to run the plugin

`skipAdditionalPrompts` option was removed (no longer necessary)

# [@nxrocks/nx-flutter-v5.3.0](https://github.com/tinesoft/nxrocks/compare/nx-flutter/v5.2.1...nx-flutter/v5.3.0) (2023-02-28)

### Bug Fixes

- improve schemas of generators for a better UX in `Nx Console` ([0214736](https://github.com/tinesoft/nxrocks/commit/02147369d855247538becf7730f088765f7734d4))

# [@nxrocks/nx-flutter-v5.2.0](https://github.com/tinesoft/nxrocks/compare/nx-flutter/v5.1.0...nx-flutter/v5.2.0) (2023-01-10)

### Bug Fixes

- **common:** fix bug when fetching dependencies of maven based projects ([2ada704](https://github.com/tinesoft/nxrocks/commit/2ada704f17bdf4a2bec5314b1faf2147c460e4b2))

# [@nxrocks/nx-flutter-v5.1.0](https://github.com/tinesoft/nxrocks/compare/nx-flutter/v5.0.0...nx-flutter/v5.1.0) (2022-12-05)

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

# [@nxrocks/nx-flutter-v5.0.0](https://github.com/tinesoft/nxrocks/compare/nx-flutter/v4.0.2...nx-flutter/v5.0.0) (2022-10-17)

### Bug Fixes

- **common:** fix regex used to fetch gradle dependencies ([f1779a4](https://github.com/tinesoft/nxrocks/commit/f1779a472c6c5ebeeec30674540b6d017478e4f7))
- **nx-micronaut:** fix generation without feature ([#136](https://github.com/tinesoft/nxrocks/issues/136)) ([76db010](https://github.com/tinesoft/nxrocks/commit/76db0106c1943a2f7517ca02b34e2cdf3c02f8f8))

### Features

- **common:** increase the `maxBuffer` when running executors commands ([4bc388d](https://github.com/tinesoft/nxrocks/commit/4bc388d5068aa73003bf09776757fe7b357bb0cf))
- **nx-micronaut:** update JDK version from `16` -> `17` ([a0e81e1](https://github.com/tinesoft/nxrocks/commit/a0e81e194a1c2ca21ec43d7d2831a6b4c7eb9ef8)), closes [#135](https://github.com/tinesoft/nxrocks/issues/135)
- update to Nx workspace `v15.0.0` ([a0af206](https://github.com/tinesoft/nxrocks/commit/a0af2064acbd8e65b4f603ca9e3ce2c6ce990795)), closes [#138](https://github.com/tinesoft/nxrocks/issues/138)

### BREAKING CHANGES

- Nx `v15.x.x` is now the minimum required version to use the plugin

# [@nxrocks/nx-flutter-v4.0.2](https://github.com/tinesoft/nxrocks/compare/nx-flutter/v4.0.1...nx-flutter/v4.0.2) (2022-08-25)

### Bug Fixes

- fix executor output not restored when found in Nx cache ([fbb385a](https://github.com/tinesoft/nxrocks/commit/fbb385ab2cb468c8b41b224e353d9b891bb4e48c)), closes [#111](https://github.com/tinesoft/nxrocks/issues/111)

# [@nxrocks/nx-flutter-v4.0.1](https://github.com/tinesoft/nxrocks/compare/nx-flutter/v4.0.0...nx-flutter/v4.0.1) (2022-08-22)

### Bug Fixes

- fix installation issue due to `hpagent` not being found ([3620d23](https://github.com/tinesoft/nxrocks/commit/3620d2329103076bbb4713bac48c4f0c734bd545)), closes [#128](https://github.com/tinesoft/nxrocks/issues/128)

# [@nxrocks/nx-flutter-v4.0.0](https://github.com/tinesoft/nxrocks/compare/nx-flutter/v3.0.2...nx-flutter/v4.0.0) (2022-08-21)

### Bug Fixes

- **nx-flutter:** fix non-interactive generation of flutter projects ([6c4a5aa](https://github.com/tinesoft/nxrocks/commit/6c4a5aa4bbbbb6c18a57c69749581df84290c6dc))
- set `@nrwl/*` packages as `peerDependencies` ([d03b709](https://github.com/tinesoft/nxrocks/commit/d03b70983f278a86c19c8fa28d99603682cad2cd)), closes [#106](https://github.com/tinesoft/nxrocks/issues/106)

### Features

- **nx-flutter:** add `doctor` executor to run `flutter doctor` checks ([9d35de1](https://github.com/tinesoft/nxrocks/commit/9d35de18787ae3d8ab7d863727d0fa20592c19de))
- **nx-flutter:** make all `build` executors results cacheable ([a08dbb8](https://github.com/tinesoft/nxrocks/commit/a08dbb831fb8cc29acc747f93f66fba3688eafd4))
- **nx-flutter:** rename executors to use `kebab-case` ([319558f](https://github.com/tinesoft/nxrocks/commit/319558f912f5bea3826f242cea02ed51f727b38a))
- **nx-micronaut:** add `nx-micronaut` plugin ([08d6099](https://github.com/tinesoft/nxrocks/commit/08d6099001bbfff830963584598da3d6a3eac66c))

### BREAKING CHANGES

- **nx-flutter:** `interactive` option has been renamed into `skipAdditionalPrompts`

`interactive` is a reserved option for `nx generate` command, that gets deleted once Nx has interpreted it, so we need our own. Must still be combined with `--no-interactive` (from Nx), for fully non-interactivity

- **nx-flutter:** All executors of this plugin now use `kebab-case` over `camelCase` for consistency

This only affects `buildAar`, `buildApk`, `buildAppbundle`, `buildBundle`, `buildIos`, `buildIosFramework`, `buildIpa`, and `genL10n` executors, which have been renamed into `build-aar`, `build-apk`, `build-appbundle`, `build-bundle`, `build-ios`, `build-ios-framework`, `build-ipa`, and `gen-l10n` respectively.

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
