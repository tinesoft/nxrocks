# nx-quarkus
[![npm version](https://img.shields.io/npm/v/@nxrocks/nx-quarkus?style=flat-square)](https://www.npmjs.com/package/@nxrocks/nx-quarkus)
[![github action - release](https://img.shields.io/github/workflow/status/tinesoft/nxrocks/Release?label=release&style=flat-square)](https://github.com/tinesoft/nxrocks/actions?query=workflow%3ARelease)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)

> Nx Plugin to generate, run, package, build (and more) [Quarkus](https://quarkus.io) projects inside your Nx workspace

<p align="center"><img src="https://raw.githubusercontent.com/tinesoft/nxrocks/develop/images/nx-quarkus.png" width="450"></p>

## Contents

- [Features](#features)
- [Prerequisite](#prerequisite)
- [Getting Started](#getting-started)
- [Plugin Usage](#plugin-usage)
- [Compatibility with Nx](#compatibility-with-nx)

## Features

Here is a list of some of the coolest features of the plugin:

- ✅ Generation of Quarkus applications/libraries based on **Quarkus app generator** API
- ✅ Building, packaging, testing, etc your Quarkus projects
- ✅ Integration with Nx's **dependency graph** (through `nx dep-graph` or `nx affected:dep-graph`): this allows you to **visualize** the dependencies of any Quarkus's `Maven`/`Gradle` applications or libraries inside your workspace, just like Nx natively does it for JS/TS-based projects!

  ![Nx Quarkus dependency graph](https://raw.githubusercontent.com/tinesoft/nxrocks/develop/images/nx-quarkus-dep-graph.png)
  *Example of running the `nx dep-graph` command on a workspace with 2 Quarkus projects inside*

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

Then you need to install the plugin in order to generate Quarkus applications later on.

### Installing Plugin

```
# npm
npm install @nxrocks/nx-quarkus --save-dev

# yarn
yarn add @nxrocks/nx-quarkus --dev
```

### Generating Project

Simply run the `project` generator with the following command:

```
nx g @nxrocks/nx-quarkus:new <your-app-name>
```

> you can also use the following aliases to call the generator: `proj`, `new`, `gen`, `init`, `create`, or `generate`

You will be prompted for entering the most commonly customized generation options (like project's `groupId`, `artifactId`, `packaging`, `dependencies`, etc).

To skip the interactive prompt, or if you want to customize all non-prompted options, you can pass them along directly when running the command, as such:

```
nx g @nxrocks/nx-quarkus:project <your-app-name> --optionName1 optionValue1 ... --optionNameN optionValueN
```

#### Generation Options

Here the list of available generation options :

| Arguments | Description              |
| --------- | ------------------------ |
| `<name>`  | The name of your project.|

Option                 | Value | Description
---------------------- | ----- | ------------
`projectType`          | `application` \| `library`  | Type of project to generate
`buildSystem`          | `MAVEN` \| `GRADLE`  | Build system
`groupId`              | `string` | GroupId of the project
`artifactId`           | `string` | ArtifactId of the project
`extensions`         | `string` | List of extensions to use (comma-separated). Go to https://code.quarkus.io/api/extensions to get the ids needed here
`quarkusInitializerUrl` | `https://code.quarkus.io`            | URL to the Quarkus Initializer instance to use
`skipeCodeSamples`     | `string` | Whether or not to include code samples from extensions (when available)
`tags`                 | `string` | Tags to use for linting (comma-separated)
`directory`            | `string` | Directory where the project is placed

## Plugin Usage

Once your app is generated, you can now use buidlers to manage it.

Here the list of available executors:

| Executor         | Arguments                                  | Description                                |
| --------------- | ------------------------------------------ | ------------------------------------------ |
| `run` \| `dev` \| `serve`| `ignoreWrapper:boolean`, `args: string[]`  | Runs the project in dev mode using either `./mvnw\|mvn quarkus:dev` or `./gradlew\|gradle quarkusDev` |
| `remoteDev`     | `ignoreWrapper:boolean`, `args: string[]`  | Runs the project in remote dev mode using either `./mvnw\|mvn quarkus:remoteDev` or `./gradlew\|gradle quarkusRemoteDev` |
| `build`         | `ignoreWrapper:boolean`, `args: string[]`  | Builds a native or container friendly image either `./mvnw\|mvn build` or `./gradlew\|gradle build` |
| `test`          | `ignoreWrapper:boolean`, `args: string[]`  | Tests the project using either `./mvnw\|mvn test` or `./gradlew\|gradle test` |
| `clean`         | `ignoreWrapper:boolean`, `args: string[]`  | Cleans the project using either `./mvnw\|mvn clean` or `./gradlew\|gradle clean` |
| `package`       | `ignoreWrapper:boolean`, `args: string[]`  | Packages the project using either `./mvnw\|mvn package` or `./gradlew\|gradle package` |
| `addExtension`  | `ignoreWrapper:boolean`, `args: string[]`  | Adds a new extension to the  project using either `./mvnw\|mvn quarkus:add-extension` or `./gradlew\|gradle quarkusAddExtension` |
| `listExtensions`| `ignoreWrapper:boolean`, `args: string[]`  | Adds a new extension to the  project using either `./mvnw\|mvn quarkus:list-extensions` or `./gradlew\|gradle quarkusListExtensions` |

In order to execute the requested command, each executor will use, by default, the embedded `./mvnw` or `./gradlew` executable, that was generated alongside the project.
If you want to rely on a globally installed `mvn` or `gradle` executable instead, add the `--ignoreWrapper` option to bypass it.
This can be useful in a CI environment for example, or in a restricted environment where the binary cannot be downloaded (due to proxy/firewall limitations).


You can pass in additional arguments to the underlying Gradle or Maven, either temporarily (via `--args="..."`). For example:
```
nx remoteDev your-quarkus-app --args="-Dquarkus.live-reload.url=http://my-remote-host:8080"
```

Or, permanently by editing the related executor in the `workspace.json` file, as such:
```js
{
  "version": 1,
  "projects": {
    "your-quarkus-app": {
      "projectType": "application",
      "root": "apps/your-quarkus-app",
      "sourceRoot": "apps/your-quarkus-app/src",
      "targets": {
        "remoteDev": {
          "executor": "@nxrocks/nx-quarkus:remoteDev",
          "options": {
            "root": "apps/your-quarkus-app",
            "args": ["-Dquarkus.live-reload.url=http://my-remote-host:8080"]// your additional args here
          }
        }
      }
    }},
  "cli": {
    "defaultCollection": "@nrwl/workspace"
  }
}
```

### Running the project in dev mote - ('run' or 'dev' or 'serve' Executors)

```
nx run your-quarkus-app:run

// or
nx serve your-quarkus-app

// or

nx dev your-quarkus-app
```

### Running the project in remote dev mode - ('remoteDev' Executor)

```
// for a maven-based project
nx remoteDev your-quarkus-app --args="-Dquarkus.live-reload.url=http://my-remote-host:8080"

// for a gradle-based project
nx remoteDev your-quarkus-app --args="-Dquarkus.live-reload.url=http://my-remote-host:8080"
```

### Building the aplication -  ('build' Executor)

```
nx build your-quarkus-app
```

### Testing the project -  ('test' Executor)

```
nx test your-quarkus-app
```

### Cleaning the project -  ('clean' Executor)

```
nx clean your-quarkus-app
```

### Packaging the project -  ('package' Executor)

```
nx package your-quarkus-app
```

### Add Extension the project -  ('Add Extension' Executor)

```
// for a maven-based project
nx addExtension your-quarkus-app --args="-Dextensions=resteasy,hibernate-validator"

// for a gradle-based project
nx addExtension your-quarkus-app --args="--extensions=resteasy,hibernate-validator"
```

### List Extensions in the  project -  ('List Extensions' Executor)

```
nx listExtensions your-quarkus-app
```

## Compatibility with Nx

Every Nx plugin relies on the underlying Nx Workspace it runs on. This table provides the compatibility matrix between major versions of Nx workspace and this plugin

| Plugin Version | Nx Workspace version
| -------------- | --------------------
| `>=v1.x.x`     | `>=v11.x.x`
## License

Copyright (c) 2021 Tine Kondo. Licensed under the MIT License (MIT)
