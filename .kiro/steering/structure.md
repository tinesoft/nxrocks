# Project Structure & Organization

## Monorepo Layout

```
nxrocks/
├── packages/           # Library packages (libsDir)
├── e2e/               # E2E test applications (appsDir)
├── tools/             # Build and development scripts
└── images/            # Documentation assets
```

## Package Categories

### Core Libraries

- **common**: Shared utilities across all plugins
- **common-cli**: CLI-specific shared functionality
- **common-jvm**: JVM-specific shared utilities

### Nx Plugins

- **nx-spring-boot**: Spring Boot integration
- **nx-flutter**: Flutter development support
- **nx-quarkus**: Quarkus framework support
- **nx-micronaut**: Micronaut framework support
- **nx-melos**: Melos monorepo tool integration
- **nx-ktor**: Ktor framework support

### CLI Tools

- **create-nx-spring-boot**: Bootstrap Spring Boot workspaces
- **create-nx-flutter**: Bootstrap Flutter workspaces
- **create-nx-quarkus**: Bootstrap Quarkus workspaces
- **create-nx-micronaut**: Bootstrap Micronaut workspaces
- **create-nx-ktor**: Bootstrap Ktor workspaces

## Standard Package Structure

```
packages/[package-name]/
├── src/
│   ├── executors/         # Nx executors (build, test, run, etc.)
│   ├── generators/        # Code generators and schematics
│   ├── migrations/        # Migration scripts
│   ├── utils/            # Package-specific utilities
│   ├── core/             # Core functionality
│   ├── graph/            # Dependency graph plugins
│   └── index.ts          # Main export
├── testing/              # Test utilities (if applicable)
├── recipes/              # Recipe configurations (JVM plugins)
├── generators.json       # Generator definitions
├── executors.json        # Executor definitions
├── migrations.json       # Migration definitions
├── package.json
├── project.json          # Nx project configuration
├── tsconfig.lib.json     # TypeScript config for library
├── tsconfig.spec.json    # TypeScript config for tests
└── jest.config.ts        # Jest configuration
```

## E2E Test Structure

```
e2e/[plugin-name]-e2e/
├── tests/                # Test specifications
├── jest.config.ts        # Jest configuration
├── project.json          # Nx project configuration
└── tsconfig.spec.json    # TypeScript config
```

## Naming Conventions

- **Packages**: `@nxrocks/[name]` (scoped)
- **Executors**: Kebab-case (e.g., `build-image`, `check-format`)
- **Generators**: Kebab-case (e.g., `project`, `link`)
- **Files**: Kebab-case for configs, camelCase for TypeScript
- **Directories**: Kebab-case

## Configuration Files

- **generators.json**: Defines available generators with schemas
- **executors.json**: Defines available executors with implementations
- **migrations.json**: Defines migration scripts for version updates
- **project.json**: Nx-specific project configuration
- **package.json**: Standard npm package configuration with workspace dependencies
