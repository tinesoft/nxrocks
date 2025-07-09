# nx-ionic

[![npm version](https://img.shields.io/npm/v/@nxrocks/nx-ionic?style=flat-square)](https://www.npmjs.com/package/@nxrocks/nx-ionic)
[![ionic version](https://img.shields.io/badge/ionic-8.x-blue?style=flat-square)](https://ionicframework.com/)
[![github action - release](https://img.shields.io/github/actions/workflow/status/tinesoft/nxrocks/release.yml?label=release&style=flat-square)](https://github.com/tinesoft/nxrocks/actions?query=workflow%3ARelease)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)

> Nx Plugin adding first class support for [Ionic](https://ionicframework.com) in your Nx workspace

<p align="center"><img src="https://raw.githubusercontent.com/tinesoft/nxrocks/master/images/nx-ionic.png" width="450"></p>

## Contents

- [Features](#features)
- [Setup](#setup)
- [Generators](#generators)
- [Executors](#executors)
- [Compatibility with Nx](#compatibility-with-nx)

## Features

Here is a list of some of the coolest features of the plugin:

- ✅ Generation of Ionic applications based on **Ionic CLI** API
- ✅ **Project inference**: Automatically detects Ionic projects via `ionic.config.json`
- ✅ **Inferred tasks**: Automatically configures Nx targets for common Ionic commands
- ✅ Building, serving, testing, and managing your Ionic projects with Capacitor integration
- ✅ Support for **Angular**, **React**, and **Vue** frameworks
- ✅ Integration with Nx's **dependency graph** (through `nx dep-graph` or `nx affected:dep-graph`): this allows you to **visualize** the dependencies of any Ionic projects inside your workspace, just like Nx natively does it for JS/TS-based projects!

  _Example of running the `nx dep-graph` command on a workspace with Ionic projects inside_

- ✅ **Capacitor integration**: Native mobile development with iOS and Android support
- ✅ **Package manager agnostic**: Works with npm, yarn, pnpm, and bun

## Setup

<details open>
<summary>📢 ℹ️ 🆕 <b>HEADS UP!</b> New <b>simplified</b> setup since <i>January 2025</i>, with our custom <b>CLI</b>!</summary>

> You can now use our own `create-nx-ionic` **CLI** to easily create a Nx workspace, that comes with this plugin pre-installed!
>
> Simply run:
>
> ```
> # npm
> npx create-nx-ionic@latest
> # or
> # yarn
> yarn create nx-ionic
> ```
>
> and you are good to go‧o‧o‧o! 🚀
>
> More information here: [create-nx-ionic](../create-nx-ionic/README.md)

</details>

Otherwise, this is the traditional way of setting things up:

### 1. Creating the Nx workspace

This plugin relies on [`@ionic/cli`](https://ionicframework.com/docs/cli) to do its job. So, you must have [`@ionic/cli`](https://ionicframework.com/docs/cli) installed on your system. If not, head to [ionicframework.com/docs/installation/cli](https://ionicframework.com/docs/installation/cli) and follow installation instructions.

Then, if you have not already, [create an Nx workspace](https://github.com/nrwl/nx#creating-an-nx-workspace) with the following:

```
# npm
npx create-nx-workspace@latest

# yarn
yarn create nx-workspace@latest
```

### 2. Installing the Plugin

Then you need to install the plugin in order to generate Ionic applications later on.

```
# npm
npm install @nxrocks/nx-ionic --save-dev

# yarn
yarn add @nxrocks/nx-ionic --dev
```

## Generators

This plugin is composed of 2 main **generators**:

- `app` generator
- `init` generator

### Generating Applications (`app` generator)

Simply run the `app` generator with the following command:

```
nx g @nxrocks/nx-ionic:app my-ionic-app
```

> you can also use the following aliases to call the generator: `application`, `new`, or `create`

You will be prompted for entering the most commonly customized generation options (like application's `template`, `type`, `capacitor` integration, etc).

To skip the interactive prompt, or if you want to customize all non-prompted options, you can pass them along directly when running the command, as such:

```
nx g @nxrocks/nx-ionic:app my-ionic-app --template=tabs --type=angular --capacitor=true
```

#### Generation Options

Here the list of available generation options :

| Arguments | Description                             |
| --------- | --------------------------------------- |
| `<name>`  | The name of your new project (required) |

| Option      | Value                                                 | Description                                                              |
| ----------- | ----------------------------------------------------- | ------------------------------------------------------------------------ |
| `template`  | `blank` \| `tabs` \| `sidemenu` \| `list`             | The starter template to use                                              |
| `type`      | `angular` \| `angular-standalone` \| `react` \| `vue` | Type of project to start                                                 |
| `directory` | `string`                                              | The directory of the new project                                         |
| `capacitor` | `boolean`                                             | Include Capacitor integration (default: true)                            |
| `cordova`   | `boolean`                                             | (deprecated) Include Cordova integration                                 |
| `id`        | `string`                                              | Specify an Ionic App ID to link                                          |
| `projectId` | `string`                                              | Specify a slug for your app (used for directory name and package name)   |
| `packageId` | `string`                                              | Specify the bundle ID/application ID for your app (reverse-DNS notation) |
| `noDeps`    | `boolean`                                             | Do not install npm/yarn dependencies                                     |
| `noGit`     | `boolean`                                             | Do not initialize a git repo                                             |
| `link`      | `boolean`                                             | Connect your new app to Ionic                                            |
| `tags`      | `string`                                              | Tags to use for linting (comma-separated)                                |

### Initializing the Workspace (`init` generator)

Simply run the `init` generator with the following command:

```
nx g @nxrocks/nx-ionic:init
```

This generator will add the necessary dependencies and configuration to your workspace.

## Executors

Once your app is generated, you can now use **executors** to manage it.

Here the list of available executors<sup>1</sup>:

| Executor     | Arguments                             | Description                              |
| ------------ | ------------------------------------- | ---------------------------------------- |
| `build`      | _see `ionic build --help`_            | Build the Ionic app                      |
| `serve`      | _see `ionic serve --help`_            | Serve the Ionic app in development       |
| `generate`   | _see `ionic generate --help`_         | Generate Ionic components/pages/services |
| `cap-add`    | _see `ionic capacitor add --help`_    | Add a native platform with Capacitor     |
| `cap-build`  | _see `ionic capacitor build --help`_  | Build the native app with Capacitor      |
| `cap-copy`   | _see `ionic capacitor copy --help`_   | Copy web assets to native platform       |
| `cap-open`   | _see `ionic capacitor open --help`_   | Open the native IDE                      |
| `cap-run`    | _see `ionic capacitor run --help`_    | Run the native app on device/emulator    |
| `cap-sync`   | _see `ionic capacitor sync --help`_   | Sync web assets and native plugins       |
| `cap-update` | _see `ionic capacitor update --help`_ | Update Capacitor dependencies            |
| `repair`     | _see `ionic repair --help`_           | Repair Ionic configuration issues        |

<sup>1</sup> : _These executors are automatically inferred by the plugin when it detects an `ionic.config.json` file in your project._

Each executor is based on the original `ionic` CLI commands. The arguments accepted by each executor are the same as the original `ionic` command they are based upon, and can be provided directly like in `--option=value`. Read this [guide](https://nx.dev/recipes/running-tasks/pass-args-to-commands#pass-args-when-running-the-command-in-the-terminal) for more about the syntax to pass arguments along.

For example:

```
$ ionic build --prod
$ ionic serve --port=4300
$ ionic capacitor add android

become 👉🏾

$ nx build my-ionic-app --prod
$ nx serve my-ionic-app --port=4300
$ nx run my-ionic-app:cap-add -- android

or

$ nx run my-ionic-app:build --prod
$ nx run my-ionic-app:serve --port=4300
$ nx run my-ionic-app:cap-add -- android
```

## Requirements

- All dependencies must be in the root `package.json` (Nx monorepo best practice).
- Uses the latest `@ionic/cli` via your package manager.
- For Capacitor integration, make sure you have the necessary native development tools installed:
  - **iOS**: Xcode (macOS only)
  - **Android**: Android Studio

## Example

```sh
# Generate a new Ionic app
nx g @nxrocks/nx-ionic:app my-ionic-app --template=tabs --type=angular

# Build the app
nx build my-ionic-app

# Serve the app in development
nx serve my-ionic-app

# Add Android platform
nx cap-add my-ionic-app -- android

# Build for Android
nx cap-build my-ionic-app -- android

# Run on Android device/emulator
nx cap-run my-ionic-app -- android
```

## Compatibility with Nx

Every Nx plugin relies on the underlying Nx Workspace/DevKit it runs on. This table provides the compatibility matrix between major versions of Nx workspace and this plugin.

| Plugin Version | Nx Workspace version |
| -------------- | -------------------- |
| `>=v1.x.x`     | `>=v21.x.x`          |

## License

Copyright (c) 2025-present Tine Kondo. Licensed under the MIT License (MIT)
