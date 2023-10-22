# [2.0.0](https://github.com/tinesoft/nxrocks/compare/create-nx-flutter/v1.0.0...create-nx-flutter/v2.0.0) (2023-10-22)


### Bug Fixes

* **common:**  update dependencies used by the `common` module ([e78ae32](https://github.com/tinesoft/nxrocks/commit/e78ae32a157d7823aab64454ccd637a4f4a505dc))


### Features

* **common-jvm:** move common JVM-related utils to a dedicated package ([1bf12fb](https://github.com/tinesoft/nxrocks/commit/1bf12fb38650261584e7face404f5477470dc40d))
* **common:** allow setting cacheable operations when add the plugin to `nx.json` ([9fb5177](https://github.com/tinesoft/nxrocks/commit/9fb51770c991912a6c8d9bc1b99af4f171f1df58))
* update to Nx workspace `v17.x.x` ([c5b4ef3](https://github.com/tinesoft/nxrocks/commit/c5b4ef3db2bb8b5e5b2e09a09892a09c4c52b017)), closes [#195](https://github.com/tinesoft/nxrocks/issues/195)


### BREAKING CHANGES

* Nx `v17.x.x` is now the minimum required version to use the plugin

# 1.0.0 (2023-10-08)


### Bug Fixes

* add `{workspaceRoot}` prefix (from Nx `v15+`) to targets' `outputs` ([411b402](https://github.com/tinesoft/nxrocks/commit/411b402273b5cb17d48c98dd71b2d5808dcaea96))
* **common:** bump version of `@nxrocks/common` for Nx 16 support ([980a86f](https://github.com/tinesoft/nxrocks/commit/980a86fe0ee16e7d0efb5578b3eef45a00ac9654)), closes [#169](https://github.com/tinesoft/nxrocks/issues/169)
* **common:** connections over Proxy not using correct `HTTP` protocol ([5cd3551](https://github.com/tinesoft/nxrocks/commit/5cd3551cf91acf5eca05b26ce4df1944011f86b8)), closes [#158](https://github.com/tinesoft/nxrocks/issues/158)
* **common:** fix `Error [ERR_STREAM_PREMATURE_CLOSE]: Premature close` ([fb5f797](https://github.com/tinesoft/nxrocks/commit/fb5f797d568affe2e3282387faf5af62a9cab623)), closes [#142](https://github.com/tinesoft/nxrocks/issues/142)
* **common:** fix bug when fetching dependencies of maven based projects ([2ada704](https://github.com/tinesoft/nxrocks/commit/2ada704f17bdf4a2bec5314b1faf2147c460e4b2))
* **common:** fix dependency graph generation failure on `windows` OS ([26ef7c4](https://github.com/tinesoft/nxrocks/commit/26ef7c476cd4bc158b4df818a84be428a25c6adc)), closes [#170](https://github.com/tinesoft/nxrocks/issues/170)
* **common:** fix deprecated usage of dependency graph API ([badf089](https://github.com/tinesoft/nxrocks/commit/badf089040b31682df94c97818bf7e96201d42f9))
* **common:** fix ProjectGraph for `Gradle` multi-module projects ([0ef0d17](https://github.com/tinesoft/nxrocks/commit/0ef0d1736fe100002ab2d547b830ab9de0e42a19))
* **common:** fix regex used to fetch gradle dependencies ([f1779a4](https://github.com/tinesoft/nxrocks/commit/f1779a472c6c5ebeeec30674540b6d017478e4f7))
* **common:** fix wrong groupId used for Spotless maven plugin ([3e4c613](https://github.com/tinesoft/nxrocks/commit/3e4c61330eb2f72589d97578dd3d1449e4b0ca15))
* **common:** ignore output when fetching package latest version from npm ([f426575](https://github.com/tinesoft/nxrocks/commit/f4265757aad0a350b3b966f0076192600221ae67))
* **common:** improve the checking/adding of a maven plugin  in `pom.xml` ([b8f59cf](https://github.com/tinesoft/nxrocks/commit/b8f59cf6db1bddf2f65cbb8d340fa3784978c109))
* correct `TypeError: builder.getProjectGraph is not a function` ([3458f66](https://github.com/tinesoft/nxrocks/commit/3458f668f6f3420140fef25f908b08c26511f433)), closes [#72](https://github.com/tinesoft/nxrocks/issues/72)
* enforce plugin `peerDependencies` on Nx `v15.0.0` and later ([4c220bb](https://github.com/tinesoft/nxrocks/commit/4c220bb55499972e05a318f656ed91e79a5f91e0))
* fix executor output not restored when found in Nx cache ([fbb385a](https://github.com/tinesoft/nxrocks/commit/fbb385ab2cb468c8b41b224e353d9b891bb4e48c)), closes [#111](https://github.com/tinesoft/nxrocks/issues/111)
* fix installation issue due to `hpagent` not being found ([3620d23](https://github.com/tinesoft/nxrocks/commit/3620d2329103076bbb4713bac48c4f0c734bd545)), closes [#128](https://github.com/tinesoft/nxrocks/issues/128)
* fix transitive `dependencies` from `@nxrocks/common` ([3594b1e](https://github.com/tinesoft/nxrocks/commit/3594b1ebb345f91b743e2f58a314020a851ad61b)), closes [#131](https://github.com/tinesoft/nxrocks/issues/131)
* improve schemas of generators for a better UX in `Nx Console` ([0214736](https://github.com/tinesoft/nxrocks/commit/02147369d855247538becf7730f088765f7734d4))
* loosen `peerDependencies` on `@nx/*` to support v16.0.0 AND higher ([fb2f8df](https://github.com/tinesoft/nxrocks/commit/fb2f8df907fe9a498cc310862f08571e6c87dd6b))
* **nx-flutter:** add missing `buildAar` builder ([44432eb](https://github.com/tinesoft/nxrocks/commit/44432eb37d2c849437a06af88f063a48d292d990))
* **nx-flutter:** add missing config for semantic-releasing ([06fd1bd](https://github.com/tinesoft/nxrocks/commit/06fd1bd3ea061a7b1f27d765ae077ec9906264d1))
* **nx-flutter:** add plugin to nx.json only if not included already ([b98c1e9](https://github.com/tinesoft/nxrocks/commit/b98c1e930fb4a2e1b3ca4bba98de66937f270084))
* **nx-flutter:** avoid generating files when running with `--dry-run` ([d539208](https://github.com/tinesoft/nxrocks/commit/d53920881014171e4b772173cc1f5f937fe2888f))
* **nx-flutter:** correct generation error due to `platforms` option ([fc56c5e](https://github.com/tinesoft/nxrocks/commit/fc56c5e1f93f3af3a8529c5e24ad08ae4f63da4a)), closes [#22](https://github.com/tinesoft/nxrocks/issues/22)
* **nx-flutter:** correct generation error on multi word `description` ([1ed2d97](https://github.com/tinesoft/nxrocks/commit/1ed2d977421557fd8b6a7aad2ad05f93d226e552)), closes [#23](https://github.com/tinesoft/nxrocks/issues/23)
* **nx-flutter:** fix `format` executor to use `dart format` ([2f03466](https://github.com/tinesoft/nxrocks/commit/2f0346656e7291dea9a4d6c294d1d3a2ad75d852))
* **nx-flutter:** fix error when generating module or package ([86eb3f8](https://github.com/tinesoft/nxrocks/commit/86eb3f872e9c89ec304f86352081299ea8cb0edd)), closes [#44](https://github.com/tinesoft/nxrocks/issues/44)
* **nx-flutter:** fix error when generating shareable `package` projects ([1214fa7](https://github.com/tinesoft/nxrocks/commit/1214fa7128d0808ba987153fdc6bc17f27b6ee53)), closes [#166](https://github.com/tinesoft/nxrocks/issues/166)
* **nx-flutter:** fix non-interactive generation of flutter projects ([6c4a5aa](https://github.com/tinesoft/nxrocks/commit/6c4a5aa4bbbbb6c18a57c69749581df84290c6dc))
* plugins include spec files in distributed pkg ([21bac53](https://github.com/tinesoft/nxrocks/commit/21bac5398c05be293cd250e46814b8f86468bc4f))
* set `@nrwl/*` packages as `peerDependencies` ([d03b709](https://github.com/tinesoft/nxrocks/commit/d03b70983f278a86c19c8fa28d99603682cad2cd)), closes [#106](https://github.com/tinesoft/nxrocks/issues/106)


### Features

* **common-cli:** add `common-cli` to share code among our `create-*` CLI packages ([bcb5fd2](https://github.com/tinesoft/nxrocks/commit/bcb5fd2a0cda945b708fb0e42195bde82cac47c7))
* **common:** add `addMavenProperty` helper and improve `xpath` matching ([9f89c08](https://github.com/tinesoft/nxrocks/commit/9f89c081eefc9bd168e964bf80416c5e7ad3289a))
* **common:** add `MavenDependency` model ([5ab8c1d](https://github.com/tinesoft/nxrocks/commit/5ab8c1d89d0cc31a997bc65d3cd7d9042604a3fc))
* **common:** add a utility to disable a gradle plugin ([171ad81](https://github.com/tinesoft/nxrocks/commit/171ad81c503d204563bf5867f4874864392ebdeb))
* **common:** add a utility to remove a maven plugin from the `pom.xml` ([8c13087](https://github.com/tinesoft/nxrocks/commit/8c1308766ad69eda3cbaa4c61f4a0b1837f6fc6d))
* **common:** add helper to get project root directory ([adbc8a9](https://github.com/tinesoft/nxrocks/commit/adbc8a97e2096951acce3fd8d10407255c17a956))
* **common:** add support for `nx-micronaut` plugin ([b72cdaf](https://github.com/tinesoft/nxrocks/commit/b72cdaffd1749868806dc2eac8c24573344adaa5))
* **common:** add utilities for multi-module `maven`/`gradle` projects ([f2e4939](https://github.com/tinesoft/nxrocks/commit/f2e49396bd5fec312c401040c5511567a092a18c))
* **common:** add utilities to add `maven`/`gradle` modules ([2237201](https://github.com/tinesoft/nxrocks/commit/2237201646307ade853c180f5b25e9e2e56e5ad7))
* **common:** add utility method to get http[s] proxy agent ([da61925](https://github.com/tinesoft/nxrocks/commit/da619254be5699930a6f5bd2e7ea65475509b730))
* **common:** add utility to check the presence of a plugin in `pom.xml` ([bfec05f](https://github.com/tinesoft/nxrocks/commit/bfec05f6a3d2b611b9df71432a8a2a2a0ea1fc60))
* **common:** add utility to unzip a zip stream ([a472c00](https://github.com/tinesoft/nxrocks/commit/a472c00cdf32bf6513914cf031de4adef107e9f6))
* **common:** add xml utilities to remove or check if a node is empty ([d07b827](https://github.com/tinesoft/nxrocks/commit/d07b82745ce5294bc20a4dc0effff53656c9fee4))
* **common:** allow using legacy wrappers (i.e `.bat`, for maven mostly) ([7a13720](https://github.com/tinesoft/nxrocks/commit/7a137206a7783ed83e7ccb628691b00c91477d87))
* **common:** increase the `maxBuffer` when running executors commands ([4bc388d](https://github.com/tinesoft/nxrocks/commit/4bc388d5068aa73003bf09776757fe7b357bb0cf))
* **common:** make the `version` optional when adding a gradle plugin ([bd3a182](https://github.com/tinesoft/nxrocks/commit/bd3a182bfa1fea1311cf86ea0b37068a68bff423))
* **common:** move `octal` function into e2e testing utils ([b15a616](https://github.com/tinesoft/nxrocks/commit/b15a61659289bbc3d986b4f58e7e5a49dafdc400))
* **common:** update Spotless gradle plugin from `6.2.2` --> `6.8.0` ([8c76d3b](https://github.com/tinesoft/nxrocks/commit/8c76d3b688b434224337e2a182e306f8d6a1931e))
* **common:** update Spotless maven plugin from `2.20.2` --> `2.23.0` ([ab182ef](https://github.com/tinesoft/nxrocks/commit/ab182efc6c27b236a857b4b7b8cd795ed248214e))
* **create-nx-flutter:** add custom CLI to create Flutter projects ([5126425](https://github.com/tinesoft/nxrocks/commit/51264254d335812d6addc80ff48e5e856b89ae18))
* **create-nx-spring-boot:** add custom CLI to create Spring Boot projects ([32ca53c](https://github.com/tinesoft/nxrocks/commit/32ca53c61cc1c25027d72434e13b71ec1a100acb))
* **nx-flutter:** add `create` alias to  project generation schematics ([0386629](https://github.com/tinesoft/nxrocks/commit/03866292ea1a354a6eca43cb9ae7e691188736bd)), closes [#27](https://github.com/tinesoft/nxrocks/issues/27)
* **nx-flutter:** add `doctor` executor to run `flutter doctor` checks ([9d35de1](https://github.com/tinesoft/nxrocks/commit/9d35de18787ae3d8ab7d863727d0fa20592c19de))
* **nx-flutter:** add nx-flutter plugin ([e7426e9](https://github.com/tinesoft/nxrocks/commit/e7426e99a449c774d3f9408ac49711974d9855a0))
* **nx-flutter:** add special instructions to generate the app ([d5f768a](https://github.com/tinesoft/nxrocks/commit/d5f768a87b375725af1a484277aca154abaa4ac6))
* **nx-flutter:** add support for Flutter Version Manager (`fvm`) ([e9af459](https://github.com/tinesoft/nxrocks/commit/e9af4590c5e8d2029cb4c39c86a1095253623beb))
* **nx-flutter:** add support for Nx 's dependency graph generation ([6fb58de](https://github.com/tinesoft/nxrocks/commit/6fb58de673c968f78e72eec6eda7806760a72419)), closes [#28](https://github.com/tinesoft/nxrocks/issues/28)
* **nx-flutter:** auto-adapt prompt & builders based on previous answers ([668dd28](https://github.com/tinesoft/nxrocks/commit/668dd285aad1a37b7444cadc6702d14b2482f795)), closes [#26](https://github.com/tinesoft/nxrocks/issues/26)
* **nx-flutter:** create project in `apps` or `libs` based on `template` ([dc20e0b](https://github.com/tinesoft/nxrocks/commit/dc20e0bf5b66d2b4fa9838f57fa91a55358e0a38)), closes [#41](https://github.com/tinesoft/nxrocks/issues/41)
* **nx-flutter:** improve typings for `template` and `platforms` options ([b614dc4](https://github.com/tinesoft/nxrocks/commit/b614dc41ebd92c4a1f2be34e3ff83ecf0608ba83))
* **nx-flutter:** leverage `NX_INTERACTIVE` for additional prompts ([ffb0591](https://github.com/tinesoft/nxrocks/commit/ffb0591cad36baef6afa68ccbcbe5418bdeb6086))
* **nx-flutter:** make all `build` executors results cacheable ([a08dbb8](https://github.com/tinesoft/nxrocks/commit/a08dbb831fb8cc29acc747f93f66fba3688eafd4))
* **nx-flutter:** migrate to Nrwl's DevKit executors/generators API ([8c72ed5](https://github.com/tinesoft/nxrocks/commit/8c72ed5dbbb7f382f1206ebe6b019d74362f046b))
* **nx-flutter:** rename executors to use `kebab-case` ([319558f](https://github.com/tinesoft/nxrocks/commit/319558f912f5bea3826f242cea02ed51f727b38a))
* **nx-flutter:** rename the `application` generator into `project` ([6361557](https://github.com/tinesoft/nxrocks/commit/63615577bf48de00b10d1110a1d6582c2abbfda3))
* **nx-flutter:** use `NX_VERBOSE_LOGGING` to control logs in dep graph ([e678ed5](https://github.com/tinesoft/nxrocks/commit/e678ed5255aff9ea0fcd2a515f61de3d13539b64))
* **nx-ktor:** add `nx-ktor` plugin ([cb74a79](https://github.com/tinesoft/nxrocks/commit/cb74a79d23a79b1eda79c2555d092d8151cf7e49))
* **nx-melos:** add `nx-melos` plugin ([4fb5da8](https://github.com/tinesoft/nxrocks/commit/4fb5da8c7883e9a8703383bcf683a533269fc047))
* **nx-micronaut:** add `nx-micronaut` plugin ([08d6099](https://github.com/tinesoft/nxrocks/commit/08d6099001bbfff830963584598da3d6a3eac66c))
* **nx-quarkus:** add plugin to integrate `Quarkus` inside Nx workspace ([2f7c6c0](https://github.com/tinesoft/nxrocks/commit/2f7c6c0537629027ebffce3173df2cc6278ca29d))
* **nx-spring-boot:** add `application` schematics ([f22e63f](https://github.com/tinesoft/nxrocks/commit/f22e63f1f133d92907cf457a8d817a5e9df13dfe))
* **nx-spring-boot:** add support for creating multi-modules projects ([7c2de5a](https://github.com/tinesoft/nxrocks/commit/7c2de5a07f92fad481f3bda5ce61a71ba78c89c0))
* **nx-spring-boot:** add support for Nx's dependency graph generation ([95abe9d](https://github.com/tinesoft/nxrocks/commit/95abe9d297d166199f3ab1e6c761efdeffca02d0))
* **nx-spring-boot:** migrate to Nrwl's DevKit executors/generators API ([47231fd](https://github.com/tinesoft/nxrocks/commit/47231fd9a2a9791e929837144b4dbf080be0385f))
* update dependencies and fix lint issues ([cfac383](https://github.com/tinesoft/nxrocks/commit/cfac383c7d2aebd329a98f410df66b726b64d28a))
* update to Nx workspace `v15.0.0` ([a0af206](https://github.com/tinesoft/nxrocks/commit/a0af2064acbd8e65b4f603ca9e3ce2c6ce990795)), closes [#138](https://github.com/tinesoft/nxrocks/issues/138)
* update to Nx workspace `v16.0.0` ([ab11ea8](https://github.com/tinesoft/nxrocks/commit/ab11ea89becafa9555f43527c95167827089a6e6))


### BREAKING CHANGES

* Nx `v16.x.x` is now the minimum required version to use the plugin
* **nx-flutter:** Nx `v15.8.x` is now the minimum required version to run the plugin

`skipAdditionalPrompts` option was removed (no longer necessary)
* Nx `v15.x.x` is now the minimum required version to use the plugin
* **nx-flutter:** `interactive` option has been renamed into `skipAdditionalPrompts`

`interactive` is a reserved option for `nx generate` command, that gets deleted once Nx has interpreted it, so we need our own. Must still be combined with `--no-interactive` (from Nx), for fully non-interactivity
* **nx-flutter:** All executors of this plugin now use `kebab-case` over `camelCase` for consistency

This only affects `buildAar`, `buildApk`, `buildAppbundle`, `buildBundle`, `buildIos`, `buildIosFramework`, `buildIpa`, and `genL10n` executors, which have been renamed into `build-aar`, `build-apk`, `build-appbundle`, `build-bundle`, `build-ios`, `build-ios-framework`, `build-ipa`, and `gen-l10n` respectively.
* Nx v12.6.x is now the minimum version required to use the plugins

This is due to breaking changes in DevKit's project graph API starting from v12.6.x
* **nx-flutter:** the `app` alias has been replaced with one of [`proj`, `new`, `gen`, `init`, `generate`].
* **nx-flutter:** Nx workspace v11 is now the minimum version required to use this plugin.

In fact, all builders/schematics have been rewritten into executors/generators using its new `@nrwl/devkit` API.
* **nx-spring-boot:** Nx workspace v11 is now the minimum version required to use this plugin.

In fact, all builders/schematics have been rewritten into executors/generators using its new `@nrwl/devkit` API.
