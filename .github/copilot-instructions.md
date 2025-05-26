# Copilot Instructions for nxrocks

## Big Picture

- **Monorepo managed by Nx (v21+) and Bun.**  
  Nx plugins extend support for JVM (Spring Boot, Quarkus, Micronaut, Ktor), Flutter/Dart (Flutter, Melos), and cross-language monorepos.
- **Plugin Architecture:**  
  Each plugin (`packages/nx-*`) has its own generators, executors, and utilities. Shared code lives in `packages/common` and `packages/common-jvm`.
- **E2E Testing:**  
  Each plugin has a matching e2e project in `e2e/`. Smoke tests (`e2e/smoke`) validate workspace creation and plugin compatibility with new Nx versions.
- **Custom CLIs:**  
  `create-nx-*` CLIs (see `packages/create-nx-*`) bootstrap Nx workspaces with pre-installed plugins and required runtime dependencies.

## Developer Workflows

- **Build:**  
  `bun nx build <project>` or `nx build <project>`
- **Test:**  
  `bun nx test <project>` or `nx test <project>`
- **Lint:**  
  `bun nx lint <project>`
- **Format:**  
  Use `nx run <project>:format` or `nx apply-format <project>` (not `nx format <project>`, which is reserved by Nx CLI)
- **Generate:**  
  `nx generate @nxrocks/<plugin>:new ...` for new projects
- **Dependency Graph:**  
  `nx graph` or `nx dep-graph` visualizes cross-language dependencies
- **CI:**  
  Nx Cloud is used for distributed caching and CI. Wrapper scripts for Maven/Gradle/Flutter are preferred.

## Project-Specific Conventions

- **Executors:**  
  Plugins map Nx targets to native build tools (e.g., `build` → `mvnw package` or `gradlew build`).  
  Always use project-local wrappers (`./mvnw`, `./gradlew`) unless `--ignoreWrapper` is specified.
- **Task Dependencies:**  
  Build/test tasks auto-install dependent libraries via the `install` target.
- **Formatting:**  
  JVM projects use [Spotless](https://github.com/diffplug/spotless).
- **Multi-module Support:**  
  Plugins support multi-module projects for Maven/Gradle.
- **Proxy Support:**  
  Plugins respect `http_proxy`/`https_proxy` environment variables for API calls to project generators.
- **Melos Integration:**  
  For Dart/Flutter monorepos, root-level NPM scripts (e.g., `melos-bootstrap`, `melos-clean`) run Melos commands via Nx.

## Integration Points

- **Spring Initializr, Quarkus, Micronaut, Ktor:**  
  Generators fetch starter projects from official APIs.
- **Flutter, Melos:**  
  See `nx-flutter`, `nx-melos` and root `package.json` scripts for Dart/Flutter workflows.
- **Nx Cloud:**  
  Used for caching and CI. See `nx.json` for configuration.

## Examples

- Generate a Spring Boot app:  
  `nx generate @nxrocks/nx-spring-boot:new my-app --projectType application`
- Build a Quarkus app:  
  `nx build my-quarkus-app`
- Format a Micronaut app:  
  `nx run my-micronaut-app:format`
- Run Melos bootstrap:  
  `npx nx melos-bootstrap --since=main`

## References

- See each plugin's `README.md` for detailed options and usage.
- E2E test specs in `e2e/<plugin>-e2e/tests/` show real workflows and edge cases.
- For advanced Nx usage, see `nx.json`, `project.json`, and `tools/`.

---

**Feedback requested:**  
Are any sections unclear, missing, or too generic? Let me know what needs refinement or if you want deeper coverage of any workflow, plugin, or integration.
