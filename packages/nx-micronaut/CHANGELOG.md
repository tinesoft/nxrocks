# [@nxrocks/nx-micronaut-v2.2.1](https://github.com/tinesoft/nxrocks/compare/nx-micronaut/v2.2.0...nx-micronaut/v2.2.1) (2023-01-10)

### Bug Fixes

- **nx-melos:** add missing `release` target in `project.json` ([a1d8c1f](https://github.com/tinesoft/nxrocks/commit/a1d8c1f235b051c9e2af17c722dd3a121af50ca6))

# [@nxrocks/nx-micronaut-v2.2.0](https://github.com/tinesoft/nxrocks/compare/nx-micronaut/v2.1.0...nx-micronaut/v2.2.0) (2023-01-10)

### Bug Fixes

- **common:** fix bug when fetching dependencies of maven based projects ([2ada704](https://github.com/tinesoft/nxrocks/commit/2ada704f17bdf4a2bec5314b1faf2147c460e4b2))

### Features

- **nx-melos:** add `nx-melos` plugin ([4fb5da8](https://github.com/tinesoft/nxrocks/commit/4fb5da8c7883e9a8703383bcf683a533269fc047))

# [@nxrocks/nx-micronaut-v2.1.0](https://github.com/tinesoft/nxrocks/compare/nx-micronaut/v2.0.0...nx-micronaut/v2.1.0) (2022-12-05)

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

# [@nxrocks/nx-micronaut-v2.0.0](https://github.com/tinesoft/nxrocks/compare/nx-micronaut/v1.0.2...nx-micronaut/v2.0.0) (2022-10-17)

### Bug Fixes

- **common:** fix regex used to fetch gradle dependencies ([f1779a4](https://github.com/tinesoft/nxrocks/commit/f1779a472c6c5ebeeec30674540b6d017478e4f7))
- **nx-micronaut:** fix generation without feature ([#136](https://github.com/tinesoft/nxrocks/issues/136)) ([76db010](https://github.com/tinesoft/nxrocks/commit/76db0106c1943a2f7517ca02b34e2cdf3c02f8f8))

### Features

- **common:** increase the `maxBuffer` when running executors commands ([4bc388d](https://github.com/tinesoft/nxrocks/commit/4bc388d5068aa73003bf09776757fe7b357bb0cf))
- **nx-micronaut:** update JDK version from `16` -> `17` ([a0e81e1](https://github.com/tinesoft/nxrocks/commit/a0e81e194a1c2ca21ec43d7d2831a6b4c7eb9ef8)), closes [#135](https://github.com/tinesoft/nxrocks/issues/135)
- update to Nx workspace `v15.0.0` ([a0af206](https://github.com/tinesoft/nxrocks/commit/a0af2064acbd8e65b4f603ca9e3ce2c6ce990795)), closes [#138](https://github.com/tinesoft/nxrocks/issues/138)

### BREAKING CHANGES

- Nx `v15.x.x` is now the minimum required version to use the plugin

# [@nxrocks/nx-micronaut-v1.0.2](https://github.com/tinesoft/nxrocks/compare/nx-micronaut/v1.0.1...nx-micronaut/v1.0.2) (2022-08-25)

### Bug Fixes

- fix executor output not restored when found in Nx cache ([fbb385a](https://github.com/tinesoft/nxrocks/commit/fbb385ab2cb468c8b41b224e353d9b891bb4e48c)), closes [#111](https://github.com/tinesoft/nxrocks/issues/111)

# [@nxrocks/nx-micronaut-v1.0.1](https://github.com/tinesoft/nxrocks/compare/nx-micronaut/v1.0.0...nx-micronaut/v1.0.1) (2022-08-22)

### Bug Fixes

- fix installation issue due to `hpagent` not being found ([3620d23](https://github.com/tinesoft/nxrocks/commit/3620d2329103076bbb4713bac48c4f0c734bd545)), closes [#128](https://github.com/tinesoft/nxrocks/issues/128)

# @nxrocks/nx-micronaut-v1.0.0 (2022-08-21)

### Bug Fixes

- wrong `@nxrocks/common` version referenced in dependent packages ([1b4b0e6](https://github.com/tinesoft/nxrocks/commit/1b4b0e6b1df604177585e703e092cf3652ef86b0))
- correct `TypeError: builder.getProjectGraph is not a function` ([3458f66](https://github.com/tinesoft/nxrocks/commit/3458f668f6f3420140fef25f908b08c26511f433)), closes [#72](https://github.com/tinesoft/nxrocks/issues/72)
- include updated `package.json` in git when semantic releasing ([cb87139](https://github.com/tinesoft/nxrocks/commit/cb87139c95ba2f7256a8df7ff0c94410394ccb4f))
- **nx-micronaut:** fix `serve` and `apply-format` alias executors ([30d75d7](https://github.com/tinesoft/nxrocks/commit/30d75d767d4a473617c5b0fb2da4377b3c4eb79d))
- **nx-micronaut:** fix project's base package/artifact name computation ([f2f2983](https://github.com/tinesoft/nxrocks/commit/f2f2983f821c41cbf94a2d3f20afb147221d19b5))
- plugins include spec files in distributed pkg ([21bac53](https://github.com/tinesoft/nxrocks/commit/21bac5398c05be293cd250e46814b8f86468bc4f))
- set `@nrwl/*` packages as `peerDependencies` ([d03b709](https://github.com/tinesoft/nxrocks/commit/d03b70983f278a86c19c8fa28d99603682cad2cd)), closes [#106](https://github.com/tinesoft/nxrocks/issues/106)

### Features

- **nx-micronaut:** add proxy support for project generation ([615c412](https://github.com/tinesoft/nxrocks/commit/615c41204e481add401487459f104917a3dd3dd3))
- **nx-micronaut:** add `nx-micronaut` plugin ([08d6099](https://github.com/tinesoft/nxrocks/commit/08d6099001bbfff830963584598da3d6a3eac66c))
- **nx-micronaut:** add `skipFormat` to control code formatting ([bbc0df2](https://github.com/tinesoft/nxrocks/commit/bbc0df241ca8bd6f09a99d71fa5b73d610cedb10))
- **nx-micronaut:** add install executor + make build depend on it ([10ab5b7](https://github.com/tinesoft/nxrocks/commit/10ab5b7e843d740cf1575ca967fba9356dfc6344))
- **nx-micronaut:** make `build` executor results cacheable ([d116760](https://github.com/tinesoft/nxrocks/commit/d116760d34ec5402a1911f6d06af235c0fbf24b3))
- **nx-micronaut:** rename executors to use `kebab-case` ([7bfc305](https://github.com/tinesoft/nxrocks/commit/7bfc305ace8fc8e38a6d5732049a6b435223b10e))
- **nx-micronaut:** unselect by default adding code formatting support ([cb52710](https://github.com/tinesoft/nxrocks/commit/cb527103af9c3ed27aa063f49a4c0907e16bee1c))

### BREAKING CHANGES

- **nx-micronaut:** `format-check` executor was renamed into `check-format` and `do-fomat` was removed
- **nx-micronaut:** All executors of this plugin now use `kebab-case` over `camelCase` for consistency

This only affects `aotSampleConfig` executor, which has been renamed into `aot-sample-config`.

- Nx v12.6.x is now the minimum version required to use the plugins

This is due to breaking changes in DevKit's project graph API starting from v12.6.x
