# Recipes

Some helpful recipes to help you best use the plugin.

## Adding Quarkus extensions

When running the `@nxrocks/nx-quarkus:project` generator from a non-interactive mode (like from `Nx Console`), we cannot automatically fetch and present to you, the list
of `Quarkus` extensions (as we do in interactive, CLI mode). This is due to a limitation in Nx API, which does not support (yet?), such asynchronous prompts.

You will need to fetch and enter the extensions ids manually:

1. Go to [https://code.quarkus.io/api/extensions](https://code.quarkus.io/api/extensions)
![Extract of Quarkus extensions](images/quarkus-extensions-list.png)

> * Each `id` or `shortName`(when not empty) is the "id" of a Quarkus extension
> * For example, `resteasy-reactive` for `io.quarkus:quarkus-resteasy-reactive`, `io.quarkus:quarkus-rest-client-reactive-jsonb` for `io.quarkus:quarkus-rest-client-reactive-jsonb`, etc.

2. In Nx Console UI, enter the extensions ids you want to use, separated by a comma
![Adding extensions in Nx Console](images/nx-console-add-extensions.png)
