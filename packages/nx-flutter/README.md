# nx-flutter
[![npm version](https://img.shields.io/npm/v/@nxrocks/nx-flutter?style=flat-square)](https://www.npmjs.com/package/@nxrocks/nx-flutter)
[![flutter version](https://img.shields.io/badge/flutter-stable-blue?style=flat-square)](https://github.com/flutter/flutter/wiki/Flutter-build-release-channels#stable)
[![github action - release](https://img.shields.io/github/actions/workflow/status/tinesoft/nxrocks/release.yml?label=release&style=flat-square)](https://github.com/tinesoft/nxrocks/actions?query=workflow%3ARelease)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)

> Nx Plugin adding first class support for [Flutter](https://flutter.dev) in your Nx workspace

<p align="center"><img src="https://raw.githubusercontent.com/tinesoft/nxrocks/master/images/nx-flutter.png" width="450"></p>

## Contents

- [Features](#features)
- [Setup](#setup)
- [Generators](#generators)
- [Executors](#executors)
- [Compatibility with Nx](#compatibility-with-nx)

## Features

Here is a list of some of the coolest features of the plugin:

- ✅ Generation of Flutter applications/packages/modules/plugins based on **Flutter cli** API
- ✅ Building, packaging, testing, etc your Flutter projects
- ✅ Integration with Nx's **dependency graph** (through `nx dep-graph` or `nx affected:dep-graph`): this allows you to **visualize** the dependencies of any Flutter projects inside your workspace, just like Nx natively does it for JS/TS-based projects!

  ![Nx Flutter dependency graph](https://raw.githubusercontent.com/tinesoft/nxrocks/develop/images/nx-flutter-dep-graph.png)
  *Example of running the `nx dep-graph` command on a workspace with 2 Flutter projects inside*

- ...

## Setup

<details open>
<summary>📢 ℹ️ 🆕 <b>HEADS UP!</b> New <b>simplified</b> setup since <i>October 2023</i>, with our custom <b>CLI</b>!</summary>


> You can now use our own `create-nx-flutter` **CLI** to easily create a Nx workspace, that comes with this plugin pre-installed!
> 
> Simply run:
> 
> ```
> # npm
> npx create-nx-flutter@latest
> # or
> # yarn
> yarn create nx-flutter
> ```
> 
> and you are good to go‧o‧o‧o! 🚀
> 
> More information here: [create-nx-flutter](../packages/create-nx-flutter/README.md)

</details>


Otherwise, this is the traditional way of setting things up:

### 1. Creating the Nx workspace

This plugin relies on [`flutter's command-line`](https://flutter.dev/docs/reference/flutter-cli) to do its job. So, you must have [`flutter`](https://flutter.dev) installed on your system. If not, head to [flutter.dev/docs/get-started/install](https://flutter.dev/docs/get-started/install) and follow installation instructions for your OS.

Then, if you have not already, [create an Nx workspace](https://github.com/nrwl/nx#creating-an-nx-workspace) with the following:

```
# npm
npx create-nx-workspace@latest

# yarn
yarn create nx-workspace@latest
```

### 2. Installing the Plugin

Then you need to install the plugin in order to generate Flutter applications later on.

```
# npm
npm install @nxrocks/nx-flutter --save-dev

# yarn
yarn add @nxrocks/nx-flutter --dev
```

## Generators

This plugin is composed of 1 main **generator**:

- `project` generator

### Generating Projects (`project` generator)

Simply run the `project` generator with the following command:

```
nx g @nxrocks/nx-flutter:project <app-folder>
```


> you can also use the following aliases to call the generator: `prj`, `new`, `gen`, `init`, `create`, or `generate`

You will be prompted for entering the most commonly customized generation options (like application's `package`, `description`, `template`,  etc).

To skip the interactive prompt, or if you want to customize all non-prompted options, you can pass them along directly when running the command, as such:

```
nx g @nxrocks/nx-flutter:project <app-folder> --optionName1 optionValue1 ... --optionNameN optionValueN
```

#### Generation Options

Here the list of available generation options :

| Arguments | Description           |
| --------- | --------------------- |
| `<output-folder>`  | The folder that will contain your app |

Option           | Value | Description
---------------- | ----- | ------------
`org`            | `string` | Name of the package
`description`    | `string` | Description of the project
`androidLanguage`| `java` \| `kotlin`  | Language to use for Android code
`iOSLanguage`    | `objc` \| `swift` |  Language to use for iOS code
`template`       | `app` \| `module` \| `package` \| `plugin` | Template of Flutter project to generate
`sample`         | `string` | Sample ID of the desired sample from the API documentation website (http://docs.flutter.dev)
`platforms`      | `android` \| `ios` \| `linux` \| `macos` \| `windows` \| `web`  | Platforms supported by the project to generate
`pub`            | `boolean` | Whether to run "flutter pub get" after the project has been created
`offline`        | `boolean` | Whether or not to run 'flutter pub get' in offline mode
`tags`           | `string` | Tags to use for linting (comma-separated)
`directory`      | `string` | Directory where the project is placed

## Executors

Once your app is generated, you can now use **executors** to manage it.

Here the list of available executors<sup>1</sup>:

| Executor        | Arguments        | Description                                |
| -------------- | ---------------- | ------------------------------------------ |
| `analyze`      | _see `flutter help analyze`_    | Analyze the project's Dart code |
| `assemble`     | _see `flutter help assemble`_   | Assemble and build Flutter resources |
| `attach`       | _see `flutter help attach`_     | Attach to a running app |
| `build-aar`     | _see `flutter help build aar`_  | Build a repository containing an AAR and a POM file |
| `build-apk`     | _see `flutter help build apk`_  | Build an Android APK file from your app |
| `build-appbundle` | _see `flutter help build appbundle`_ | Build an Android App Bundle file from your app |
| `build-bundle`  | _see `flutter help build bundle`_ | Build the Flutter assets directory from your app |
| `build-ios`     | _see `flutter help build ios`_  | Build an iOS application bundle (Mac OS X host only) |
| `buildIosframework` | _see `flutter help build ios-framework`_ | Produces a .framework directory for a Flutter module and its plugins for integration into existing, plain Xcode projects |
| `build-ipa`     | _see `flutter help build ipa`_  | Build an iOS archive bundle (Mac OS X host only) |
| `clean`        | _see `flutter help clean`_      | Delete the `build/` and `dart_tool/` directories |
| `drive`        | _see `flutter help drive`_      | Run integration tests for the project on an attached device or emulator |
| `format`       | _see `dart help format`_        | Format one or more Dart files |
| `gen-l10n`     | _see `flutter help gen-l10n`_   | Generate localizations for the current project |
| `install`      | _see `flutter help install`_    | Install a Flutter app on an attached device |
| `run`          | _see `flutter help run`_        | Run your Flutter app on an attached device |
| `screenshot`   | _see `flutter help screenshot`_ | Take a screenshot from a connected device |
| `symbolize`    | _see `flutter help symbolize`_  | Symbolize a stack trace from an AOT-compiled Flutter app |
| `test`         | _see `flutter help test`_       | Run Flutter unit tests for the current project |
| `doctor`       | _see `flutter help doctor`_     | Run Flutter doctor to check the environment and status of Flutter installation |

<sup>1</sup> : *Actual executors in your `workspace.json` will depend on the type of `flutter` project (`template`), target `platforms` that you choose to generate.*

Each executor is based on an original project-level `flutter` command. The name is just **kebab-cased** to match executors' naming conventions.
Besides, the arguments accepted by each executor, are the same as the original `flutter` command they are based upon, encapsulated
under a generic `--args='...'` option.

For example:

```
$ flutter gen-l10n --header "/// my header"

becomes 👉🏾

$ nx gen-l10n your-flutterapp --args='--header="/// my header"'
```

> Note that the original `flutter` command name (`gen-l10n`) has been camelcased for creating its `nx-flutter` equivalent (`gen-l10n`)

> Note that the arguments of the original `flutter` command are wrapped under `--args='...'` option in  the `nx-flutter` equivalent

## Compatibility with Nx

Every Nx plugin relies on the underlying Nx Workspace/DevKit it runs on. This table provides the compatibility matrix between major versions of Nx workspace and this plugin.

| Plugin Version | Nx Workspace version
| -------------- | --------------------
| `>=v8.x.x`     | `>=v17.x.x`
| `>=v7.x.x`     | `>=v16.x.x`
| `>=v6.x.x`     | `>=v15.8.x`
| `>=v5.x.x`     | `>=v15.x.x`
| `>=v3.1.x`     | `>=v13.8.x`
| `>=v3.x.x`     | `>=v12.6.x`
| `>=v2.x.x`     | `>=v11.x.x`
| `<=v1.3.1`     | `<=v10.x.x`

## License

Copyright (c) 2020-present Tine Kondo. Licensed under the MIT License (MIT)
