# Recipes

Some helpful recipes to help you best use the plugin.

## Adding Micronaut features

When running the `@nxrocks/nx-micronaut:project` generator from a non-interactive mode (like from `Nx Console`), we cannot automatically fetch and present to you, the list
of `Micronaut` features (as we do in interactive, CLI mode). This is due to a limitation in Nx API, which does not support (yet?), such asynchronous prompts.

You will need to fetch and enter the features ids manually:

1. Go to [https://code.micronaut.io/api/features](https://code.micronaut.io/api/features)
2. Look for the `"features"` section of the  output JSON

![Extract of Micronaut features](images/micronaut-features-list.png)

> * Each `name` is the "id" of a Micronaut feature

3. In Nx Console UI, enter the features ids you want to use, separated by a comma
![Adding features in Nx Console](images/nx-console-add-features.png)

## Creating multi-modules Micronaut projects

The support for creating multi-module Micronaut project with either `Maven` or `Gradle` was added to the plugin since `v6.1.0`.

When generating a new project, you can now choose either to:

* Transform the project being generated into a multi-module project by setting `transformIntoMultiModule` to `true` and by providing the name of the parent module to create on top of the child project, via `parentModuleName` option.
* Add the project being generated into an existing multi-module project by setting `addToExistingParentModule` to `true` and by providing the name of the parent module to add the child project too.

> **Note** When running the `@nxrocks/nx-micronaut:project` generator in **interactive mode** (i.e via command line),
> we can automatically analyze your workspace and prompt for the appropriate above options to add multi-module support.
