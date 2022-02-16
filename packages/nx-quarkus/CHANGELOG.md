# [@nxrocks/nx-quarkus-v2.1.2](https://github.com/tinesoft/nxrocks/compare/nx-quarkus/v2.1.1...nx-quarkus/v2.1.2) (2022-02-16)

### Bug Fixes

- wrong `@nxrocks/common` version referenced in dependent packages ([1b4b0e6](https://github.com/tinesoft/nxrocks/commit/1b4b0e6b1df604177585e703e092cf3652ef86b0))

# [@nxrocks/nx-quarkus-v2.1.1](https://github.com/tinesoft/nxrocks/compare/nx-quarkus/v2.1.0...nx-quarkus/v2.1.1) (2022-02-15)

### Bug Fixes

- include updated `package.json` in git when semantic releasing ([cb87139](https://github.com/tinesoft/nxrocks/commit/cb87139c95ba2f7256a8df7ff0c94410394ccb4f))

# [@nxrocks/nx-quarkus-v2.1.0](https://github.com/tinesoft/nxrocks/compare/nx-quarkus/v2.0.0...nx-quarkus/v2.1.0) (2022-02-14)

### Bug Fixes

- **nx-quarkus:** remove `ratchetFrom` from the default Spotless config ([59cb372](https://github.com/tinesoft/nxrocks/commit/59cb3728aaefcf658ef17fa4666e552b66e7d69c))

### Features

- **nx-quarkus:** add `format` executor ([89e6c4d](https://github.com/tinesoft/nxrocks/commit/89e6c4d4c6f9ab94c4c0b5da7cd56104791a83c2))
- **nx-quarkus:** add `format-check` executor to check code format ([d19f5ca](https://github.com/tinesoft/nxrocks/commit/d19f5ca5cc574dc680e515377af2a5df3576032e))
- **nx-quarkus:** add aliases for the format executor ([bcedf98](https://github.com/tinesoft/nxrocks/commit/bcedf98548ab96fedd8f9a05dace97ab3ffcc44a))

# [@nxrocks/nx-quarkus-v2.0.0](https://github.com/tinesoft/nxrocks/compare/nx-quarkus/v1.0.0...nx-quarkus/v2.0.0) (2021-08-23)

### Bug Fixes

- **nx-quarkus:** add plugin to `nx.json` only if not included already ([a964652](https://github.com/tinesoft/nxrocks/commit/a964652ea79290f6095b481de61ebb398d29831c))
- correct `TypeError: builder.getProjectGraph is not a function` ([3458f66](https://github.com/tinesoft/nxrocks/commit/3458f668f6f3420140fef25f908b08c26511f433)), closes [#72](https://github.com/tinesoft/nxrocks/issues/72)

### Features

- **nx-quarkus:** improve detection of quarkus projects in the workspace ([ee4731d](https://github.com/tinesoft/nxrocks/commit/ee4731d14f352ebec5a12a6e3face14282a4cec3))
- **nx-quarkus:** use `NX_VERBOSE_LOGGING` to control logs in dep graph ([5eaa639](https://github.com/tinesoft/nxrocks/commit/5eaa63992db1454d678b9220a63f751b049b882b))

### BREAKING CHANGES

- Nx v12.6.x is now the minimum version required to use the plugins

This is due to breaking changes in DevKit's project graph API starting from v12.6.x

# @nxrocks/nx-quarkus-v1.0.0 (2021-05-18)

### Features

- **nx-quarkus:** add plugin to integrate `Quarkus` inside Nx workspace ([2f7c6c0](https://github.com/tinesoft/nxrocks/commit/2f7c6c0537629027ebffce3173df2cc6278ca29d))