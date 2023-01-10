# @nxrocks/nx-melos-v1.0.0 (2023-01-10)

### Bug Fixes

- wrong `@nxrocks/common` version referenced in dependent packages ([1b4b0e6](https://github.com/tinesoft/nxrocks/commit/1b4b0e6b1df604177585e703e092cf3652ef86b0))
- add `{workspaceRoot}` prefix (from Nx `v15+`) to targets' `outputs` ([411b402](https://github.com/tinesoft/nxrocks/commit/411b402273b5cb17d48c98dd71b2d5808dcaea96))
- **common:** fix `Error [ERR_STREAM_PREMATURE_CLOSE]: Premature close` ([fb5f797](https://github.com/tinesoft/nxrocks/commit/fb5f797d568affe2e3282387faf5af62a9cab623)), closes [#142](https://github.com/tinesoft/nxrocks/issues/142)
- **common:** fix bug when fetching dependencies of maven based projects ([2ada704](https://github.com/tinesoft/nxrocks/commit/2ada704f17bdf4a2bec5314b1faf2147c460e4b2))
- **common:** fix regex used to fetch gradle dependencies ([f1779a4](https://github.com/tinesoft/nxrocks/commit/f1779a472c6c5ebeeec30674540b6d017478e4f7))
- **common:** fix wrong groupId used for Spotless maven plugin ([3e4c613](https://github.com/tinesoft/nxrocks/commit/3e4c61330eb2f72589d97578dd3d1449e4b0ca15))
- **common:** ignore output when fetching package latest version from npm ([f426575](https://github.com/tinesoft/nxrocks/commit/f4265757aad0a350b3b966f0076192600221ae67))
- **common:** improve the checking/adding of a maven plugin in `pom.xml` ([b8f59cf](https://github.com/tinesoft/nxrocks/commit/b8f59cf6db1bddf2f65cbb8d340fa3784978c109))
- correct `TypeError: builder.getProjectGraph is not a function` ([3458f66](https://github.com/tinesoft/nxrocks/commit/3458f668f6f3420140fef25f908b08c26511f433)), closes [#72](https://github.com/tinesoft/nxrocks/issues/72)
- enforce plugin `peerDependencies` on Nx `v15.0.0` and later ([4c220bb](https://github.com/tinesoft/nxrocks/commit/4c220bb55499972e05a318f656ed91e79a5f91e0))
- fix executor output not restored when found in Nx cache ([fbb385a](https://github.com/tinesoft/nxrocks/commit/fbb385ab2cb468c8b41b224e353d9b891bb4e48c)), closes [#111](https://github.com/tinesoft/nxrocks/issues/111)
- fix installation issue due to `hpagent` not being found ([3620d23](https://github.com/tinesoft/nxrocks/commit/3620d2329103076bbb4713bac48c4f0c734bd545)), closes [#128](https://github.com/tinesoft/nxrocks/issues/128)
- fix transitive `dependencies` from `@nxrocks/common` ([3594b1e](https://github.com/tinesoft/nxrocks/commit/3594b1ebb345f91b743e2f58a314020a851ad61b)), closes [#131](https://github.com/tinesoft/nxrocks/issues/131)
- fix transitive dependencies from @nxrocks/common ([56631b2](https://github.com/tinesoft/nxrocks/commit/56631b2fba89a79a54abaae7bd7b0944b4765d41)), closes [#131](https://github.com/tinesoft/nxrocks/issues/131) [#150](https://github.com/tinesoft/nxrocks/issues/150) [#152](https://github.com/tinesoft/nxrocks/issues/152) [#153](https://github.com/tinesoft/nxrocks/issues/153)
- include updated `package.json` in git when semantic releasing ([cb87139](https://github.com/tinesoft/nxrocks/commit/cb87139c95ba2f7256a8df7ff0c94410394ccb4f))
- **nx-flutter:** add missing `buildAar` builder ([44432eb](https://github.com/tinesoft/nxrocks/commit/44432eb37d2c849437a06af88f063a48d292d990))
- **nx-flutter:** add missing config for semantic-releasing ([06fd1bd](https://github.com/tinesoft/nxrocks/commit/06fd1bd3ea061a7b1f27d765ae077ec9906264d1))
- **nx-flutter:** add plugin to nx.json only if not included already ([b98c1e9](https://github.com/tinesoft/nxrocks/commit/b98c1e930fb4a2e1b3ca4bba98de66937f270084))
- **nx-flutter:** correct generation error due to `platforms` option ([fc56c5e](https://github.com/tinesoft/nxrocks/commit/fc56c5e1f93f3af3a8529c5e24ad08ae4f63da4a)), closes [#22](https://github.com/tinesoft/nxrocks/issues/22)
- **nx-flutter:** correct generation error on multi word `description` ([1ed2d97](https://github.com/tinesoft/nxrocks/commit/1ed2d977421557fd8b6a7aad2ad05f93d226e552)), closes [#23](https://github.com/tinesoft/nxrocks/issues/23)
- **nx-flutter:** fix error when generating module or package ([86eb3f8](https://github.com/tinesoft/nxrocks/commit/86eb3f872e9c89ec304f86352081299ea8cb0edd)), closes [#44](https://github.com/tinesoft/nxrocks/issues/44)
- **nx-flutter:** fix non-interactive generation of flutter projects ([6c4a5aa](https://github.com/tinesoft/nxrocks/commit/6c4a5aa4bbbbb6c18a57c69749581df84290c6dc))
- **nx-melos:** add missing `release` target in `project.json` ([a1d8c1f](https://github.com/tinesoft/nxrocks/commit/a1d8c1f235b051c9e2af17c722dd3a121af50ca6))
- **nx-micronaut:** fix `serve` and `apply-format` alias executors ([30d75d7](https://github.com/tinesoft/nxrocks/commit/30d75d767d4a473617c5b0fb2da4377b3c4eb79d))
- **nx-micronaut:** fix generation without feature ([#136](https://github.com/tinesoft/nxrocks/issues/136)) ([76db010](https://github.com/tinesoft/nxrocks/commit/76db0106c1943a2f7517ca02b34e2cdf3c02f8f8))
- **nx-micronaut:** fix project's base package/artifact name computation ([f2f2983](https://github.com/tinesoft/nxrocks/commit/f2f2983f821c41cbf94a2d3f20afb147221d19b5))
- **nx-quarkus:** add plugin to `nx.json` only if not included already ([a964652](https://github.com/tinesoft/nxrocks/commit/a964652ea79290f6095b481de61ebb398d29831c))
- **nx-quarkus:** fix `Premature close` error when generating project ([6ebcd85](https://github.com/tinesoft/nxrocks/commit/6ebcd85fd18cd923627f44630f0b1ad18fb88a57)), closes [#97](https://github.com/tinesoft/nxrocks/issues/97)
- **nx-quarkus:** fix `serve` and `apply-format` alias executors ([46b9695](https://github.com/tinesoft/nxrocks/commit/46b9695dc7926923177a4bba7e59f1b722101fb3))
- **nx-quarkus:** remove `ratchetFrom` from the default Spotless config ([59cb372](https://github.com/tinesoft/nxrocks/commit/59cb3728aaefcf658ef17fa4666e552b66e7d69c))
- **nx-spring-boot:** add plugin to nx.json only if not included already ([15511ae](https://github.com/tinesoft/nxrocks/commit/15511ae8ebdbc4d8cd412afd266457cf08b14f72))
- **nx-spring-boot:** always restore executable permissions on wrappers ([b9875d8](https://github.com/tinesoft/nxrocks/commit/b9875d879198a0a613041b00720c77923b54c6c1))
- **nx-spring-boot:** correct error when executing builders on Windows ([1a744ab](https://github.com/tinesoft/nxrocks/commit/1a744abf67cd07d0ebd259f12c4c02fc2bd8bdaa)), closes [#38](https://github.com/tinesoft/nxrocks/issues/38)
- **nx-spring-boot:** correct generation issue on Nx workspaces >=v11.2.0 ([d3c3816](https://github.com/tinesoft/nxrocks/commit/d3c3816fd739aa5f42133d05644e972d003c43ff)), closes [#37](https://github.com/tinesoft/nxrocks/issues/37)
- **nx-spring-boot:** correct wrong extension for `gradlew` on windows ([77899ce](https://github.com/tinesoft/nxrocks/commit/77899ceeac48fb9321b3b07b81958c8dbb1c078d))
- **nx-spring-boot:** fix `Premature close` error when generating project ([f6b433d](https://github.com/tinesoft/nxrocks/commit/f6b433d458b0f94c297b4581cd18f0bef3c0c5e6)), closes [#97](https://github.com/tinesoft/nxrocks/issues/97)
- **nx-spring-boot:** fix `serve` and `apply-format` alias executors ([29f5183](https://github.com/tinesoft/nxrocks/commit/29f5183ff00efcd62916a0dcefff005ab9659bdc))
- **nx-spring-boot:** fix creating spring boot libraries with `gradle` ([500a7d0](https://github.com/tinesoft/nxrocks/commit/500a7d04f09b843014329990c8e0644fa60d35f2))
- **nx-spring-boot:** fix error when generating a gradle/kotlin project ([abfbd04](https://github.com/tinesoft/nxrocks/commit/abfbd04bb97e5197bd60643e1a5adc4c16c3a5d5)), closes [#15](https://github.com/tinesoft/nxrocks/issues/15)
- **nx-spring-boot:** fix generation error when setting `javaVersion` ([364b228](https://github.com/tinesoft/nxrocks/commit/364b22885e74706fd3f6d10323325323439aa2f1)), closes [#98](https://github.com/tinesoft/nxrocks/issues/98)
- **nx-spring-boot:** fix library projects should not be executable ([b118a4e](https://github.com/tinesoft/nxrocks/commit/b118a4e414d3dcae0f81cec3e366ce2096aa34e3)), closes [#113](https://github.com/tinesoft/nxrocks/issues/113)
- **nx-spring-boot:** fix prompts not working generating the application ([b96e1ce](https://github.com/tinesoft/nxrocks/commit/b96e1ceb304ae70d0d91eb42507210199adf8de0)), closes [#6](https://github.com/tinesoft/nxrocks/issues/6)
- **nx-spring-boot:** fix wrong 'cwd' used to execute builders commands ([b39e7e7](https://github.com/tinesoft/nxrocks/commit/b39e7e7a6d6266939ce153ad97b121573372a74b))
- **nx-spring-boot:** make builders executable platform independant ([b27bc4c](https://github.com/tinesoft/nxrocks/commit/b27bc4cc81454727bc15f12e896756a679ecd845))
- **nx-spring-boot:** remove `ratchetFrom` from the default Spotless conf ([1462022](https://github.com/tinesoft/nxrocks/commit/1462022a22eb4714bb590b7b18b3addb8643387e))
- **nx-spring-boot:** remove extra char in `dependencies` prompt ([5bc0290](https://github.com/tinesoft/nxrocks/commit/5bc0290601b5b3815de9a95125c551c4f9448997))
- **nx-spring-boot:** set correct path for executors ([89e16d3](https://github.com/tinesoft/nxrocks/commit/89e16d37c329965a61b4812cde1d3155ac8e2827))
- **nx-spring-boot:** some user options were not used during generation ([6813e7d](https://github.com/tinesoft/nxrocks/commit/6813e7d62f4919fe616b52fc2903ca4a6129a50a)), closes [#17](https://github.com/tinesoft/nxrocks/issues/17)
- plugins include spec files in distributed pkg ([21bac53](https://github.com/tinesoft/nxrocks/commit/21bac5398c05be293cd250e46814b8f86468bc4f))
- set `@nrwl/*` packages as `peerDependencies` ([d03b709](https://github.com/tinesoft/nxrocks/commit/d03b70983f278a86c19c8fa28d99603682cad2cd)), closes [#106](https://github.com/tinesoft/nxrocks/issues/106)

### Features

- **common:** add a utility to disable a gradle plugin ([171ad81](https://github.com/tinesoft/nxrocks/commit/171ad81c503d204563bf5867f4874864392ebdeb))
- **common:** add a utility to remove a maven plugin from the `pom.xml` ([8c13087](https://github.com/tinesoft/nxrocks/commit/8c1308766ad69eda3cbaa4c61f4a0b1837f6fc6d))
- **common:** add helper to get project root directory ([adbc8a9](https://github.com/tinesoft/nxrocks/commit/adbc8a97e2096951acce3fd8d10407255c17a956))
- **common:** add support for `nx-micronaut` plugin ([b72cdaf](https://github.com/tinesoft/nxrocks/commit/b72cdaffd1749868806dc2eac8c24573344adaa5))
- **common:** add utility method to get http[s] proxy agent ([da61925](https://github.com/tinesoft/nxrocks/commit/da619254be5699930a6f5bd2e7ea65475509b730))
- **common:** add utility to check the presence of a plugin in `pom.xml` ([bfec05f](https://github.com/tinesoft/nxrocks/commit/bfec05f6a3d2b611b9df71432a8a2a2a0ea1fc60))
- **common:** add utility to unzip a zip stream ([a472c00](https://github.com/tinesoft/nxrocks/commit/a472c00cdf32bf6513914cf031de4adef107e9f6))
- **common:** add xml utilities to remove or check if a node is empty ([d07b827](https://github.com/tinesoft/nxrocks/commit/d07b82745ce5294bc20a4dc0effff53656c9fee4))
- **common:** allow using legacy wrappers (i.e `.bat`, for maven mostly) ([7a13720](https://github.com/tinesoft/nxrocks/commit/7a137206a7783ed83e7ccb628691b00c91477d87))
- **common:** increase the `maxBuffer` when running executors commands ([4bc388d](https://github.com/tinesoft/nxrocks/commit/4bc388d5068aa73003bf09776757fe7b357bb0cf))
- **common:** make the `version` optional when adding a gradle plugin ([bd3a182](https://github.com/tinesoft/nxrocks/commit/bd3a182bfa1fea1311cf86ea0b37068a68bff423))
- **common:** move `octal` function into e2e testing utils ([b15a616](https://github.com/tinesoft/nxrocks/commit/b15a61659289bbc3d986b4f58e7e5a49dafdc400))
- **common:** update Spotless gradle plugin from `6.2.2` --> `6.8.0` ([8c76d3b](https://github.com/tinesoft/nxrocks/commit/8c76d3b688b434224337e2a182e306f8d6a1931e))
- **common:** update Spotless maven plugin from `2.20.2` --> `2.23.0` ([ab182ef](https://github.com/tinesoft/nxrocks/commit/ab182efc6c27b236a857b4b7b8cd795ed248214e))
- **nx-flutter:** add `create` alias to project generation schematics ([0386629](https://github.com/tinesoft/nxrocks/commit/03866292ea1a354a6eca43cb9ae7e691188736bd)), closes [#27](https://github.com/tinesoft/nxrocks/issues/27)
- **nx-flutter:** add `doctor` executor to run `flutter doctor` checks ([9d35de1](https://github.com/tinesoft/nxrocks/commit/9d35de18787ae3d8ab7d863727d0fa20592c19de))
- **nx-flutter:** add nx-flutter plugin ([e7426e9](https://github.com/tinesoft/nxrocks/commit/e7426e99a449c774d3f9408ac49711974d9855a0))
- **nx-flutter:** add special instructions to generate the app ([d5f768a](https://github.com/tinesoft/nxrocks/commit/d5f768a87b375725af1a484277aca154abaa4ac6))
- **nx-flutter:** add support for Nx 's dependency graph generation ([6fb58de](https://github.com/tinesoft/nxrocks/commit/6fb58de673c968f78e72eec6eda7806760a72419)), closes [#28](https://github.com/tinesoft/nxrocks/issues/28)
- **nx-flutter:** auto-adapt prompt & builders based on previous answers ([668dd28](https://github.com/tinesoft/nxrocks/commit/668dd285aad1a37b7444cadc6702d14b2482f795)), closes [#26](https://github.com/tinesoft/nxrocks/issues/26)
- **nx-flutter:** create project in `apps` or `libs` based on `template` ([dc20e0b](https://github.com/tinesoft/nxrocks/commit/dc20e0bf5b66d2b4fa9838f57fa91a55358e0a38)), closes [#41](https://github.com/tinesoft/nxrocks/issues/41)
- **nx-flutter:** improve typings for `template` and `platforms` options ([b614dc4](https://github.com/tinesoft/nxrocks/commit/b614dc41ebd92c4a1f2be34e3ff83ecf0608ba83))
- **nx-flutter:** make all `build` executors results cacheable ([a08dbb8](https://github.com/tinesoft/nxrocks/commit/a08dbb831fb8cc29acc747f93f66fba3688eafd4))
- **nx-flutter:** migrate to Nrwl's DevKit executors/generators API ([8c72ed5](https://github.com/tinesoft/nxrocks/commit/8c72ed5dbbb7f382f1206ebe6b019d74362f046b))
- **nx-flutter:** rename executors to use `kebab-case` ([319558f](https://github.com/tinesoft/nxrocks/commit/319558f912f5bea3826f242cea02ed51f727b38a))
- **nx-flutter:** rename the `application` generator into `project` ([6361557](https://github.com/tinesoft/nxrocks/commit/63615577bf48de00b10d1110a1d6582c2abbfda3))
- **nx-flutter:** use `NX_VERBOSE_LOGGING` to control logs in dep graph ([e678ed5](https://github.com/tinesoft/nxrocks/commit/e678ed5255aff9ea0fcd2a515f61de3d13539b64))
- **nx-melos:** add `nx-melos` plugin ([4fb5da8](https://github.com/tinesoft/nxrocks/commit/4fb5da8c7883e9a8703383bcf683a533269fc047))
- **nx-micronaut:** add proxy support for project generation ([615c412](https://github.com/tinesoft/nxrocks/commit/615c41204e481add401487459f104917a3dd3dd3))
- **nx-micronaut:** add `nx-micronaut` plugin ([08d6099](https://github.com/tinesoft/nxrocks/commit/08d6099001bbfff830963584598da3d6a3eac66c))
- **nx-micronaut:** add `skipFormat` to control code formatting ([bbc0df2](https://github.com/tinesoft/nxrocks/commit/bbc0df241ca8bd6f09a99d71fa5b73d610cedb10))
- **nx-micronaut:** add install executor + make build depend on it ([10ab5b7](https://github.com/tinesoft/nxrocks/commit/10ab5b7e843d740cf1575ca967fba9356dfc6344))
- **nx-micronaut:** make `build` executor results cacheable ([d116760](https://github.com/tinesoft/nxrocks/commit/d116760d34ec5402a1911f6d06af235c0fbf24b3))
- **nx-micronaut:** rename executors to use `kebab-case` ([7bfc305](https://github.com/tinesoft/nxrocks/commit/7bfc305ace8fc8e38a6d5732049a6b435223b10e))
- **nx-micronaut:** unselect by default adding code formatting support ([cb52710](https://github.com/tinesoft/nxrocks/commit/cb527103af9c3ed27aa063f49a4c0907e16bee1c))
- **nx-micronaut:** update JDK version from `16` -> `17` ([a0e81e1](https://github.com/tinesoft/nxrocks/commit/a0e81e194a1c2ca21ec43d7d2831a6b4c7eb9ef8)), closes [#135](https://github.com/tinesoft/nxrocks/issues/135)
- **nx-quarkus:** add `format` executor ([89e6c4d](https://github.com/tinesoft/nxrocks/commit/89e6c4d4c6f9ab94c4c0b5da7cd56104791a83c2))
- **nx-quarkus:** add proxy support for project generation ([eaefe9a](https://github.com/tinesoft/nxrocks/commit/eaefe9a3d78e1731d83a781d1e867da5ad95d801))
- **nx-quarkus:** add `format-check` executor to check code format ([d19f5ca](https://github.com/tinesoft/nxrocks/commit/d19f5ca5cc574dc680e515377af2a5df3576032e))
- **nx-quarkus:** add `link` generator to link projects implicitly ([2655b4f](https://github.com/tinesoft/nxrocks/commit/2655b4f326f4386893706d4ae024f6f84f419eac))
- **nx-quarkus:** add `skipFormat` to control code formatting ([197fe5e](https://github.com/tinesoft/nxrocks/commit/197fe5ecc667f824716d27d8f4e7cb36bc87e6bb))
- **nx-quarkus:** add aliases for the format executor ([bcedf98](https://github.com/tinesoft/nxrocks/commit/bcedf98548ab96fedd8f9a05dace97ab3ffcc44a))
- **nx-quarkus:** add install executor + make build depend on it ([a18a9aa](https://github.com/tinesoft/nxrocks/commit/a18a9aaaeb92a779b98dfb82fdf72ac702c7ca34)), closes [#65](https://github.com/tinesoft/nxrocks/issues/65)
- **nx-quarkus:** add plugin to integrate `Quarkus` inside Nx workspace ([2f7c6c0](https://github.com/tinesoft/nxrocks/commit/2f7c6c0537629027ebffce3173df2cc6278ca29d))
- **nx-quarkus:** check if source is a valid quarkus project on linking ([dc97a41](https://github.com/tinesoft/nxrocks/commit/dc97a413037d02fa85057a52737398bc53b10332))
- **nx-quarkus:** improve logging when project zip can't be fetched ([cb983f9](https://github.com/tinesoft/nxrocks/commit/cb983f9fa78676c591feef922a4f0ec1fff3a7c4))
- **nx-quarkus:** improve detection of quarkus projects in the workspace ([ee4731d](https://github.com/tinesoft/nxrocks/commit/ee4731d14f352ebec5a12a6e3face14282a4cec3))
- **nx-quarkus:** make `build` executor results cacheable ([6fb6a36](https://github.com/tinesoft/nxrocks/commit/6fb6a363dcdca95b8bc38206613f80e003948211))
- **nx-quarkus:** rename executors to use `kebab-case` ([a8dd56c](https://github.com/tinesoft/nxrocks/commit/a8dd56cd253270c496360a4182cd069919979eb6))
- **nx-quarkus:** unselect by default adding code formatting support ([4892ad8](https://github.com/tinesoft/nxrocks/commit/4892ad81f8e4f17d7dc83d8ca037133ffa164dd7))
- **nx-quarkus:** use `NX_VERBOSE_LOGGING` to control logs in dep graph ([5eaa639](https://github.com/tinesoft/nxrocks/commit/5eaa63992db1454d678b9220a63f751b049b882b))
- **nx-spring-boot:** add proxy support for project generation ([bd3ac7e](https://github.com/tinesoft/nxrocks/commit/bd3ac7e7c577714df272c1fa972c1d0280b91c14)), closes [#125](https://github.com/tinesoft/nxrocks/issues/125)
- **nx-spring-boot:** add java 16 support to align w/ Spring Initializr ([89c1d1e](https://github.com/tinesoft/nxrocks/commit/89c1d1eb2eb91f317ac0adf7643f87db05db68e1))
- **nx-spring-boot:** add java 17 support to align w/ Spring Initializr ([131df91](https://github.com/tinesoft/nxrocks/commit/131df91c89ece06ddfae7eb93d1ace2cccad0cc9))
- **nx-spring-boot:** add `application` schematics ([f22e63f](https://github.com/tinesoft/nxrocks/commit/f22e63f1f133d92907cf457a8d817a5e9df13dfe))
- **nx-spring-boot:** add `clean` builder ([33a1435](https://github.com/tinesoft/nxrocks/commit/33a1435a298cf56568bcd2ea2ed11030e0a1c780))
- **nx-spring-boot:** add `format-check` executor to check code format ([337fca8](https://github.com/tinesoft/nxrocks/commit/337fca8356fba17a1ff54e32204a6d4351d63f8c))
- **nx-spring-boot:** add `format` executor ([b5362ae](https://github.com/tinesoft/nxrocks/commit/b5362ae72fcec47be07df22df3e3ec3e9f047e9a))
- **nx-spring-boot:** add `ignoreWrapper` option to all builders ([e045bca](https://github.com/tinesoft/nxrocks/commit/e045bca8d89a68770bf9977c9bddedc65cdbf488)), closes [#31](https://github.com/tinesoft/nxrocks/issues/31)
- **nx-spring-boot:** add `install` executor + make `build` depend on it ([68e1a5e](https://github.com/tinesoft/nxrocks/commit/68e1a5ef5ed266c65ee348c6ced022f87edb1fb7)), closes [#65](https://github.com/tinesoft/nxrocks/issues/65) [#66](https://github.com/tinesoft/nxrocks/issues/66) [#71](https://github.com/tinesoft/nxrocks/issues/71)
- **nx-spring-boot:** add `link` generator to link projects implicitly ([1142d04](https://github.com/tinesoft/nxrocks/commit/1142d0438a1c2d28668efcdce8804c43bef56717))
- **nx-spring-boot:** add `serve` builder (alias to `run` builder) ([16dfdb4](https://github.com/tinesoft/nxrocks/commit/16dfdb4e662d8b6904db98030f0abcbfefaf634a)), closes [#8](https://github.com/tinesoft/nxrocks/issues/8)
- **nx-spring-boot:** add `skipFormat` to control code formatting ([8bff29b](https://github.com/tinesoft/nxrocks/commit/8bff29bf849138cea75a0cbf09e5d164a732e470))
- **nx-spring-boot:** add `test` builder ([e257d27](https://github.com/tinesoft/nxrocks/commit/e257d273f4d7d17a837d38390c6e6045d3685521)), closes [#30](https://github.com/tinesoft/nxrocks/issues/30)
- **nx-spring-boot:** add `User-Agent` header to requests to Initializr ([4c7f345](https://github.com/tinesoft/nxrocks/commit/4c7f345a0c9e1e73dded4731cca50adaeb10f8d3)), closes [#11](https://github.com/tinesoft/nxrocks/issues/11)
- **nx-spring-boot:** add aliases for the format executor ([cbcee00](https://github.com/tinesoft/nxrocks/commit/cbcee00da217a4b609efeecfa80c2d16bd44e170))
- **nx-spring-boot:** add builders for run, buildJar/War, buildImage and buildInfo commands ([5c75781](https://github.com/tinesoft/nxrocks/commit/5c757815c2a07231d49d66f4da44c1ffe268efe7))
- **nx-spring-boot:** add support for `Kotlin DSL` when using `gradle` ([31063fe](https://github.com/tinesoft/nxrocks/commit/31063fea75eb1abe23490204859df81dde019328))
- **nx-spring-boot:** add support for additional params for `buildJar` and `buildWar` builders ([b85ad9c](https://github.com/tinesoft/nxrocks/commit/b85ad9cdd401e9fb98a9992877f9cc56c76f199d))
- **nx-spring-boot:** add support for additional params for `run` and `buildImage` builders ([1d9fbb3](https://github.com/tinesoft/nxrocks/commit/1d9fbb3b232e1ea662376dd02650ec875b0807a7))
- **nx-spring-boot:** add support for Java 18 ([6dd94e1](https://github.com/tinesoft/nxrocks/commit/6dd94e1a34a2d5a597284332b0eac66c569fa559))
- **nx-spring-boot:** add support for Nx's dependency graph generation ([95abe9d](https://github.com/tinesoft/nxrocks/commit/95abe9d297d166199f3ab1e6c761efdeffca02d0))
- **nx-spring-boot:** align Java versions with `Spring Initializr` ([1f6545d](https://github.com/tinesoft/nxrocks/commit/1f6545d9a2c230846a3eadd5c8eb2e9b2b1f1663))
- **nx-spring-boot:** allow generating `application` or `library` ([530186c](https://github.com/tinesoft/nxrocks/commit/530186c66ea65e621cb8e63c08e5281705209130))
- **nx-spring-boot:** better determine the underlying build system ([0edfe51](https://github.com/tinesoft/nxrocks/commit/0edfe51e2633ceb9b7491f88c9b1640f2fdd04b0))
- **nx-spring-boot:** check if source is a valid boot project on linking ([f74e524](https://github.com/tinesoft/nxrocks/commit/f74e5248c6a86296e7f9757d1349f9e166ec529f))
- **nx-spring-boot:** improve detection of boot projects in workspace ([bfb99ed](https://github.com/tinesoft/nxrocks/commit/bfb99ed2e18e1dfe38d424f7763583831dae9bc2))
- **nx-spring-boot:** improve logging when project zip can't be fetched ([f1a5229](https://github.com/tinesoft/nxrocks/commit/f1a52297d5c2ca636b1cefd57aad018ba7108055))
- **nx-spring-boot:** make `build` executor results cacheable ([4528715](https://github.com/tinesoft/nxrocks/commit/45287156e1c85f29b27edb53d8fb14ad04a74ecc))
- **nx-spring-boot:** make jar of `library` projects not executable ([1e2984f](https://github.com/tinesoft/nxrocks/commit/1e2984ff00ca2f94ffbc07b94de26c476b14e500)), closes [#67](https://github.com/tinesoft/nxrocks/issues/67)
- **nx-spring-boot:** merge `buildJar` and `buildWar` executors ([9fdfec2](https://github.com/tinesoft/nxrocks/commit/9fdfec2c629fd11c8e266ee81567196e6178136a)), closes [#43](https://github.com/tinesoft/nxrocks/issues/43)
- **nx-spring-boot:** migrate to Nrwl's DevKit executors/generators API ([47231fd](https://github.com/tinesoft/nxrocks/commit/47231fd9a2a9791e929837144b4dbf080be0385f))
- **nx-spring-boot:** rename executors to use `kebab-case` ([1e5d9f4](https://github.com/tinesoft/nxrocks/commit/1e5d9f4f3e41853afd00c6756e8841028800c280)), closes [#117](https://github.com/tinesoft/nxrocks/issues/117)
- **nx-spring-boot:** rename the `application` generator into `project` ([05b5272](https://github.com/tinesoft/nxrocks/commit/05b5272bdffbc38644d8c5999f5965f6f64df531))
- **nx-spring-boot:** set `Java 17` as default version ([f41c555](https://github.com/tinesoft/nxrocks/commit/f41c555a0368753ad218d5c10ef9328a86a7f52a))
- **nx-spring-boot:** unselect by default adding code formatting support ([005ad95](https://github.com/tinesoft/nxrocks/commit/005ad950d75d2886f62847cfcb1ef51abb1942a0))
- **nx-spring-boot:** use `NX_VERBOSE_LOGGING` to control dep graph logs ([ed9e444](https://github.com/tinesoft/nxrocks/commit/ed9e444488aeb9dbe86338d3e894bae85029663f)), closes [#68](https://github.com/tinesoft/nxrocks/issues/68)
- update to Nx workspace `v15.0.0` ([a0af206](https://github.com/tinesoft/nxrocks/commit/a0af2064acbd8e65b4f603ca9e3ce2c6ce990795)), closes [#138](https://github.com/tinesoft/nxrocks/issues/138)

### BREAKING CHANGES

- Nx `v15.x.x` is now the minimum required version to use the plugin
- **nx-flutter:** `interactive` option has been renamed into `skipAdditionalPrompts`

`interactive` is a reserved option for `nx generate` command, that gets deleted once Nx has interpreted it, so we need our own. Must still be combined with `--no-interactive` (from Nx), for fully non-interactivity

- **nx-micronaut:** `format-check` executor was renamed into `check-format` and `do-fomat` was removed
- **nx-quarkus:** `format-check` executor was renamed into `check-format` and `do-fomat` was removed
- **nx-spring-boot:** `format-check` executor was renamed into `check-format`
- **nx-flutter:** All executors of this plugin now use `kebab-case` over `camelCase` for consistency

This only affects `buildAar`, `buildApk`, `buildAppbundle`, `buildBundle`, `buildIos`, `buildIosFramework`, `buildIpa`, and `genL10n` executors, which have been renamed into `build-aar`, `build-apk`, `build-appbundle`, `build-bundle`, `build-ios`, `build-ios-framework`, `build-ipa`, and `gen-l10n` respectively.

- **nx-micronaut:** All executors of this plugin now use `kebab-case` over `camelCase` for consistency

This only affects `aotSampleConfig` executor, which has been renamed into `aot-sample-config`.

- **nx-quarkus:** All executors of this plugin now use `kebab-case` over `camelCase` for consistency

This only affects `remoteDev`, `addExtension` and `listExtensions` executors, which have been renamed into `remote-dev`, `add-extension`, and `list-extensions` respectively.

- **nx-spring-boot:** All executors of this plugin now use `kebab-case` over `camelCase` for consistency

This only affect `buildImage` and `buildInfo` executors, which have been renamed into `build-image` and `build-info` respectively.

- **nx-spring-boot:** `build` is now the only executor to use to build the final jar or war
- Nx v12.6.x is now the minimum version required to use the plugins

This is due to breaking changes in DevKit's project graph API starting from v12.6.x

- **nx-flutter:** the `app` alias has been replaced with one of [`proj`, `new`, `gen`, `init`, `generate`].
- **nx-flutter:** Nx workspace v11 is now the minimum version required to use this plugin.

In fact, all builders/schematics have been rewritten into executors/generators using its new `@nrwl/devkit` API.

- **nx-spring-boot:** the `app` alias has been replaced with one of [`proj`, `new`, `gen`, `init`, `create`, `generate`].
- **nx-spring-boot:** Nx workspace v11 is now the minimum version required to use this plugin.

In fact, all builders/schematics have been rewritten into executors/generators using its new `@nrwl/devkit` API.
