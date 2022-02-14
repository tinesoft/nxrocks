# nx-spring-boot
[![npm version](https://img.shields.io/npm/v/@nxrocks/nx-spring-boot?style=flat-square)](https://www.npmjs.com/package/@nxrocks/nx-spring-boot)
[![github action - release](https://img.shields.io/github/workflow/status/tinesoft/nxrocks/Release?label=release&style=flat-square)](https://github.com/tinesoft/nxrocks/actions?query=workflow%3ARelease)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)

> Nx Plugin to generate, run, package, build (and more) [Spring Boot](https://spring.io/projects/spring-boot) projects inside your Nx workspace

<p align="center"><img src="https://raw.githubusercontent.com/tinesoft/nxrocks/develop/images/nx-spring-boot.png" width="450"></p>

## Contents

- [Features](#features)
- [Prerequisite](#prerequisite)
- [Getting Started](#getting-started)
- [Plugin Usage](#plugin-usage)
- [Compatibility with Nx](#compatibility-with-nx)

## Features

Here is a list of some of the coolest features of the plugin:

- ✅ Generation of Spring Boot applications/libraries based on **Spring Initializr** API
- ✅ Building, packaging, testing, etc your Spring Boot projects
- ✅ Code formatting using the excellent [**Spotless**](https://github.com/diffplug/spotless) plugin for Maven or Gradle
- ✅ Integration with Nx's **dependency graph** (through `nx dep-graph` or `nx affected:dep-graph`): this allows you to **visualize** the dependencies of any Spring Boot's `Maven`/`Gradle` applications or libraries inside your workspace, just like Nx natively does it for JS/TS-based projects!

  ![Nx Spring Boot dependency graph](https://raw.githubusercontent.com/tinesoft/nxrocks/develop/images/nx-spring-boot-dep-graph.png)
  *Example of running the `nx dep-graph` command on a workspace with 2 Spring Boot projects inside*

- ...

## Prerequisite

If you have not already, [create an Nx workspace](https://github.com/nrwl/nx#creating-an-nx-workspace) with the following:

```
# npm
npx create-nx-workspace@latest

# yarn
yarn create nx-workspace@latest
```

## Getting Started

Then you need to install the plugin in order to generate Spring Boot applications later on.

### Installing Plugin

```
# npm
npm install @nxrocks/nx-spring-boot --save-dev

# yarn
yarn add @nxrocks/nx-spring-boot --dev
```

### Generating Project

Simply run the `project` generator with the following command:

```
nx g @nxrocks/nx-spring-boot:new <your-app-name>
```

> you can also use the following aliases to call the generator: `proj`, `new`, `gen`, `init`, `create`, or `generate`

You will be prompted for entering the most commonly customized generation options (like project's `groupId`, `artifactId`, `packaging`, `dependencies`, etc).

To skip the interactive prompt, or if you want to customize all non-prompted options, you can pass them along directly when running the command, as such:

```
nx g @nxrocks/nx-spring-boot:project <your-app-name> --optionName1 optionValue1 ... --optionNameN optionValueN
```

#### Generation Options

Here the list of available generation options :

| Arguments | Description              |
| --------- | ------------------------ |
| `<name>`  | The name of your project.|

Option                 | Value | Description
---------------------- | ----- | ------------
`projectType`          | `application` \| `library`  | Type of project to generate
`buildSystem`          | `maven-project` \| `gradle-project`  | Build system
`packaging`            | `jar` \| `war` | Packaging to use
`javaVersion`          | `8` \| `11` \| `15`| Java version to use
`language`             | `java` \| `groovy` \| `kotlin`      | Language to use
`groupId`              | `string` | GroupId of the project
`artifactId`           | `string` | ArtifactId of the project
`packageName`          | `string` | Main package name
`description`          | `string` | Description of the project
`dependencies`         | `string` | List of dependencies to use (comma-separated). Go to https://start.spring.io/dependencies to get the ids needed here
`springInitializerUrl` | `https://start.spring.io`            | URL to the Spring Initializer instance to use
`bootVersion`          | `string` | Spring Boot version to use
`tags`                 | `string` | Tags to use for linting (comma-separated)
`directory`            | `string` | Directory where the project is placed

## Plugin Usage

Once your app is generated, you can now use buidlers to manage it.

Here the list of available executors:

| Executor        | Arguments                                  | Description                                |
| --------------- | ------------------------------------------ | ------------------------------------------ |
| `run` \| `serve`<sup>*</sup>| `ignoreWrapper:boolean`, `args: string[]`  | Runs the project using either `./mvnw\|mvn spring-boot:run` or `./gradlew\|gradle bootRun` |
| `test`          | `ignoreWrapper:boolean`, `args: string[]`  | Tests the project using either `./mvnw\|mvn test` or `./gradlew\|gradle test` |
| `clean`          | `ignoreWrapper:boolean`, `args: string[]`  | Cleans the project using either `./mvnw\|mvn clean` or `./gradlew\|gradle clean` |
| `format`         | `ignoreWrapper:boolean`, `args: string[]`  | Format the project using [Spotless](https://github.com/diffplug/spotless) plugin for Maven or Gradle |
| `format-check`         | `ignoreWrapper:boolean`, `args: string[]`  | Check whether the project is well formatted using [Spotless](https://github.com/diffplug/spotless) plugin for Maven or Gradle |
| `build`          | `ignoreWrapper:boolean`, `args: string[]`  | Packages the project into an executable Jar using either `./mvnw\|mvn package` or `./gradlew\|gradle build` |
| `buildInfo`<sup>*</sup>     | `ignoreWrapper:boolean`,                   | Generates a `build-info.properties` using either `./mvnw\|mvn spring-boot:build-info` or `./gradlew\|gradle bootBuildInfo` |
| `buildImage`<sup>*</sup>    | `ignoreWrapper:boolean`, `args: string[]`  | Generates an [OCI Image](https://github.com/opencontainers/image-spec) using either `./mvnw\|mvn spring-boot:build-image` or `./gradlew\|gradle bootBuildImage` |

In order to execute the requested command, each executor will use, by default, the embedded `./mvnw` or `./gradlew` executable, that was generated alongside the project.
If you want to rely on a globally installed `mvn` or `gradle` executable instead, add the `--ignoreWrapper` option to bypass it.
This can be useful in a CI environment for example, or in a restricted environment where the binary cannot be downloaded (due to proxy/firewall limitations).

### Running the project - ('run' or 'serve' Executors)

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
    "defaultCollection": "@nrwl/workspace"
  }
}
```

### Building the Jar or War -  ('build' Executor)

```
nx build your-boot-app
```

### Building the OCI Image -  ('buildImage' Executor)

```
nx buildImage your-boot-app
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
        "buildImage": {
          "executor": "@nxrocks/nx-spring-boot:buildImage",
          "options": {
            "root": "apps/you-boot-app",
            "args": ["--executor=gcr.io/paketo-buildpacks/executor:base-platform-api-0.3", "--runImage=my-image"]
          }
        }
      }
    }},
  "cli": {
    "defaultCollection": "@nrwl/workspace"
  }
}
```

### Testing the project -  ('test' Executor)

```
nx test your-boot-app
```

### Cleaning the project -  ('clean' Executor)

```
nx clean your-boot-app
```

### Formatting the project -  ('format' Executor)

```
nx run your-boot-app:format
```

### Checking the format the project -  ('format-check' Executor)

```
nx check-format your-boot-app

or

nx format-check your-boot-app
```

## Compatibility with Nx

Every Nx plugin relies on the underlying Nx Workspace/DevKit it runs on. This table provides the compatibility matrix between major versions of Nx workspace and this plugin.

| Plugin Version | Nx Workspace version
| -------------- | --------------------
| `>=v3.x.x`     | `>=v12.6.x`
| `>=v2.x.x`     | `>=v11.x.x`
| `<=v1.3.1`     | `<=v10.x.x`
## License

Copyright (c) 2020-2021 Tine Kondo. Licensed under the MIT License (MIT)
