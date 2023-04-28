
# nx-melos

[![npm version](https://img.shields.io/npm/v/@nxrocks/nx-melos?style=flat-square)](https://www.npmjs.com/package/@nxrocks/nx-melos)
[![flutter version](https://img.shields.io/badge/flutter-stable-blue?style=flat-square)](https://github.com/flutter/flutter/wiki/Flutter-build-release-channels#stable)
[![github action - release](https://img.shields.io/github/actions/workflow/status/tinesoft/nxrocks/release.yml?label=release&style=flat-square)](https://github.com/tinesoft/nxrocks/actions?query=workflow%3ARelease)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)

> Nx Plugin adding first class support for [Melos](https://melos.invertase.dev/) in your Nx workspace

<p align="center"><img src="https://raw.githubusercontent.com/tinesoft/nxrocks/master/images/nx-melos.png" width="450"></p>

## What is `Melos` ?

`Melos` is a CLI tool used to help manage Flutter/Dart projects within a monorepo. It is currently still in active development however is in use on projects such as [FlutterFire](https://github.com/FirebaseExtended/flutterfire).

Its features include:

* Automatic versioning & changelog generation.
* Automated publishing of packages to pub.dev.
* Local package linking and installation.
* Executing simultaneous commands across packages.
* Listing of local packages & their dependencies.

## Contents

* [Features](#features)
* [Prerequisites](#prerequisites)
* [Getting Started](#getting-started)
* [Plugin Usage](#plugin-usage)
* [Compatibility with Nx](#compatibility-with-nx)

## Features

Here is a list of some of the coolest features of the plugin:

* ✅ Automatic installation of `melos` as a global package via [pub.dev](https://pub.dev/) 
* ✅ Generation of basic `melos.yaml` configuration, based on workspace setup
* ✅ Root-level NPM scripts to run `melos` [commands](https://melos.invertase.dev/commands/bootstrap) using `Nx`
* ...

## Prerequisites

This plugin relies on `melos`' [command-line](https://flutter.dev/docs/reference/flutter-cli) to do its job. So, you must have [`Dart SDK`](https://flutter.dev) installed on your system. If not, head to [https://dart.dev/get-dart](https://dart.dev/get-dart) and follow installation instructions for your OS.

Then, if you have not already, [create an Nx workspace](https://github.com/nrwl/nx#creating-an-nx-workspace) with the following:

```
# npm
npx create-nx-workspace@latest

# yarn
yarn create nx-workspace@latest
```

## Getting Started

Then you need to install the plugin in order to manage your workspace with `melos` later on.

### Installing Plugin

```
# npm
npm install @nxrocks/nx-melos --save-dev

# yarn
yarn add @nxrocks/nx-melos --dev
```

### Initializing Melos

Once installed, simply run the following command, to set everything up (only needed once):

```
nx g @nxrocks/nx-melos:init
```

This will automatically:

* Install `melos` as a global Dart package on your workstation
* Create a pre-configured `melos.yaml` configuration file at root of your workspace
* Add [root-level NPM scripts](https://nx.dev/recipes/other/root-level-scripts) to run `melos` [commands](https://melos.invertase.dev/commands/bootstrap) using `Nx`

### Generating Flutter/Dart projects within the workspace

You can use the companion plugin [@nxrocks/nx-flutter](https://github.com/tinesoft/nxrocks/tree/master/packages/nx-flutter) to generate Flutter/Dart `application` | `library` | `module` | `package` within the workspace.

Follow this [guide](https://github.com/tinesoft/nxrocks/tree/develop/packages/nx-flutter#getting-started) to find out how to proceed.

## Plugin Usage

Once your apps or libraries are generated inside your workspace, you can now use `melos`to manage them.

Here the list of `melos`commands added to your root `package.json` file as NPM scripts:

| Root-level Script<sup>*</sup>     | Arguments        | Description                                |
| --------------------- | ---------------- | ------------------------------------------ |
| `melos-bootstrap`     | *see [docs](https://melos.invertase.dev/commands/bootstrap)*  | Initializes the workspace, links local packages together and installs remaining package dependencies. |
| `melos-clean`         | *see [docs](https://melos.invertase.dev/commands/clean)*      | Cleans the current workspace and all its packages of temporary pub & generated Melos IDE files. |
| `melos-exec`          | *see [docs](https://melos.invertase.dev/commands/exec)*       | Executes an arbitrary command in each package. |
| `melos-list`          | *see [docs](https://melos.invertase.dev/commands/list)*       | Lists information about the local packages. |
| `melos-publish`       | *see [docs](https://melos.invertase.dev/commands/publish)*    | Publishes any unpublished packages or package versions in your repository to pub.dev. `dry-run` is enabled by default. |
| `melos-run`           | *see [docs](https://melos.invertase.dev/commands/run)*        | Runs a [script](https://melos.invertase.dev/configuration/scripts) by name defined in the workspace `melos.yaml` config file. |
| `melos-version`       | *see [docs](https://melos.invertase.dev/commands/version)*    | Automatically version and generate changelogs for all packages. |

> <sup>*</sup>: The exact name of the scripts depends on the `scriptNameSeparator` option that you used during the initialisation of the plugin ( `nx g @nxrocks/nx-melos:init --scriptNameSeparator=<separator_value>`). 
> Possible values for the separator are: "-" (*default*) or ":"

Each script is based on the original `melos` command and supports the same arguments.

For example:

```
$ melos bootstrap --since=main

becomes 👉🏾

$ npx nx melos-bootstrap --since=main
// or
$ yarn nx melos-bootstrap --since=main
```

## Compatibility with Nx

Every Nx plugin relies on the underlying Nx Workspace/DevKit it runs on. This table provides the compatibility matrix between major versions of Nx workspace and this plugin.

| Plugin Version | Nx Workspace version
| -------------- | --------------------
| `>=v2.x.x`     | `>=v16.x.x`
| `>=v1.x.x`     | `>=v15.3.x`

## License

Copyright (c) 2023-present Tine Kondo. Licensed under the MIT License (MIT)
