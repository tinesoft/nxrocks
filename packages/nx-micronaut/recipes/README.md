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
