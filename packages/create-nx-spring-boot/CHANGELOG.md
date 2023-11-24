## [2.1.1](https://github.com/tinesoft/nxrocks/compare/create-nx-spring-boot/v2.1.0...create-nx-spring-boot/v2.1.1) (2023-11-24)


### Bug Fixes

* **nx-spring-boot:** fix sample files not generated for `Gradle` `library` projects ([6d2effd](https://github.com/tinesoft/nxrocks/commit/6d2effdb81d5a4c1e77491ff86d35d41811cb83b))
* **nx-spring-boot:** fix typing in `MyService.kt` when generating a `library` project ([340b666](https://github.com/tinesoft/nxrocks/commit/340b6667aeaa741d33c956dd01df2ea27f6ca7df))

# [2.1.0](https://github.com/tinesoft/nxrocks/compare/create-nx-spring-boot/v2.0.3...create-nx-spring-boot/v2.1.0) (2023-11-22)


### Bug Fixes

* **common-jvm:** improve utility method to disable a Gradle plugin ([8e1e5b9](https://github.com/tinesoft/nxrocks/commit/8e1e5b9fc9b9e07fd0c8f9d2cbfc31a809416873))
* **nx-spring-boot:** do not generate Application/ApplicationTests files when generating a `library` ([17fbb4a](https://github.com/tinesoft/nxrocks/commit/17fbb4a9b9094b2a7c544babec806e48b410c222))
* **nx-spring-boot:** fix Boot plugin not disabled for `library` project when using Gradle Kotlin ([fb0b1de](https://github.com/tinesoft/nxrocks/commit/fb0b1de4c1ed700ac40bbb0fe9c90597d45e3af5))
* **nx-spring-boot:** remove `bootBuildImage` gradle task when generating a `library` project ([03a2bd7](https://github.com/tinesoft/nxrocks/commit/03a2bd7f3b8cffd65f4ae0a2ffbe91976e43865f))


### Features

* make `install` target depend on the one from the dependency ([b2878dc](https://github.com/tinesoft/nxrocks/commit/b2878dca47f660c8faa9e1caf0733550abda17cb))
* **nx-spring-boot:** improve `project` generator by generating sample `library` files ([358f9ad](https://github.com/tinesoft/nxrocks/commit/358f9ad404e1d28b0d9c875bd02f4e0782c405f0))

## [2.0.3](https://github.com/tinesoft/nxrocks/compare/create-nx-spring-boot/v2.0.2...create-nx-spring-boot/v2.0.3) (2023-11-16)


### Bug Fixes

* hide `preset` generators from `Nx Console` and improve generators decription ([c868384](https://github.com/tinesoft/nxrocks/commit/c868384a03963c8636f5fe161d619ba4f32324c9))

## [2.0.2](https://github.com/tinesoft/nxrocks/compare/create-nx-spring-boot/v2.0.1...create-nx-spring-boot/v2.0.2) (2023-10-31)


### Bug Fixes

* **common-jvm:** fix parent module not found when `runFromParentModule` flag is `true` ([840f8f6](https://github.com/tinesoft/nxrocks/commit/840f8f6dfa4c4d2a69c1f6d0e7b7ba472862050d))

## [2.0.1](https://github.com/tinesoft/nxrocks/compare/create-nx-spring-boot/v2.0.0...create-nx-spring-boot/v2.0.1) (2023-10-28)


### Bug Fixes

* **common-cli:** loosen dependencies on `@nx/devkit` and `create-nx-workspace` ([18b1175](https://github.com/tinesoft/nxrocks/commit/18b1175a15f52839aa0700dfbb9fa9ae309f109e))
* **common:** simplify the path to common utils ([c87be7f](https://github.com/tinesoft/nxrocks/commit/c87be7f883053cd31cd3015712b6929ddea4fdc7))
* remove explicit dependency on `@nx/devkit` (inherited from `common`) ([a1d44c9](https://github.com/tinesoft/nxrocks/commit/a1d44c9eed3cf73216aaf70c9f47c9eef0753215))

# [2.0.0](https://github.com/tinesoft/nxrocks/compare/create-nx-spring-boot/v1.0.0...create-nx-spring-boot/v2.0.0) (2023-10-22)


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
* **nx-spring-boot:** add `x-dropdown` to improve UX of `link` generator ([b056117](https://github.com/tinesoft/nxrocks/commit/b056117bc2fc67fae3a17fdc886f36638b2f01b3))
* **nx-spring-boot:** add plugin to nx.json only if not included already ([15511ae](https://github.com/tinesoft/nxrocks/commit/15511ae8ebdbc4d8cd412afd266457cf08b14f72))
* **nx-spring-boot:** always restore executable permissions on wrappers ([b9875d8](https://github.com/tinesoft/nxrocks/commit/b9875d879198a0a613041b00720c77923b54c6c1))
* **nx-spring-boot:** correct error when executing builders on Windows ([1a744ab](https://github.com/tinesoft/nxrocks/commit/1a744abf67cd07d0ebd259f12c4c02fc2bd8bdaa)), closes [#38](https://github.com/tinesoft/nxrocks/issues/38)
* **nx-spring-boot:** correct generation issue on Nx workspaces >=v11.2.0 ([d3c3816](https://github.com/tinesoft/nxrocks/commit/d3c3816fd739aa5f42133d05644e972d003c43ff)), closes [#37](https://github.com/tinesoft/nxrocks/issues/37)
* **nx-spring-boot:** correct wrong extension for `gradlew` on windows ([77899ce](https://github.com/tinesoft/nxrocks/commit/77899ceeac48fb9321b3b07b81958c8dbb1c078d))
* **nx-spring-boot:** fix `Premature close` error when generating project ([f6b433d](https://github.com/tinesoft/nxrocks/commit/f6b433d458b0f94c297b4581cd18f0bef3c0c5e6)), closes [#97](https://github.com/tinesoft/nxrocks/issues/97)
* **nx-spring-boot:** fix `serve` and `apply-format` alias executors ([29f5183](https://github.com/tinesoft/nxrocks/commit/29f5183ff00efcd62916a0dcefff005ab9659bdc))
* **nx-spring-boot:** fix creating spring boot libraries with `gradle` ([500a7d0](https://github.com/tinesoft/nxrocks/commit/500a7d04f09b843014329990c8e0644fa60d35f2))
* **nx-spring-boot:** fix error when generating a gradle/kotlin project ([abfbd04](https://github.com/tinesoft/nxrocks/commit/abfbd04bb97e5197bd60643e1a5adc4c16c3a5d5)), closes [#15](https://github.com/tinesoft/nxrocks/issues/15)
* **nx-spring-boot:** fix generation error when setting `javaVersion` ([364b228](https://github.com/tinesoft/nxrocks/commit/364b22885e74706fd3f6d10323325323439aa2f1)), closes [#98](https://github.com/tinesoft/nxrocks/issues/98)
* **nx-spring-boot:** fix library projects should not be executable ([b118a4e](https://github.com/tinesoft/nxrocks/commit/b118a4e414d3dcae0f81cec3e366ce2096aa34e3)), closes [#113](https://github.com/tinesoft/nxrocks/issues/113)
* **nx-spring-boot:** fix prompts not working generating the application ([b96e1ce](https://github.com/tinesoft/nxrocks/commit/b96e1ceb304ae70d0d91eb42507210199adf8de0)), closes [#6](https://github.com/tinesoft/nxrocks/issues/6)
* **nx-spring-boot:** fix wrong 'cwd' used to execute builders commands ([b39e7e7](https://github.com/tinesoft/nxrocks/commit/b39e7e7a6d6266939ce153ad97b121573372a74b))
* **nx-spring-boot:** make builders executable platform independant ([b27bc4c](https://github.com/tinesoft/nxrocks/commit/b27bc4cc81454727bc15f12e896756a679ecd845))
* **nx-spring-boot:** remove `ratchetFrom` from the default Spotless conf ([1462022](https://github.com/tinesoft/nxrocks/commit/1462022a22eb4714bb590b7b18b3addb8643387e))
* **nx-spring-boot:** remove extra char in `dependencies` prompt ([5bc0290](https://github.com/tinesoft/nxrocks/commit/5bc0290601b5b3815de9a95125c551c4f9448997))
* **nx-spring-boot:** set correct path for executors ([89e16d3](https://github.com/tinesoft/nxrocks/commit/89e16d37c329965a61b4812cde1d3155ac8e2827))
* **nx-spring-boot:** some user options were not used during generation ([6813e7d](https://github.com/tinesoft/nxrocks/commit/6813e7d62f4919fe616b52fc2903ca4a6129a50a)), closes [#17](https://github.com/tinesoft/nxrocks/issues/17)
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
* **create-nx-spring-boot:** add custom CLI to create Spring Boot projects ([32ca53c](https://github.com/tinesoft/nxrocks/commit/32ca53c61cc1c25027d72434e13b71ec1a100acb))
* **nx-flutter:** add nx-flutter plugin ([e7426e9](https://github.com/tinesoft/nxrocks/commit/e7426e99a449c774d3f9408ac49711974d9855a0))
* **nx-flutter:** add support for Nx 's dependency graph generation ([6fb58de](https://github.com/tinesoft/nxrocks/commit/6fb58de673c968f78e72eec6eda7806760a72419)), closes [#28](https://github.com/tinesoft/nxrocks/issues/28)
* **nx-flutter:** auto-adapt prompt & builders based on previous answers ([668dd28](https://github.com/tinesoft/nxrocks/commit/668dd285aad1a37b7444cadc6702d14b2482f795)), closes [#26](https://github.com/tinesoft/nxrocks/issues/26)
* **nx-flutter:** migrate to Nrwl's DevKit executors/generators API ([8c72ed5](https://github.com/tinesoft/nxrocks/commit/8c72ed5dbbb7f382f1206ebe6b019d74362f046b))
* **nx-ktor:** add `nx-ktor` plugin ([cb74a79](https://github.com/tinesoft/nxrocks/commit/cb74a79d23a79b1eda79c2555d092d8151cf7e49))
* **nx-melos:** add `nx-melos` plugin ([4fb5da8](https://github.com/tinesoft/nxrocks/commit/4fb5da8c7883e9a8703383bcf683a533269fc047))
* **nx-micronaut:** add `nx-micronaut` plugin ([08d6099](https://github.com/tinesoft/nxrocks/commit/08d6099001bbfff830963584598da3d6a3eac66c))
* **nx-quarkus:** add plugin to integrate `Quarkus` inside Nx workspace ([2f7c6c0](https://github.com/tinesoft/nxrocks/commit/2f7c6c0537629027ebffce3173df2cc6278ca29d))
* **nx-spring-boot:**  add proxy support for project generation ([bd3ac7e](https://github.com/tinesoft/nxrocks/commit/bd3ac7e7c577714df272c1fa972c1d0280b91c14)), closes [#125](https://github.com/tinesoft/nxrocks/issues/125)
* **nx-spring-boot:** add  java 16 support to align w/ Spring Initializr ([89c1d1e](https://github.com/tinesoft/nxrocks/commit/89c1d1eb2eb91f317ac0adf7643f87db05db68e1))
* **nx-spring-boot:** add  java 17 support to align w/ Spring Initializr ([131df91](https://github.com/tinesoft/nxrocks/commit/131df91c89ece06ddfae7eb93d1ace2cccad0cc9))
* **nx-spring-boot:** add `application` schematics ([f22e63f](https://github.com/tinesoft/nxrocks/commit/f22e63f1f133d92907cf457a8d817a5e9df13dfe))
* **nx-spring-boot:** add `build-image` and `test` to cached outputs ([1cc3a71](https://github.com/tinesoft/nxrocks/commit/1cc3a712249a7e24c29e80a1d8a0a67c5d2e19f4))
* **nx-spring-boot:** add `clean` builder ([33a1435](https://github.com/tinesoft/nxrocks/commit/33a1435a298cf56568bcd2ea2ed11030e0a1c780))
* **nx-spring-boot:** add `format-check` executor to check code format ([337fca8](https://github.com/tinesoft/nxrocks/commit/337fca8356fba17a1ff54e32204a6d4351d63f8c))
* **nx-spring-boot:** add `format` executor ([b5362ae](https://github.com/tinesoft/nxrocks/commit/b5362ae72fcec47be07df22df3e3ec3e9f047e9a))
* **nx-spring-boot:** add `ignoreWrapper` option to all builders ([e045bca](https://github.com/tinesoft/nxrocks/commit/e045bca8d89a68770bf9977c9bddedc65cdbf488)), closes [#31](https://github.com/tinesoft/nxrocks/issues/31)
* **nx-spring-boot:** add `install` executor + make `build` depend on it ([68e1a5e](https://github.com/tinesoft/nxrocks/commit/68e1a5ef5ed266c65ee348c6ced022f87edb1fb7)), closes [#65](https://github.com/tinesoft/nxrocks/issues/65) [#66](https://github.com/tinesoft/nxrocks/issues/66) [#71](https://github.com/tinesoft/nxrocks/issues/71)
* **nx-spring-boot:** add `link` generator to link projects implicitly ([1142d04](https://github.com/tinesoft/nxrocks/commit/1142d0438a1c2d28668efcdce8804c43bef56717))
* **nx-spring-boot:** add `serve` builder (alias to `run` builder) ([16dfdb4](https://github.com/tinesoft/nxrocks/commit/16dfdb4e662d8b6904db98030f0abcbfefaf634a)), closes [#8](https://github.com/tinesoft/nxrocks/issues/8)
* **nx-spring-boot:** add `skipFormat` to control code formatting ([8bff29b](https://github.com/tinesoft/nxrocks/commit/8bff29bf849138cea75a0cbf09e5d164a732e470))
* **nx-spring-boot:** add `test` builder ([e257d27](https://github.com/tinesoft/nxrocks/commit/e257d273f4d7d17a837d38390c6e6045d3685521)), closes [#30](https://github.com/tinesoft/nxrocks/issues/30)
* **nx-spring-boot:** add `User-Agent` header to requests to Initializr ([4c7f345](https://github.com/tinesoft/nxrocks/commit/4c7f345a0c9e1e73dded4731cca50adaeb10f8d3)), closes [#11](https://github.com/tinesoft/nxrocks/issues/11)
* **nx-spring-boot:** add aliases for the format executor ([cbcee00](https://github.com/tinesoft/nxrocks/commit/cbcee00da217a4b609efeecfa80c2d16bd44e170))
* **nx-spring-boot:** add builders for run, buildJar/War, buildImage and buildInfo commands ([5c75781](https://github.com/tinesoft/nxrocks/commit/5c757815c2a07231d49d66f4da44c1ffe268efe7))
* **nx-spring-boot:** add dynamic prompt to fetch boot dependencies list ([6d9f3e4](https://github.com/tinesoft/nxrocks/commit/6d9f3e46f39cd8352f8220968f837e054e187625))
* **nx-spring-boot:** add support for  `Kotlin DSL` when using `gradle` ([31063fe](https://github.com/tinesoft/nxrocks/commit/31063fea75eb1abe23490204859df81dde019328))
* **nx-spring-boot:** add support for additional params for `buildJar` and `buildWar` builders ([b85ad9c](https://github.com/tinesoft/nxrocks/commit/b85ad9cdd401e9fb98a9992877f9cc56c76f199d))
* **nx-spring-boot:** add support for additional params for `run` and `buildImage` builders ([1d9fbb3](https://github.com/tinesoft/nxrocks/commit/1d9fbb3b232e1ea662376dd02650ec875b0807a7))
* **nx-spring-boot:** add support for creating multi-modules projects ([7c2de5a](https://github.com/tinesoft/nxrocks/commit/7c2de5a07f92fad481f3bda5ce61a71ba78c89c0))
* **nx-spring-boot:** add support for Java 18 ([6dd94e1](https://github.com/tinesoft/nxrocks/commit/6dd94e1a34a2d5a597284332b0eac66c569fa559))
* **nx-spring-boot:** add support for Java 21 ([ba566e9](https://github.com/tinesoft/nxrocks/commit/ba566e9c2c82a1cd4422171a8394b63d3691c26a))
* **nx-spring-boot:** add support for Nx's dependency graph generation ([95abe9d](https://github.com/tinesoft/nxrocks/commit/95abe9d297d166199f3ab1e6c761efdeffca02d0))
* **nx-spring-boot:** align Java versions with `Spring Initializr` ([1f6545d](https://github.com/tinesoft/nxrocks/commit/1f6545d9a2c230846a3eadd5c8eb2e9b2b1f1663))
* **nx-spring-boot:** allow generating `application` or `library` ([530186c](https://github.com/tinesoft/nxrocks/commit/530186c66ea65e621cb8e63c08e5281705209130))
* **nx-spring-boot:** better determine the underlying  build system ([0edfe51](https://github.com/tinesoft/nxrocks/commit/0edfe51e2633ceb9b7491f88c9b1640f2fdd04b0))
* **nx-spring-boot:** check if source is a valid boot project on linking ([f74e524](https://github.com/tinesoft/nxrocks/commit/f74e5248c6a86296e7f9757d1349f9e166ec529f))
* **nx-spring-boot:** improve detection of boot projects in  workspace ([bfb99ed](https://github.com/tinesoft/nxrocks/commit/bfb99ed2e18e1dfe38d424f7763583831dae9bc2))
* **nx-spring-boot:** improve logging when cannot generate project ([3cc8eb6](https://github.com/tinesoft/nxrocks/commit/3cc8eb6cf9339a830f542b1e8a2ff41491c0c29a))
* **nx-spring-boot:** improve logging when project zip can't be fetched ([f1a5229](https://github.com/tinesoft/nxrocks/commit/f1a52297d5c2ca636b1cefd57aad018ba7108055))
* **nx-spring-boot:** make `build` executor results cacheable ([4528715](https://github.com/tinesoft/nxrocks/commit/45287156e1c85f29b27edb53d8fb14ad04a74ecc))
* **nx-spring-boot:** make jar of `library` projects not executable ([1e2984f](https://github.com/tinesoft/nxrocks/commit/1e2984ff00ca2f94ffbc07b94de26c476b14e500)), closes [#67](https://github.com/tinesoft/nxrocks/issues/67)
* **nx-spring-boot:** merge `buildJar` and `buildWar` executors ([9fdfec2](https://github.com/tinesoft/nxrocks/commit/9fdfec2c629fd11c8e266ee81567196e6178136a)), closes [#43](https://github.com/tinesoft/nxrocks/issues/43)
* **nx-spring-boot:** migrate to Nrwl's DevKit executors/generators API ([47231fd](https://github.com/tinesoft/nxrocks/commit/47231fd9a2a9791e929837144b4dbf080be0385f))
* **nx-spring-boot:** rename executors to use `kebab-case` ([1e5d9f4](https://github.com/tinesoft/nxrocks/commit/1e5d9f4f3e41853afd00c6756e8841028800c280)), closes [#117](https://github.com/tinesoft/nxrocks/issues/117)
* **nx-spring-boot:** rename the `application` generator into `project` ([05b5272](https://github.com/tinesoft/nxrocks/commit/05b5272bdffbc38644d8c5999f5965f6f64df531))
* **nx-spring-boot:** set `Java 17` as default version ([f41c555](https://github.com/tinesoft/nxrocks/commit/f41c555a0368753ad218d5c10ef9328a86a7f52a))
* **nx-spring-boot:** unselect by default adding code formatting support ([005ad95](https://github.com/tinesoft/nxrocks/commit/005ad950d75d2886f62847cfcb1ef51abb1942a0))
* **nx-spring-boot:** use `NX_VERBOSE_LOGGING` to control dep graph logs ([ed9e444](https://github.com/tinesoft/nxrocks/commit/ed9e444488aeb9dbe86338d3e894bae85029663f)), closes [#68](https://github.com/tinesoft/nxrocks/issues/68)
* update dependencies and fix lint issues ([cfac383](https://github.com/tinesoft/nxrocks/commit/cfac383c7d2aebd329a98f410df66b726b64d28a))
* update to Nx workspace `v15.0.0` ([a0af206](https://github.com/tinesoft/nxrocks/commit/a0af2064acbd8e65b4f603ca9e3ce2c6ce990795)), closes [#138](https://github.com/tinesoft/nxrocks/issues/138)
* update to Nx workspace `v16.0.0` ([ab11ea8](https://github.com/tinesoft/nxrocks/commit/ab11ea89becafa9555f43527c95167827089a6e6))


### BREAKING CHANGES

* Nx `v16.x.x` is now the minimum required version to use the plugin
* **nx-spring-boot:** Nx `v15.8.x` is now the minimum required version to run the plugin

We now leverage Nx's new `NX_INTERACTIVE` environment variable to check whether we are running in interactive mode (normal cli) or not.
When true, we automatically fetch `Spring Boot` dependencies and present them in an **autocomplete** prompt with **multi-select** support,
so you can easily select which ones you want to include in your project.
* Nx `v15.x.x` is now the minimum required version to use the plugin
* **nx-spring-boot:** `format-check` executor was renamed into `check-format`
* **nx-spring-boot:** All executors of this plugin now use `kebab-case` over `camelCase` for consistency

This only affect `buildImage` and `buildInfo` executors, which have been renamed into `build-image` and `build-info` respectively.
* **nx-spring-boot:** `build` is now the only executor to use to build the final jar or war
* Nx v12.6.x is now the minimum version required to use the plugins

This is due to breaking changes in DevKit's project graph API starting from v12.6.x
* **nx-flutter:** Nx workspace v11 is now the minimum version required to use this plugin.

In fact, all builders/schematics have been rewritten into executors/generators using its new `@nrwl/devkit` API.
* **nx-spring-boot:** the `app` alias has been replaced with one of [`proj`, `new`, `gen`, `init`, `create`, `generate`].
* **nx-spring-boot:** Nx workspace v11 is now the minimum version required to use this plugin.

In fact, all builders/schematics have been rewritten into executors/generators using its new `@nrwl/devkit` API.
