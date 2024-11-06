# create-nx-spring-boot

[![npm version](https://img.shields.io/npm/v/create-nx-spring-boot?style=flat-square)](https://www.npmjs.com/package/create-nx-spring-boot)
[![github action - release](https://img.shields.io/github/actions/workflow/status/tinesoft/nxrocks/release.yml?label=release&style=flat-square)](https://github.com/tinesoft/nxrocks/actions?query=workflow%3ARelease)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)

> Our very own **CLI** to create [Nx](https://nx.dev) workspaces with built-in support for [Spring Boot](https://spring.io/projects/spring-boot)!

<p align="center"><img src="https://raw.githubusercontent.com/tinesoft/nxrocks/master/images/create-nx-spring-boot.png" width="680"></p>

The goal of this CLI is to ease the process of creating a Nx workspace that can host and manage Spring Boot projects, thanks to our [@nxrocks/nx-spring-boot](https://github.com/tinesoft/nxrocks/blob/develop/packages/nx-spring-boot) plugin, that is automatically installed within it.

## Prerequisites

To run this CLI, all you need is to have [NodeJS](https://nodejs.org/en/download) installed (preferably the current LTS version).
Then to later create and run your Spring Boot projets, you'll need a Java Runtime as well.

- **NodeJS** (preferably latest or LTS version) in path
- **JRE** or **JDK** in path

## Getting Started

Run `npx create-nx-spring-boot your-workspace-name` to execute the CLI.

This command will guide you through the creation process steps by steps.

## Options

Run `npx create-nx-spring-boot --help` to print some helpful info on available options.

## Compatibility with Nx

Every Nx package relies on the underlying Nx Workspace/DevKit it runs on. This table provides the compatibility matrix between major versions of Nx workspace and this package.

| Package Version | Nx Workspace version |
| --------------- | -------------------- |
| `>=v4.0.0`      | `>=v20.0.0`          |
| `>=v3.0.0`      | `>=v17.3.0`          |
| `<v3.0.0`       | `<17.3.0`            |

## License

Copyright (c) 2023-present Tine Kondo. Licensed under the MIT License (MIT)
