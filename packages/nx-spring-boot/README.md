# nx-spring-boot
[![npm version](https://img.shields.io/npm/v/@nxrocks/nx-spring-boot?style=flat-square)](https://www.npmjs.com/package/@nxrocks/nx-spring-boot)
[![github action - release](https://img.shields.io/github/workflow/status/tinesoft/nxrocks/Release?label=release&style=flat-square)](https://github.com/tinesoft/nxrocks/actions?query=workflow%3ARelease)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)

> Nx Plugin to generate, run, package, build (and more) [Spring Boot](https://spring.io/projects/spring-boot) projects inside your Nx workspace

<p align="center"><img src="https://raw.githubusercontent.com/tinesoft/nxrocks/master/images/nx-spring-boot.png" width="450"></p>

## Contents

- [Prerequisite](#prerequisite)
- [Getting Started](#getting-started)
- [Plugin Usage](#plugin-usage)

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

### Generating Application

Simply run the `application` Schematics with the following command:

```
nx g @nxrocks/nx-spring-boot:app <your-app-name>
```

You will be prompted for entering the most commonly customized generation options (like application's `groupId`, `artifactId`, `packaging`, `dependencies`, etc).

To skip the interactive prompt, or if you want to customize all non-prompted options, you can pass them along directly when running the command, as such:

```
nx g @nxrocks/nx-spring-boot:app <your-app-name> --optionName1 optionValue1 ... --optionNameN optionValueN
```

#### Generation Options

Here the list of available generation options :

| Arguments | Description           |
| --------- | --------------------- |
| `<name>`  | The name of your app. |

Option                 | Value | Description
---------------------- | ----- | ------------
`type`                 | `maven-project` \| `gradle-project`  | Type of project to generate
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

Here the list of available builders:

| Builder        | Arguments        | Description                                |
| -------------- | ---------------- | ------------------------------------------ |
| `run` \| `serve`| `args: string[]` | Runs the application using either `./mvnw spring-boot:run` or `./gradlew bootRun` |
| `buidlJar`     | `args: string[]` | Packages the application into an executable Jar using either `./mvnw spring-boot:repackage` or `./gradlew bootJar` |
| `buildWar`     | `args: string[]` | Packages the application into an executable War using either `./mvnw spring-boot:repackage` or `./gradlew bootWar` |
| `buildInfo`    |         -        | Generates a `build-info.properties` using either `./mvnw spring-boot:build-info` or `./gradlew bootBuildInfo` |
| `buildImage`   | `args: string[]` | Generates an [OCI Image](https://github.com/opencontainers/image-spec) using either `./mvnw spring-boot:build-image` or `./gradlew bootBuildImage` |

### Running the application - ('run' or 'serve' Builders)

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
      "architect": {
        "run": { // or "serve", according to your preference
          "builder": "@nxrocks/nx-spring-boot:run",// or "@nxrocks/nx-spring-boot:serve", according to your preference
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

### Building the Jar -  ('buildJar' Builder)

```
nx buildJar your-boot-app
```

### Building the War -  ('buildWar' Builder)

```
nx buildWar your-boot-app
```

### Building the OCI Image -  ('buildImage' Builder)

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
      "architect": {
        "buildImage": {
          "builder": "@nxrocks/nx-spring-boot:buildImage",
          "options": {
            "root": "apps/you-boot-app",
            "args": ["--builder=gcr.io/paketo-buildpacks/builder:base-platform-api-0.3", "--runImage=my-image"]
          }
        }
      }
    }},
  "cli": {
    "defaultCollection": "@nrwl/workspace"
  }
}
```

## License

Copyright (c) 2020 Tine Kondo. Licensed under the MIT License (MIT)
