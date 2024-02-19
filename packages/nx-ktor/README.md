# nx-ktor

[![npm version](https://img.shields.io/npm/v/@nxrocks/nx-ktor?style=flat-square)](https://www.npmjs.com/package/@nxrocks/nx-ktor)
[![github action - release](https://img.shields.io/github/actions/workflow/status/tinesoft/nxrocks/release.yml?label=release&style=flat-square)](https://github.com/tinesoft/nxrocks/actions?query=workflow%3ARelease)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)

> Nx Plugin to generate, run, package, build (and more) [Ktor](https://ktor.io) projects inside your Nx workspace

<p align="center"><img src="https://raw.githubusercontent.com/tinesoft/nxrocks/develop/images/nx-ktor.png" width="450"></p>

## Contents

- [Features](#features)
- [Setup](#setup)
- [Generators](#generators)
- [Executors](#executors)
- [Compatibility with Nx](#compatibility-with-nx)

## Features

Here is a list of some of the coolest features of the plugin:

- ✅ Generation of Ktor applications based on **Ktor Starter** API
- ✅ Building, packaging, testing, etc your Ktor projects
- ✅ 🆕 Built-in support for creating [**multi-modules**](recipes/README.md#creating-multi-modules-ktor-projects) Spring Boot projects with both `Maven` and `Gradle`
- ✅ Built-in support for code formatting using the excellent [**Spotless**](https://github.com/diffplug/spotless) plugin for `Maven` or `Gradle`
- ✅ Built-in support for **corporate proxies** (either via `--proxyUrl` or by defining environment variable `http_proxy`, `HTTP_PROXY`, `https_proxy` or `HTTPS_PROXY`)
- ✅ Integration with Nx's **dependency graph** (through `nx graph` or `nx affected:graph`): this allows you to **visualize** the dependencies of any Ktor's `Maven`/`Gradle` applications or libraries inside your workspace, just like Nx natively does it for JS/TS-based projects!
- ...

## Setup

<details open>
<summary>📢 ℹ️ 🆕 <b>HEADS UP!</b> New <b>simplified</b> setup since <i>October 2023</i>, with our custom <b>CLI</b>!</summary>


> You can now use our own `create-nx-ktor` **CLI** to easily create a Nx workspace, that comes with this plugin pre-installed!
> 
> Simply run:
> 
> ```
> # npm
> npx create-nx-ktor@latest
> # or
> # yarn
> yarn create nx-ktor
> ```
> 
> and you are good to go‧o‧o‧o! 🚀
> 
> More information here: [create-nx-ktor](../packages/create-nx-ktor/README.md)

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

Then you need to install the plugin in order to generate Ktor applications later on.

```
# npm
npm install @nxrocks/nx-ktor --save-dev

# yarn
yarn add @nxrocks/nx-ktor --dev
```

## Generators

This plugin is composed of 2 main **generators**:

- `project` generator
- `link` generator

### Generating Project (`project` generator)

Simply run the `project` generator with the following command:

```
nx g @nxrocks/nx-ktor:project <your-app-name>
```

> you can also use the following aliases to call the generator: `proj`, `new`, or `create`

You will be prompted for entering the most commonly customized generation options (like project's `groupId`, `artifactId`, `features`, etc).

To skip the interactive prompt, or if you want to customize all non-prompted options, you can pass them along directly when running the command, as such:

```
nx g @nxrocks/nx-ktor:project <your-app-name> --optionName1 optionValue1 ... --optionNameN optionValueN
```

#### Generation Options

Here the list of available generation options :

| Arguments | Description               |
| --------- | ------------------------- |
| `<name>`  | The name of your project. |

| Option                     | Value                                   | Description                                                                                        |
| -------------------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `buildSystem`              | `MAVEN` \| `GRADLE` \| `GRADLE_KTS`     | Build system                                                                                       |
| `groupId`                  | `string`                                | Group Id of the project                                                                            |
| `artifactId`               | `string`                                | Artifact Id of the project                                                                         |
| `kotlinVersion`            | `string`                                | Kotlin version to use                                                                              |
| `engine`                   | `NETTY` \| `JETTY` \| `CIO` \| `TOMCAT` | Engine to use to serve the application                                                             |
| `configurationLocation`    | `YAML` \| `HOCON` \| `CODE`             | Configuratin Location to use                                                                       |
| `skipFormat`               | `boolean`                               | Do not add the ability to format code (using Spotless plugin)                                      |
| `skipCodeSamples`          | `boolean`                               | Do not generate code samples                                                                       |
| `features`                 | `string`                                | List of features to use (comma-separated). Go to [recipes](recipes/README.md) for more information |
| `transformIntoMultiModule` | `boolean`                               | Transform the project into a multi-module project. Go to [recipes](recipes/README.md#creating-multi-modules-ktor-projects) for more information               |
| `addToExistingParentModule`| `boolean`                               | Add the project into an existing parent module project. Go to [recipes](recipes/README.md#creating-multi-modules-ktor-projects) for more information               |
| `parentModuleName`         | `string`                                | Name of the parent module to create or to add child project into. Go to [recipes](recipes/README.md#creating-multi-modules-ktor-projects) for more information               |
| `keepProjectLevelWrapper`  | `boolean`                               | Keep the `Maven` or `Gradle` wrapper files from child project (when generating a multi-module project). Go to [recipes](recipes/README.md#creating-multi-modules-ktor-projects) for more information               |
| `ktorVersion`              | `string`                                | Ktor version to use                                                                                |
| `ktorInitializrUrl`        | `https://start.ktor.io`                 | URL to the Ktor Start instance to use                                                              |
| `proxyUrl`                 | `string`                                | The URL of the (corporate) proxy server to use to access Ktor Launch                               |
| `tags`                     | `string`                                | Tags to use for linting (comma-separated)                                                          |
| `directory`                | `string`                                | Directory where the project is placed                                                              |

> **Note:** If you are working behind a corporate proxy, you can use the `proxyUrl` option to specify the URL of that corporate proxy server.
> Otherwise, you'll get a [ETIMEDOUT error](https://github.com/tinesoft/nxrocks/issues/125) when trying to access official Ktor Launch to generate the project.
> Even simpler, you can just define environment variable `http_proxy`, `HTTP_PROXY`, `https_proxy` or `HTTPS_PROXY` globally.

### Linking Projects (`link` generator)

This generator is used to link a Ktor project inside the workspace (the _source_ project) with another project (the \__target_ project), by adding the source project as an **implicit dependency** of the later.

Simply run the `link` generator with the following command:

```
nx g @nxrocks/nx-ktor:link
```

> you can also use the following aliases to call the generator: `link-project`

You will be prompted for entering the most commonly customized generation options (`sourceProjectName`, `targetProjectName`).

To skip the interactive prompt, you can pass options along directly when running the command, as such:

```
nx g @nxrocks/nx-ktor:link --sourceProjectName <your-ktor-app> --targetProjectName <your-other-app>
```

or even simpler:

```
nx g @nxrocks/nx-ktor:link  <your-ktor-app>  <your-other-app>
```

#### Generation Options

Here the list of available generation options :

| Arguments             | Description                                                                                                                                   |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `<sourceProjectName>` | The name of the source(Ktor) project to link from. 1st argument of the `link` generator. Can also be provided as option `--sourceProjectName` |
| `<targetProjectName>` | The name of the target project to link to. 2nd argument of the `link` generator. Can also be provided as option `--targetProjectName`         |

## Executors

Once your app is generated, you can now use **executors** to manage it.

Here the list of available executors:

| Executor                     | Arguments                                                                | Description                                                                                                                                                         |
| ---------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `run` \| `serve`             | `ignoreWrapper:boolean`, `runFromParentModule:boolean`, `args: string[]` | Runs the project in dev mode using either `./mvnw\|mvn exec:java` or `./gradlew\|gradle runFatJar`                                                                  |
| `build`                      | `ignoreWrapper:boolean`, `runFromParentModule:boolean`, `args: string[]` | Packages the project using either `./mvnw\|mvn package` or `./gradlew\|gradle buildFatJar`                                                                          |
| `install`                    | `ignoreWrapper:boolean`, `runFromParentModule:boolean`, `args: string[]` | Installs the project's artifacts to local Maven repository (in `~/.m2/repository`) using either `./mvnw\|mvn install` or `./gradlew\|gradle publishToMavenLocal`    |
| `test`                       | `ignoreWrapper:boolean`, `runFromParentModule:boolean`, `args: string[]` | Tests the project using either `./mvnw\|mvn test` or `./gradlew\|gradle test`                                                                                       |
| `clean`                      | `ignoreWrapper:boolean`, `runFromParentModule:boolean`, `args: string[]` | Cleans the project using either `./mvnw\|mvn clean` or `./gradlew\|gradle clean`                                                                                    |
| `format`                     | `ignoreWrapper:boolean`, `runFromParentModule:boolean`, `args: string[]` | Format the project using [Spotless](https://github.com/diffplug/spotless) plugin for Maven or Gradle                                                                |
| `build-image`                | `ignoreWrapper:boolean`, `runFromParentModule:boolean`, `args: string[]` | Generates an [OCI Image](https://github.com/opencontainers/image-spec) using either `./mvnw\|mvn docker:build` or `./gradlew\|gradle buildImage`                    |
| `publish-image`<sup>\*</sup> | `ignoreWrapper:boolean`, `runFromParentModule:boolean`, `args: string[]` | Builds the project into a Docker image and publishes it to an external registry using either `./mvnw\|mvn docker:push` or `./gradlew\|gradle publishImage`          |
| `publish-image-locally`      | `ignoreWrapper:boolean`, `runFromParentModule:boolean`, `args: string[]` | Builds the project into a Docker image and publishes it to local registry using either `./mvnw\|mvn docker:push` or `./gradlew\|gradle publishImageToLocalRegistry` |
| `run-docker`                 | `ignoreWrapper:boolean`, `runFromParentModule:boolean`, `args: string[]` | Builds the project into a Docker image and runs it using either `./mvnw\|mvn docker:run` or `./gradlew\|gradle rundDocker`                                          |

> <sup>\*</sup> Additonal configuration is needed to configure Docker external registry (for [Gradle-based](https://github.com/ktorio/ktor-build-plugins#dockerize-your-application) projects, for [Maven-based](https://dmp.fabric8.io/#docker:push) projects)

In order to execute the requested command, each executor will use, by default, the embedded `./mvnw` or `./gradlew` executable, that was generated alongside the project.
If you want to rely on a globally installed `mvn` or `gradle` executable instead, add the `--ignoreWrapper` option to bypass it.
This can be useful in a CI environment for example, or in a restricted environment where the binary cannot be downloaded (due to proxy/firewall limitations).

You can pass in additional arguments to the underlying Gradle or Maven, either temporarily (via `--args="..."`). For example:

```
nx run your-ktor-app --args="-Dpackaging=docker-native"
```

Or, permanently by editing the related executor in the `workspace.json` file, as such:

```js
{
  "version": 1,
  "projects": {
    "your-ktor-app": {
      "projectType": "application",
      "root": "apps/your-ktor-app",
      "sourceRoot": "apps/your-ktor-app/src",
      "targets": {
        "dockerfile": {
          "executor": "@nxrocks/nx-ktor:run-docker",
          "options": {
            "root": "apps/your-ktor-app",
            "args": ["-Dpackaging=docker-native"]// your additional args here
          }
        }
      }
    }},
  "cli": {
    "defaultCollection": "@nx/workspace"
  }
}
```

### Running the project in dev mode - (`run` or `serve` Executors)

```
nx run your-ktor-app:run

// or
nx serve your-ktor-app
```

### Building the aplication - (`build` Executor)

```
nx build your-ktor-app
```

> **Note:** a task dependency to `install` executor of dependent (library) projects is added by the plugin, so that Nx will automatically `install` dependent artifacts to your local Maven repository, prior to running this command. This is particulaly useful, when for example, you have a Spring Boot **application** that depends on another Spring ktor **library** in the workspace. No more need to install the library yourself first!

### Install the project's artifacts to local Maven repository (in `~/.m2/repository`) - (`install` Executor)

```
nx install your-ktor-app
```

### Building the Docker Image - (`build-image` Executor)

```
nx build-image your-ktor-app"
```

### Publishing the Docker Image - (`publish-image` Executor)

```
nx publish-image your-ktor-app"
```

> **Note:** a task dependency to `build-image` executor is automatically added by the plugin, so that Nx will automatically run `build-image` prior to running this command.

### Publishing the Docker Image locally - (`publish-image-locally` Executor)

```
nx publish-image-locally your-ktor-app"
```

> **Note:** a task dependency to `build-image` executor is automatically added by the plugin, so that Nx will automatically run `build-image` prior to running this command.

### Running the application from inside the Docker Image - (`run-docker` Executor)

```
nx rund-docker your-ktor-app"
```

> **Note:** a task dependency to `build-image` executor is automatically added by the plugin, so that Nx will automatically run `build-image` prior to running this command.

### Testing the project - (`test` Executor)

```
nx test your-ktor-app
```

### Cleaning the project - (`clean` Executor)

```
nx clean your-ktor-app
```

### Formatting the code - (`format` Executor)

```
nx run your-ktor-app:format

// or simply

nx apply-format your-ktor-app

```

> Note: You \*cannot\*\* use the shorter `nx format your-ktor-app` syntax here, because that would conflict with the native `format` command from Nx CLI.

## Compatibility with Nx

Every Nx plugin relies on the underlying Nx Workspace/DevKit it runs on. This table provides the compatibility matrix between major versions of Nx workspace and this plugin.

| Plugin Version | Nx Workspace version |
| -------------- | -------------------- |
| `>=v3.x.x`     | `>=v17.x.x`          |
| `>=v2.x.x`     | `>=v16.x.x`          |
| `>=v1.x.x`     | `>=v15.8.x`          |

## License

Copyright (c) 2023-present Tine Kondo. Licensed under the MIT License (MIT)
