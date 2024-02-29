# nx-spring-boot

[![npm version](https://img.shields.io/npm/v/@nxrocks/nx-spring-boot?style=flat-square)](https://www.npmjs.com/package/@nxrocks/nx-spring-boot)
[![github action - release](https://img.shields.io/github/actions/workflow/status/tinesoft/nxrocks/release.yml?label=release&style=flat-square)](https://github.com/tinesoft/nxrocks/actions?query=workflow%3ARelease)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)

> Nx Plugin to generate, run, package, build (and more) [Spring Boot](https://spring.io/projects/spring-boot) projects inside your Nx workspace

<p align="center"><img src="https://raw.githubusercontent.com/tinesoft/nxrocks/develop/images/nx-spring-boot.png" width="450"></p>

## Contents

- [Features](#features)
- [Setup](#setup)
- [Generators](#generators)
- [Executors](#executors)
- [Compatibility with Nx](#compatibility-with-nx)

## Features

Here is a list of some of the coolest features of the plugin:

- ✅ Generation of Spring Boot applications/libraries based on **Spring Initializr** API
- ✅ Building, packaging, testing, etc your Spring Boot projects
- ✅ 🆕 Built-in support for creating [**multi-modules**](recipes/README.md#creating-multi-modules-spring-boot-projects) Spring Boot projects with both `Maven` and `Gradle`
- ✅ Built-in support for code formatting using the excellent [**Spotless**](https://github.com/diffplug/spotless) plugin for `Maven` or `Gradle`
- ✅ Built-in support for **corporate proxies** (either via `--proxyUrl` or by defining environment variable `http_proxy`, `HTTP_PROXY`, `https_proxy` or `HTTPS_PROXY`)
- ✅ Integration with Nx's **dependency graph** (through `nx graph` or `nx affected:graph`): this allows you to **visualize** the dependencies of any Spring Boot's `Maven`/`Gradle` applications or libraries inside your workspace, just like Nx natively does it for JS/TS-based projects!
  ![Nx Spring Boot dependency graph](https://raw.githubusercontent.com/tinesoft/nxrocks/develop/images/nx-spring-boot-dep-graph.png)
  _Example of running the `nx graph` command on a workspace with 2 Spring Boot projects inside_

- ...

## Setup

<details open>
<summary>📢 ℹ️ 🆕 <b>HEADS UP!</b> New <b>simplified</b> setup since <i>October 2023</i>, with our custom <b>CLI</b>!</summary>

> You can now use our own `create-nx-spring-boot` **CLI** to easily create a Nx workspace, that comes with this plugin pre-installed!
>
> Simply run:
>
> ```
> # npm
> npx create-nx-spring-boot@latest
> # or
> # yarn
> yarn create nx-spring-boot
> ```
>
> and you are good to go‧o‧o‧o! 🚀
>
> More information here: [create-nx-spring-boot](../packages/create-nx-spring-boot/README.md)

</details>

Otherwise, this is the traditional way of setting things up:

### 1. Creating the Nx workspace

If you have not already, [create an Nx workspace](https://nx.dev/getting-started/nx-setup) with the following:

```
# npm
npx create-nx-workspace@latest

# yarn
yarn create nx-workspace
```

### 2. Installing the Plugin

Then you need to install the plugin in order to generate Spring Boot applications later on.

```
# npm
npm install @nxrocks/nx-spring-boot --save-dev

# yarn
yarn add @nxrocks/nx-spring-boot --dev
```

## Generators

This plugin is composed of 2 main **generators**:

- `project` generator
- `link` generator

### Generating Projects (`project` generator)

Simply run the `project` generator with the following command:

```
nx g @nxrocks/nx-spring-boot:project <your-app-name>
```

> you can also use the following aliases to call the generator: `proj`, `new`, or `create`

You will be prompted for entering the most commonly customized generation options (like project's `groupId`, `artifactId`, `packaging`, `dependencies`, etc).

To skip the interactive prompt, or if you want to customize all non-prompted options, you can pass them along directly when running the command, as such:

```
nx g @nxrocks/nx-spring-boot:project <your-app-name> --optionName1 optionValue1 ... --optionNameN optionValueN
```

#### Generation Options

Here the list of available generation options :

| Arguments | Description               |
| --------- | ------------------------- |
| `<name>`  | The name of your project. |

| Option                      | Value                               | Description                                                                                                                                                                                                 |
| --------------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `projectType`               | `application` \| `library`          | Type of project to generate                                                                                                                                                                                 |
| `buildSystem`               | `maven-project` \| `gradle-project` | Build system                                                                                                                                                                                                |
| `packaging`                 | `jar` \| `war`                      | Packaging to use                                                                                                                                                                                            |
| `javaVersion`               | `8` \| `11` \| `15`                 | Java version to use                                                                                                                                                                                         |
| `language`                  | `java` \| `groovy` \| `kotlin`      | Language to use                                                                                                                                                                                             |
| `groupId`                   | `string`                            | GroupId of the project                                                                                                                                                                                      |
| `artifactId`                | `string`                            | ArtifactId of the project                                                                                                                                                                                   |
| `packageName`               | `string`                            | Main package name                                                                                                                                                                                           |
| `description`               | `string`                            | Description of the project                                                                                                                                                                                  |
| `skipFormat`                | `boolean`                           | Do not add the ability to format code (using Spotless plugin)                                                                                                                                               |
| `dependencies`              | `string`                            | List of dependencies to use (comma-separated). Go to [recipes](recipes/README.md#adding-spring-boot-dependencies) for more information                                                                      |
| `transformIntoMultiModule`  | `boolean`                           | Transform the project into a multi-module project. Go to [recipes](recipes/README.md#creating-multi-modules-spring-boot-projects) for more information                                                      |
| `addToExistingParentModule` | `boolean`                           | Add the project into an existing parent module project. Go to [recipes](recipes/README.md#creating-multi-modules-spring-boot-projects) for more information                                                 |
| `parentModuleName`          | `string`                            | Name of the parent module to create or to add child project into. Go to [recipes](recipes/README.md#creating-multi-modules-spring-boot-projects) for more information                                       |
| `keepProjectLevelWrapper`   | `boolean`                           | Keep the `Maven` or `Gradle` wrapper files from child project (when generating a multi-module project). Go to [recipes](recipes/README.md#creating-multi-modules-spring-boot-projects) for more information |
| `springInitializerUrl`      | `https://start.spring.io`           | URL to the Spring Initializer instance to use                                                                                                                                                               |
| `proxyUrl`                  |                                     | The URL of the (corporate) proxy server to use to access Spring Initializr                                                                                                                                  |
| `bootVersion`               | `string`                            | Spring Boot version to use                                                                                                                                                                                  |
| `tags`                      | `string`                            | Tags to use for linting (comma-separated)                                                                                                                                                                   |
| `directory`                 | `string`                            | Directory where the project is placed                                                                                                                                                                       |

> **Note:** If you are working behind a corporate proxy, you can use the `proxyUrl` option to specify the URL of that corporate proxy server.
> Otherwise, you'll get a [ETIMEDOUT error](https://github.com/tinesoft/nxrocks/issues/125) when trying to access official Spring Initializer to generate the project.
> Even simpler, you can just define environment variable `http_proxy`, `HTTP_PROXY`, `https_proxy` or `HTTPS_PROXY` globally.

### Linking Projects (`link` generator)

This generator is used to link a Spring Boot project inside the workspace (the _source_ project) with another project (the _target_ project), by adding the source project as an **implicit dependency** of the later.

Simply run the `link` generator with the following command:

```
nx g @nxrocks/nx-spring-boot:link
```

> you can also use the following aliases to call the generator: `link-project`

You will be prompted for entering the most commonly customized generation options (`sourceProjectName`, `targetProjectName`).

To skip the interactive prompt, you can pass options along directly when running the command, as such:

```
nx g @nxrocks/nx-spring-boot:link --sourceProjectName <your-boot-app> --targetProjectName <your-other-app>
```

or even simpler:

```
nx g @nxrocks/nx-spring-boot:link  <your-boot-app>  <your-other-app>
```

#### Generation Options

Here the list of available generation options :

| Arguments             | Description                                                                                                                                          |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `<sourceProjectName>` | The name of the source(Spring-Boot) project to link from. 1st argument of the `link` generator. Can also be provided as option `--sourceProjectName` |
| `<targetProjectName>` | The name of the target project to link to. 2nd argument of the `link` generator. Can also be provided as option `--targetProjectName`                |

## Executors

Once your app is generated, you can now use **executors** to manage it.

Here the list of available executors:

| Executor                      | Arguments                                                                | Description                                                                                                                                                      |
| ----------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `run` \| `serve`<sup>\*</sup> | `ignoreWrapper:boolean`, `runFromParentModule:boolean`, `args: string[]` | Runs the project using either `./mvnw\|mvn spring-boot:run` or `./gradlew\|gradle bootRun`                                                                       |
| `test`                        | `ignoreWrapper:boolean`, `runFromParentModule:boolean`, `args: string[]` | Tests the project using either `./mvnw\|mvn test` or `./gradlew\|gradle test`                                                                                    |
| `clean`                       | `ignoreWrapper:boolean`, `runFromParentModule:boolean`, `args: string[]` | Cleans the project using either `./mvnw\|mvn clean` or `./gradlew\|gradle clean`                                                                                 |
| `format`                      | `ignoreWrapper:boolean`, `runFromParentModule:boolean`, `args: string[]` | Format the project using [Spotless](https://github.com/diffplug/spotless) plugin for Maven or Gradle                                                             |
| `check-format`                | `ignoreWrapper:boolean`, `runFromParentModule:boolean`, `args: string[]` | Check whether the project is well formatted using [Spotless](https://github.com/diffplug/spotless) plugin for Maven or Gradle                                    |
| `build`                       | `ignoreWrapper:boolean`, `runFromParentModule:boolean`, `args: string[]` | Packages the project into an executable Jar using either `./mvnw\|mvn package` or `./gradlew\|gradle build`                                                      |
| `install`                     | `ignoreWrapper:boolean`, `runFromParentModule:boolean`, `args: string[]` | Installs the project's artifacts to local Maven repository (in `~/.m2/repository`) using either `./mvnw\|mvn install` or `./gradlew\|gradle publishToMavenLocal` |
| `build-info`<sup>\*</sup>     | `ignoreWrapper:boolean`, `runFromParentModule:boolean`, `args: string[]` | Generates a `build-info.properties` using either `./mvnw\|mvn spring-boot:build-info` or `./gradlew\|gradle bootBuildInfo`                                       |
| `build-image`<sup>\*</sup>    | `ignoreWrapper:boolean`, `runFromParentModule:boolean`, `args: string[]` | Generates an [OCI Image](https://github.com/opencontainers/image-spec) using either `./mvnw\|mvn spring-boot:build-image` or `./gradlew\|gradle bootBuildImage`  |

In order to execute the requested command, each executor will use, by default, the embedded `./mvnw` or `./gradlew` executable, that was generated alongside the project.
If you want to rely on a globally installed `mvn` or `gradle` executable instead, add the `--ignoreWrapper` option to bypass it.
This can be useful in a CI environment for example, or in a restricted environment where the binary cannot be downloaded (due to proxy/firewall limitations).

### Running the project - (`run` or `serve` Executors)

```
nx run your-boot-app:run

// or its shorter alias

nx serve your-boot-app
```

You can pass in additional arguments by editing the related section in the `workspace.json` file, as such:

```js
{
  "version": 1,
  "projects": {
    "you-boot-app": {
      "projectType": "application",
      "root": "apps/you-boot-app",
      "sourceRoot": "apps/you-boot-app/src",
      "targets": {
        "run": { // or "serve", according to your preference
          "executor": "@nxrocks/nx-spring-boot:run",// or "@nxrocks/nx-spring-boot:serve", according to your preference
          "options": {
            "root": "apps/you-boot-app",
            "args": ["arg1", "arg2"]
          }
        }
      }
    }},
  "cli": {
    "defaultCollection": "@nx/workspace"
  }
}
```

### Building the Jar or War - (`build` Executor)

```
nx build your-boot-app
```

> **Note:** a task dependency to `install` executor of dependent (library) projects [is added by the plugin](https://github.com/tinesoft/nxrocks/commit/68e1a5ef5ed266c65ee348c6ced022f87edb1fb7), so that Nx will automatically `install` dependent artifacts to your local Maven repository, prior to running this command. This is particulaly useful, when for example, you have a Spring Boot **application** that depends on another Spring boot **library** in the workspace. No more need to install the library yourself first!

### Install the project's artifacts to local Maven repository (in `~/.m2/repository`) - (`install` Executor)

```
nx install your-boot-app
```

### Building the OCI Image - (`build-image` Executor)

```
nx build-image your-boot-app
```

You can pass in additional arguments by editing the related section in the `workspace.json` file, as such:

```json
{
  "version": 1,
  "projects": {
    "you-boot-app": {
      "projectType": "application",
      "root": "apps/you-boot-app",
      "sourceRoot": "apps/you-boot-app/src",
      "targets": {
        "build-image": {
          "executor": "@nxrocks/nx-spring-boot:build-image",
          "options": {
            "root": "apps/you-boot-app",
            "args": [
              "--executor=gcr.io/paketo-buildpacks/executor:base-platform-api-0.3",
              "--runImage=my-image"
            ]
          }
        }
      }
    }
  },
  "cli": {
    "defaultCollection": "@nx/workspace"
  }
}
```

### Testing the project - (`test` Executor)

```
nx test your-boot-app
```

### Cleaning the project - (`clean` Executor)

```
nx clean your-boot-app
```

### Formatting the project - (`format` Executor)

```

nx run your-boot-app:format

// or simply

nx apply-format your-boot-app

```

> Note: You \*cannot\*\* use the shorter `nx format your-boot-app` syntax here, because that would conflict with the native `format` command from Nx CLI.

### Checking the format the project - (`check-format` Executor)

```
nx check-format your-boot-app
```

## Compatibility with Nx

Every Nx plugin relies on the underlying Nx Workspace/DevKit it runs on. This table provides the compatibility matrix between major versions of Nx workspace and this plugin.

| Plugin Version | Nx Workspace version |
| -------------- | -------------------- |
| `>=v10.x.x`    | `>=v18.x.x`          |
| `>=v9.x.x`     | `>=v17.x.x`          |
| `>=v8.x.x`     | `>=v16.x.x`          |
| `>=v7.x.x`     | `>=v15.8.x`          |
| `>=v6.x.x`     | `>=v15.x.x`          |
| `>=v4.x.x`     | `>=v13.8.x`          |
| `>=v3.x.x`     | `>=v12.6.x`          |
| `>=v2.x.x`     | `>=v11.x.x`          |
| `<=v1.3.1`     | `<=v10.x.x`          |

## License

Copyright (c) 2020-present Tine Kondo. Licensed under the MIT License (MIT)
