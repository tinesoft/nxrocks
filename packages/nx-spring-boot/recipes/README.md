# Recipes

Some helpful recipes to help you best use the plugin.

## Adding Spring Boot dependencies

When running the `@nxrocks/nx-spring-boot:project` generator from a non-interactive mode (like from `Nx Console`), we cannot automatically fetch and present to you, the list
of `Spring Boot` dependencies (as we do in interactive, CLI mode). This is due to a limitation in Nx API, which does not support (yet?), such asynchronous prompts.

You will need to fetch and enter the dependencies ids manually:

1. Go to [https://start.spring.io/dependencies](https://start.spring.io/dependencies)
2. Look for the `"dependencies"` section of the  output JSON
![Extract of Spring Boot dependencies](images/boot-dependencies-list.png)

> * Each `key` in this section, is the "id" of a Spring Boot dependency
> * For example, `web` for `spring-boot-starter-web`, `actuator` for `spring-boot-starter-actuator`, etc.

3. In Nx Console UI, enter the dependencies ids you want to use, separated by a comma
![Adding dependencies in Nx Console](images/nx-console-add-dependencies.png)
