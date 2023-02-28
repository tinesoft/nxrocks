# [@nxrocks/common-v2.3.0](https://github.com/tinesoft/nxrocks/compare/common/v2.2.1...common/v2.3.0) (2023-02-28)

### Bug Fixes

- improve schemas of generators for a better UX in `Nx Console` ([0214736](https://github.com/tinesoft/nxrocks/commit/02147369d855247538becf7730f088765f7734d4))
- **nx-melos:** fix typo in `nx-melos.mjs` file ([6c7cff6](https://github.com/tinesoft/nxrocks/commit/6c7cff6c81740bb9384ecaa7f1bbaecd5fd611be))

### Features

- **nx-micronaut:** add `test` executor to cached outputs ([be7920e](https://github.com/tinesoft/nxrocks/commit/be7920e79032c60e1dcde727a261885a88623183))
- **nx-quarkus:** add `test` executor to cached outputs ([e353208](https://github.com/tinesoft/nxrocks/commit/e353208547def1ba74c8e695b552038fa0f8768f))
- **nx-spring-boot:** add `build-image` and `test` to cached outputs ([1cc3a71](https://github.com/tinesoft/nxrocks/commit/1cc3a712249a7e24c29e80a1d8a0a67c5d2e19f4))

# [@nxrocks/common-v2.2.0](https://github.com/tinesoft/nxrocks/compare/common/v2.1.0...common/v2.2.0) (2023-01-10)

### Bug Fixes

- **common:** fix bug when fetching dependencies of maven based projects ([2ada704](https://github.com/tinesoft/nxrocks/commit/2ada704f17bdf4a2bec5314b1faf2147c460e4b2))

# [@nxrocks/common-v2.1.0](https://github.com/tinesoft/nxrocks/compare/common/v2.0.0...common/v2.1.0) (2022-12-05)

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

# [@nxrocks/common-v2.0.0](https://github.com/tinesoft/nxrocks/compare/common/v1.2.2...common/v2.0.0) (2022-10-17)

### Bug Fixes

- **common:** fix regex used to fetch gradle dependencies ([f1779a4](https://github.com/tinesoft/nxrocks/commit/f1779a472c6c5ebeeec30674540b6d017478e4f7))
- **nx-micronaut:** fix generation without feature ([#136](https://github.com/tinesoft/nxrocks/issues/136)) ([76db010](https://github.com/tinesoft/nxrocks/commit/76db0106c1943a2f7517ca02b34e2cdf3c02f8f8))

### Features

- **common:** increase the `maxBuffer` when running executors commands ([4bc388d](https://github.com/tinesoft/nxrocks/commit/4bc388d5068aa73003bf09776757fe7b357bb0cf))
- **nx-micronaut:** update JDK version from `16` -> `17` ([a0e81e1](https://github.com/tinesoft/nxrocks/commit/a0e81e194a1c2ca21ec43d7d2831a6b4c7eb9ef8)), closes [#135](https://github.com/tinesoft/nxrocks/issues/135)
- update to Nx workspace `v15.0.0` ([a0af206](https://github.com/tinesoft/nxrocks/commit/a0af2064acbd8e65b4f603ca9e3ce2c6ce990795)), closes [#138](https://github.com/tinesoft/nxrocks/issues/138)

### BREAKING CHANGES

- Nx `v15.x.x` is now the minimum required version to use the plugin

# [@nxrocks/common-v1.2.2](https://github.com/tinesoft/nxrocks/compare/common/v1.2.1...common/v1.2.2) (2022-08-25)

### Bug Fixes

- fix executor output not restored when found in Nx cache ([fbb385a](https://github.com/tinesoft/nxrocks/commit/fbb385ab2cb468c8b41b224e353d9b891bb4e48c)), closes [#111](https://github.com/tinesoft/nxrocks/issues/111)

# [@nxrocks/common-v1.2.1](https://github.com/tinesoft/nxrocks/compare/common/v1.2.0...common/v1.2.1) (2022-08-22)

### Bug Fixes

- fix installation issue due to `hpagent` not being found ([3620d23](https://github.com/tinesoft/nxrocks/commit/3620d2329103076bbb4713bac48c4f0c734bd545)), closes [#128](https://github.com/tinesoft/nxrocks/issues/128)

# [@nxrocks/common-v1.2.0](https://github.com/tinesoft/nxrocks/compare/common/v1.1.0...common/v1.2.0) (2022-08-21)

### Bug Fixes

- **common:** ignore output when fetching package latest version from npm ([f426575](https://github.com/tinesoft/nxrocks/commit/f4265757aad0a350b3b966f0076192600221ae67))
- **common:** improve the checking/adding of a maven plugin in `pom.xml` ([b8f59cf](https://github.com/tinesoft/nxrocks/commit/b8f59cf6db1bddf2f65cbb8d340fa3784978c109))
- set `@nrwl/*` packages as `peerDependencies` ([d03b709](https://github.com/tinesoft/nxrocks/commit/d03b70983f278a86c19c8fa28d99603682cad2cd)), closes [#106](https://github.com/tinesoft/nxrocks/issues/106)

### Features

- **common:** add a utility to disable a gradle plugin ([171ad81](https://github.com/tinesoft/nxrocks/commit/171ad81c503d204563bf5867f4874864392ebdeb))
- **common:** add a utility to remove a maven plugin from the `pom.xml` ([8c13087](https://github.com/tinesoft/nxrocks/commit/8c1308766ad69eda3cbaa4c61f4a0b1837f6fc6d))
- **common:** add helper to get project root directory ([adbc8a9](https://github.com/tinesoft/nxrocks/commit/adbc8a97e2096951acce3fd8d10407255c17a956))
- **common:** add support for `nx-micronaut` plugin ([b72cdaf](https://github.com/tinesoft/nxrocks/commit/b72cdaffd1749868806dc2eac8c24573344adaa5))
- **common:** add utility method to get http[s] proxy agent ([da61925](https://github.com/tinesoft/nxrocks/commit/da619254be5699930a6f5bd2e7ea65475509b730))
- **common:** add utility to check the presence of a plugin in `pom.xml` ([bfec05f](https://github.com/tinesoft/nxrocks/commit/bfec05f6a3d2b611b9df71432a8a2a2a0ea1fc60))
- **common:** add xml utilities to remove or check if a node is empty ([d07b827](https://github.com/tinesoft/nxrocks/commit/d07b82745ce5294bc20a4dc0effff53656c9fee4))
- **common:** allow using legacy wrappers (i.e `.bat`, for maven mostly) ([7a13720](https://github.com/tinesoft/nxrocks/commit/7a137206a7783ed83e7ccb628691b00c91477d87))
- **common:** make the `version` optional when adding a gradle plugin ([bd3a182](https://github.com/tinesoft/nxrocks/commit/bd3a182bfa1fea1311cf86ea0b37068a68bff423))
- **common:** move `octal` function into e2e testing utils ([b15a616](https://github.com/tinesoft/nxrocks/commit/b15a61659289bbc3d986b4f58e7e5a49dafdc400))
- **common:** update Spotless gradle plugin from `6.2.2` --> `6.8.0` ([8c76d3b](https://github.com/tinesoft/nxrocks/commit/8c76d3b688b434224337e2a182e306f8d6a1931e))
- **common:** update Spotless maven plugin from `2.20.2` --> `2.23.0` ([ab182ef](https://github.com/tinesoft/nxrocks/commit/ab182efc6c27b236a857b4b7b8cd795ed248214e))

# [@nxrocks/common-v1.1.0](https://github.com/tinesoft/nxrocks/compare/common/v1.0.2...common/v1.1.0) (2022-06-21)

### Features

- **common:** add utility to unzip a zip stream ([a472c00](https://github.com/tinesoft/nxrocks/commit/a472c00cdf32bf6513914cf031de4adef107e9f6))

# [@nxrocks/common-v1.0.2](https://github.com/tinesoft/nxrocks/compare/common/v1.0.1...common/v1.0.2) (2022-02-16)

### Bug Fixes

- wrong `@nxrocks/common` version referenced in dependent packages ([1b4b0e6](https://github.com/tinesoft/nxrocks/commit/1b4b0e6b1df604177585e703e092cf3652ef86b0))

# [@nxrocks/common-v1.0.1](https://github.com/tinesoft/nxrocks/compare/common/v1.0.0...common/v1.0.1) (2022-02-15)

### Bug Fixes

- include updated `package.json` in git when semantic releasing ([cb87139](https://github.com/tinesoft/nxrocks/commit/cb87139c95ba2f7256a8df7ff0c94410394ccb4f))

# @nxrocks/common-v1.0.0 (2022-02-14)

### Bug Fixes

- **common:** fix wrong groupId used for Spotless maven plugin ([3e4c613](https://github.com/tinesoft/nxrocks/commit/3e4c61330eb2f72589d97578dd3d1449e4b0ca15))
