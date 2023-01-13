
# nx-micronaut

[![npm version](https://img.shields.io/npm/v/@nxrocks/nx-micronaut?style=flat-square)](https://www.npmjs.com/package/@nxrocks/nx-micronaut)
[![github action - release](https://img.shields.io/github/actions/workflow/status/tinesoft/nxrocks/release.yml?label=release&style=flat-square)](https://github.com/tinesoft/nxrocks/actions?query=workflow%3ARelease)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)

> Nx Plugin to generate, run, package, build (and more) [Micronaut](https://micronaut.io) projects inside your Nx workspace

<p align="center"><img src="https://raw.githubusercontent.com/tinesoft/nxrocks/develop/images/nx-micronaut.png" width="450"></p>

## Contents

- [Features](#features)
- [Prerequisite](#prerequisite)
- [Getting Started](#getting-started)
- [Plugin Usage](#plugin-usage)
- [Compatibility with Nx](#compatibility-with-nx)

## Features

Here is a list of some of the coolest features of the plugin:

- ✅ Generation of Micronaut applications based on **Micronaut Launch** API
- ✅ Building, packaging, testing, etc your Micronaut projects
- ✅ Code formatting using the excellent [**Spotless**](https://github.com/diffplug/spotless) plugin for Maven or Gradle
- ✅ Support for corporate proxies (either via `--proxyUrl` or by defining environment variable `http_proxy`, `HTTP_PROXY`, `https_proxy` or `HTTPS_PROXY`)
- ✅ Integration with Nx's **dependency graph** (through `nx dep-graph` or `nx affected:dep-graph`): this allows you to **visualize** the dependencies of any Micronaut's `Maven`/`Gradle` applications or libraries inside your workspace, just like Nx natively does it for JS/TS-based projects!
- ...

## Prerequisite

If you have not already, [create an Nx workspace](https://nx.dev/getting-started/nx-setup) with the following:

```
# npm
npx create-nx-workspace@latest

# yarn
yarn create nx-workspace 
```

## Getting Started

Then you need to install the plugin in order to generate Micronaut applications later on.

### Installing Plugin

```
# npm
npm install @nxrocks/nx-micronaut --save-dev

# yarn
yarn add @nxrocks/nx-micronaut --dev
```

### Generating Project (`new` generator)

Simply run the `new` generator with the following command:

```
nx g @nxrocks/nx-micronaut:new <your-app-name>
```

> you can also use the following aliases to call the generator: `proj`, `new`, `gen`, `init`, `create`, or `generate`

You will be prompted for entering the most commonly customized generation options (like project's `groupId`, `artifactId`, `packaging`, `dependencies`, etc).

To skip the interactive prompt, or if you want to customize all non-prompted options, you can pass them along directly when running the command, as such:

```
nx g @nxrocks/nx-micronaut:new <your-app-name> --optionName1 optionValue1 ... --optionNameN optionValueN
```

#### Generation Options

Here the list of available generation options :

| Arguments | Description              |
| --------- | ------------------------ |
| `<name>`  | The name of your project.|

Option                 | Value | Description
---------------------- | ----- | ------------
`type`                 | `default` \| `cli` \| `function` \| `grpc` \| `messaging`  | Type of application to generate
`buildSystem`          | `MAVEN` \| `GRADLE` \| `GRADLE_KOTLIN`  | Build system
`basePackage`          | `string` | Base package of the project
`javaVersion`          | `JDK_8` \| `JDK_11` \| `JDK_17`| Java version to use
`language`             | `JAVA` \| `GROOVY` \| `KOTLIN`      | Language to use
`testFramework`        | `JUNIT` \| `SPOCK` \| `KOTEST`      | Test Framework to use
`skipFormat`           | `boolean` | Do not add the ability to format code (using Spotless plugin)
`features`             | `string` | List of features to use (comma-separated). Go to https://micronaut.io/launch to get the ids needed here
`micronautVersion`     | `current` \| `snapshot` \| `previous`  |Micronaut version to use
`micronautLaunchUrl`   | `https://launch.micronaut.io`            | URL to the Micronaut Launch instance to use
`proxyUrl`             |          | The URL of the (corporate) proxy server to use to access Micronaut Launch
`tags`                 | `string` | Tags to use for linting (comma-separated)
`directory`            | `string` | Directory where the project is placed

 > **Note:** If you are working behind a corporate proxy, you can use the `proxyUrl` option to specify the URL of that corporate proxy server.
> Otherwise, you'll get a [ETIMEDOUT error](https://github.com/tinesoft/nxrocks/issues/125) when trying to access official Micronaut Launch to generate the project.
> Even simpler, you can just define environment variable `http_proxy`, `HTTP_PROXY`, `https_proxy` or `HTTPS_PROXY` globally.

### Linking Projects (`link` generator)

This generator is used to link a Micronaut project inside the workspace (the *source* project) with another project (the _*target* project), by adding the source project as an **implicit dependency** of the later.

Simply run the `link` generator with the following command:

```
nx g @nxrocks/nx-micronaut:link
```

> you can also use the following aliases to call the generator: `link-project`

You will be prompted for entering the most commonly customized generation options (`sourceProjectName`, `targetProjectName`).

To skip the interactive prompt, you can pass options along directly when running the command, as such:

```
nx g @nxrocks/nx-micronaut:link --sourceProjectName <your-micronaut-app> --targetProjectName <your-other-app>
```

or even simpler:

```
nx g @nxrocks/nx-micronaut:link  <your-micronaut-app>  <your-other-app>
```


#### Generation Options

Here the list of available generation options :

| Arguments | Description              |
| --------- | ------------------------ |
| `<sourceProjectName>`  | The name of the source(Micronaut) project to link from. 1st argument of the `link` generator. Can also be provided as option `--sourceProjectName`|
| `<targetProjectName>`  | The name of the target project to link to. 2nd argument of the `link` generator. Can also be provided as option `--targetProjectName`|

## Plugin Usage

Once your app is generated, you can now use buidlers to manage it.

Here the list of available executors:

| Executor         | Arguments                                  | Description                                |
| --------------- | ------------------------------------------ | ------------------------------------------ |
| `run` \| `dev` \| `serve`| `ignoreWrapper:boolean`, `args: string[]`  | Runs the project in dev mode using either `./mvnw\|mvn micronaut:dev` or `./gradlew\|gradle micronautDev` |
| `dockerfile`    | `ignoreWrapper:boolean`, `args: string[]`  | Generates a `Dockerfile` depending on the `packaging` and `micronaut.runtime properties` using either `./mvnw\|mvn micronaut:dockerfile` or `./gradlew\|gradle dockerfile` |
| `build`         | `ignoreWrapper:boolean`, `args: string[]`  | Packages the project using either `./mvnw\|mvn package` or `./gradlew\|gradle build` |
| `install`       | `ignoreWrapper:boolean`, `args: string[]`  | Installs the project's artifacts to local Maven repository (in `~/.m2/repository`) using either `./mvnw\|mvn install` or `./gradlew\|gradle publishToMavenLocal` |
| `test`          | `ignoreWrapper:boolean`, `args: string[]`  | Tests the project using either `./mvnw\|mvn test` or `./gradlew\|gradle test` |
| `clean`         | `ignoreWrapper:boolean`, `args: string[]`  | Cleans the project using either `./mvnw\|mvn clean` or `./gradlew\|gradle clean` |
| `format`        | `ignoreWrapper:boolean`, `args: string[]`  | Format the project using [Spotless](https://github.com/diffplug/spotless) plugin for Maven or Gradle |
| `aotConfigSample` | `ignoreWrapper:boolean`, `args: string[]`  | Generates a sample `aot.properties` using either `./mvnw\|mvn package` or `./gradlew\|gradle package` |

In order to execute the requested command, each executor will use, by default, the embedded `./mvnw` or `./gradlew` executable, that was generated alongside the project.
If you want to rely on a globally installed `mvn` or `gradle` executable instead, add the `--ignoreWrapper` option to bypass it.
This can be useful in a CI environment for example, or in a restricted environment where the binary cannot be downloaded (due to proxy/firewall limitations).


You can pass in additional arguments to the underlying Gradle or Maven, either temporarily (via `--args="..."`). For example:
```
nx run your-micronaut-app --args="-Dpackaging=docker-native"
```

Or, permanently by editing the related executor in the `workspace.json` file, as such:
```js
{
  "version": 1,
  "projects": {
    "your-micronaut-app": {
      "projectType": "application",
      "root": "apps/your-micronaut-app",
      "sourceRoot": "apps/your-micronaut-app/src",
      "targets": {
        "dockerfile": {
          "executor": "@nxrocks/nx-micronaut:dockerfile",
          "options": {
            "root": "apps/your-micronaut-app",
            "args": ["-Dpackaging=docker-native"]// your additional args here
          }
        }
      }
    }},
  "cli": {
    "defaultCollection": "@nrwl/workspace"
  }
}
```

### Running the project in dev mode - (`run` or `dev` or `serve` Executors)

```
nx run your-micronaut-app:run

// or
nx serve your-micronaut-app
```

### Building the aplication -  (`build` Executor)

```
nx build your-micronaut-app
```

> **Note:** a task dependency to `install` executor of dependent (library) projects [is added by the plugin](https://github.com/tinesoft/nxrocks/commit/10ab5b7e843d740cf1575ca967fba9356dfc6344), so that Nx will automatically `install` dependent artifacts to your local Maven repository, prior to running this command. This is particulaly useful, when for example, you have a Spring Boot **application** that depends on another Spring boot **library** in the workspace. No more need to install the library yourself first!


### Install the project's artifacts to local Maven repository (in `~/.m2/repository`) -  (`install` Executor)

```
nx install your-quarkus-app
```

### Generating the project dockerfile - (`dockerfile` Executor)

```
nx dockerfile your-micronaut-app"
```

### Generating a sample AOT config file - (`aot-sample-config` Executor)

```
nx aot-sample-config your-micronaut-app"
```

### Testing the project -  (`test` Executor)

```
nx test your-micronaut-app
```

### Cleaning the project -  (`clean` Executor)

```
nx clean your-micronaut-app
```

### Formatting the code -  (`format` Executor)

```
nx run your-micronaut-app:format

// or simply

nx apply-format your-micronaut-app

```

> Note: You *cannot** use the shorter `nx format your-boot-app` syntax here, because that would conflict with the native `format` command from Nx CLI.

## Compatibility with Nx

Every Nx plugin relies on the underlying Nx Workspace/DevKit it runs on. This table provides the compatibility matrix between major versions of Nx workspace and this plugin.

| Plugin Version | Nx Workspace version
| -------------- | --------------------
| `>=v2.x.x`     | `>=v15.x.x`
| `>=v1.x.x`     | `>=v13.8.x`

## License

Copyright (c) 2022-present Tine Kondo. Licensed under the MIT License (MIT)
