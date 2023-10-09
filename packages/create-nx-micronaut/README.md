# create-nx-micronaut 

[![npm version](https://img.shields.io/npm/v/@nxrocks/create-nx-micronaut?style=flat-square)](https://www.npmjs.com/package/@nxrocks/create-nx-micronaut)
[![github action - release](https://img.shields.io/github/actions/workflow/status/tinesoft/nxrocks/release.yml?label=release&style=flat-square)](https://github.com/tinesoft/nxrocks/actions?query=workflow%3ARelease)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)

> Our very own **CLI** to create [Nx](https://nx.dev) workspaces with built-in support for [Micronaut](https://micronaut.io)!

<p align="center"><img src="https://raw.githubusercontent.com/tinesoft/nxrocks/master/images/create-nx-micronaut.png" width="450"></p>

The goal of this CLI is to ease the process of creating a Nx workspace that can host and manage Micronaut projects, thanks to our [@nxrocks/nx-micronaut](https://github.com/tinesoft/nxrocks/blob/develop/packages/nx-micronaut) plugin, that is automatically installed within it.

##  Prerequisites

To run this CLI, all you need is to have [NodeJS](https://nodejs.org/en/download) installed (preferably the current LTS version).
Then to later create and run your Micronaut projets, you'll need a Java Runtime as well.

- **NodeJS** (preferably latest or LTS version) in path
- **JRE** or **JDK** in path

## Getting Started

Run `npx create-nx-micronaut your-workspace-name` to execute the CLI.

This command will guide you through the creation process steps by steps.

## Options

Run `npx create-nx-micronaut --help` to print some helpful info on available options.


## License

Copyright (c) 2023-present Tine Kondo. Licensed under the MIT License (MIT)

