# nx-flutter
[![npm version](https://img.shields.io/npm/v/@nxrocks/nx-flutter?style=flat-square)](https://www.npmjs.com/package/@nxrocks/nx-flutter)
[![flutter version](https://img.shields.io/badge/flutter-stable-blue?style=flat-square)](https://github.com/flutter/flutter/wiki/Flutter-build-release-channels#stable)
[![github action - release](https://img.shields.io/github/workflow/status/tinesoft/nxrocks/Release?label=release&style=flat-square)](https://github.com/tinesoft/nxrocks/actions?query=workflow%3ARelease)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)

> Nx Plugin adding first class support for [Flutter](https://flutter.dev) in your Nx workspace

<p align="center"><img src="https://raw.githubusercontent.com/tinesoft/nxrocks/master/images/nx-flutter.png" width="450"></p>

## Contents

- [Prerequisite](#prerequisite)
- [Getting Started](#getting-started)
- [Plugin Usage](#plugin-usage)

## Prerequisite

This plugin relies on [`flutter's command-line`](https://flutter.dev/docs/reference/flutter-cli) to do its job. So, you must have [`flutter`](https://flutter.dev) installed on your system. If not, head to [flutter.dev/docs/get-started/install](https://flutter.dev/docs/get-started/install) and follow installation instructions for your OS.

Then, if you have not already, [create an Nx workspace](https://github.com/nrwl/nx#creating-an-nx-workspace) with the following:

```
# npm
npx create-nx-workspace@latest

# yarn
yarn create nx-workspace@latest
```

## Getting Started

Then you need to install the plugin in order to generate Flutter applications later on.

### Installing Plugin

```
# npm
npm install @nxrocks/nx-flutter --save-dev

# yarn
yarn add @nxrocks/nx-flutter --dev
```

### Generating Application


Simply run the `application` Schematics with the following command:

```
nx g @nxrocks/nx-flutter:create <app-folder>
```

You will be prompted for entering the most commonly customized generation options (like application's `package`, `description`, `template`,  etc).

To skip the interactive prompt, or if you want to customize all non-prompted options, you can pass them along directly when running the command, as such:

```
nx g @nxrocks/nx-flutter:create <app-folder> --optionName1 optionValue1 ... --optionNameN optionValueN
```

<details>
  <summary><b><i>⚠️ Special generation instructions in case above fail ⚠️</i></b></summary>
  
  Due to [a current bug with Nx's `nx g` command](https://github.com/nrwl/nx/issues/4499), you might need the following workaround in order to generate the application successfully (otherwise, [this error](https://github.com/tinesoft/nxrocks/issues/22#issuecomment-758021348) might occur):

  1. Change the `"version"` field in your `workspace.json` from `2` to `1`
  2. Generate the application with **Angular DevKit's schematics-cli**:
     * Run `npx @angular-devkit/schematics-cli @nxrocks/nx-flutter:create <app-folder>`
     * Answer to the prompted questions
  3. Change the `"version"` field in your `workspace.json` back to `2`
</details>

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

## Plugin Usage

Once your app is generated, you can now use **buidlers** to manage it.

Here the list of available builders:

| Builder        | Arguments        | Description                                |
| -------------- | ---------------- | ------------------------------------------ |
| `analyze`      | _see `flutter help analyze`_    | Analyze the project's Dart code |
| `assemble`     | _see `flutter help assemble`_   | Assemble and build Flutter resources |
| `attach`       | _see `flutter help attach`_     | Attach to a running app |
| `buildAar`     | _see `flutter help build aar`_  | Build a repository containing an AAR and a POM file |
| `buildApk`     | _see `flutter help build apk`_  | Build an Android APK file from your app |
| `buildAppbundle` | _see `flutter help build appbundle`_ | Build an Android App Bundle file from your app |
| `buildBundle`  | _see `flutter help build bundle`_ | Build the Flutter assets directory from your app |
| `buildIos`     | _see `flutter help build ios`_  | Build an iOS application bundle (Mac OS X host only) |
| `buildIosframework` | _see `flutter help build ios-framework`_ | Produces a .framework directory for a Flutter module and its plugins for integration into existing, plain Xcode projects |
| `buildIpa`     | _see `flutter help build ipa`_  | Build an iOS archive bundle (Mac OS X host only) |
| `clean`        | _see `flutter help clean`_      | Delete the `build/` and `dart_tool/` directories |
| `drive`        | _see `flutter help drive`_      | Run integration tests for the project on an attached device or emulator |
| `format`       | _see `flutter help format`_     | Format one or more Dart files |
| `gen-l10n`     | _see `flutter help gen-l10n`_   | Generate localizations for the current project |
| `install`      | _see `flutter help install`_    | Install a Flutter app on an attached device |
| `run`          | _see `flutter help run`_        | Run your Flutter app on an attached device |
| `screenshot`   | _see `flutter help screenshot`_ | Take a screenshot from a connected device |
| `symbolize`    | _see `flutter help symbolize`_  | Symbolize a stack trace from an AOT-compiled Flutter app |
| `test`         | _see `flutter help test`_       | Run Flutter unit tests for the current project |

Each builder is based on an original project-level `flutter` command. The name is just **camelcased** to match builders' naming conventions.
Besides, the arguments accepted by each builder, are the same as the original `flutter` command they are based upon, encapsulated
under a generic `--args='...'` option.

For example:

```
$ flutter gen-l10n --header "/// my header"

becomes 👉🏾

$ nx genL10n your-flutterapp --args='--header="/// my header"'
````

> Note that the original `flutter` command name (`gen-l10n`) has been camelcased for creating its `nx-flutter` equivalent (`genL10n`)

> Note that the arguments of the original `flutter` command are wrapped under `--args='...'` option in  the `nx-flutter` equivalent

## License

Copyright (c) 2021 Tine Kondo. Licensed under the MIT License (MIT)
