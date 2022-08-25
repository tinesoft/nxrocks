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
