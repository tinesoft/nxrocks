# nx-flutter
[![npm version](https://img.shields.io/npm/v/@nxrocks/nx-flutter?style=flat-square)](https://www.npmjs.com/package/@nxrocks/nx-flutter)
[![github action - release](https://img.shields.io/github/workflow/status/tinesoft/nxrocks/Release?label=release&style=flat-square)](https://github.com/tinesoft/nxrocks/actions?query=workflow%3ARelease)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)

> Nx Plugin adding first class support for [Flutter](https://flutter.dev) in your Nx workspace

<p align="center"><img src="https://raw.githubusercontent.com/tinesoft/nxrocks/master/images/nx-flutter.png" width="450"></p>

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
nx g @nxrocks/nx-flutter:app <app-folder>
```

You will be prompted for entering the most commonly customized generation options (like application's `package`, `description`, `template`,  etc).

To skip the interactive prompt, or if you want to customize all non-prompted options, you can pass them along directly when running the command, as such:

```
nx g @nxrocks/nx-flutter:app <app-folder> --optionName1 optionValue1 ... --optionNameN optionValueN
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

## Plugin Usage

Once your app is generated, you can now use **buidlers** to manage it.

Here the list of available builders:

| Builder        | Arguments        | Description                                |
| -------------- | ---------------- | ------------------------------------------ |
| `analyze`      | see `flutter help analyze`    | Analyze the project's Dart code |
| `assemble`     | see `flutter help assemble`   | Assemble and build Flutter resources |
| `attach`       | see `flutter help attach`     | Attach to a running app |
| `buildAar`     | see `flutter help build aar`  | Build a repository containing an AAR and a POM file |
| `buildApk`     | see `flutter help build apk`  | Build an Android APK file from your app |
| `buildAppbundle` | see `flutter help build appbundle` | Build an Android App Bundle file from your app |
| `buildBundle`  | see `flutter help build bundle` | Build the Flutter assets directory from your app |
| `buildIos`     | see `flutter help build ios`  | Build an iOS application bundle (Mac OS X host only) |
| `buildIosframework` | see `flutter help build ios-framework` | Produces a .framework directory for a Flutter module and its plugins for integration into existing, plain Xcode projects |
| `buildIpa`     | see `flutter help build ipa`  | Build an iOS archive bundle (Mac OS X host only) |
| `clean`        | see `flutter help clean`      | Delete the `build/` and `dart_tool/` directories |
| `drive`        | see `flutter help drive`      | Run integration tests for the project on an attached device or emulator |
| `format`       | see `flutter help format`     | Format one or more Dart files |
| `gen-l10n`     | see `flutter help gen-l10n`   | Generate localizations for the current project |
| `install`      | see `flutter help install`    | Install a Flutter app on an attached device |
| `run`          | see `flutter help run`        | Run your Flutter app on an attached device |
| `screenshot`   | see `flutter help screenshot` | Take a screenshot from a connected device |
| `symbolize`    | see `flutter help symbolize`  | Symbolize a stack trace from an AOT-compiled Flutter app |
| `test`         | see `flutter help test`       | Run Flutter unit tests for the current project |

Each builder is based on an original project-level `flutter` command. The name is just **camelcased** to match builders' naming conventions.
Besides, the arguments accepted by each builder, are the same as the original `flutter` command they are based upon, encapsulated
under a generic `--args='...'` option.

For example:

`flutter gen-l10n --header "/// my header"` 👉🏾 `nx genL10n your-flutterapp --args='--header="/// my header"'`

> Note that the `flutter` command name has been camelcased for creating its `nx-flutter` command equivalent (`genL10n`)
> Note that the arguments of the `flutter` command are wrapped under `--args='...'` option in the equivalent `nx-flutter` command

## License

Copyright (c) 2021 Tine Kondo. Licensed under the MIT License (MIT)
