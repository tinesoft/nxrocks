# Technology Stack & Build System

## Build System

- **Primary**: Nx monorepo with Bun as package manager
- **TypeScript**: ES2022 target with Node.js Next module resolution
- **Bundler**: SWC for fast TypeScript compilation
- **Testing**: Jest with parallel execution
- **Linting**: ESLint with Nx flat config
- **Formatting**: Prettier
- **CI/CD**: Semantic release with independent package versioning

## Key Dependencies

- **@nx/devkit**: Core Nx development toolkit
- **@swc/core**: Fast TypeScript/JavaScript compiler
- **enquirer**: Interactive CLI prompts
- **node-fetch**: HTTP client for API calls
- **js-yaml**: YAML parsing for configuration
- **xmlbuilder2**: XML generation for build files

## Common Commands

### Development

```bash
# Build all packages
bun build

# Run tests
bun test

# Run linting
bun lint

# Run e2e tests
bun e2e

# Format code
bun format
```

### Nx-specific

```bash
# Build affected packages
bun affected:build

# Test affected packages
bun affected:test

# View dependency graph
bun graph

# Run specific target for all packages
bunx nx run-many --target build --parallel 4
```

### Local Development

```bash
# Start local registry for testing
bun start-local-registry

# Populate local registry with built packages
bunx nx populate-local-registry

# Run smoke tests
bun smoke
```

## Package Structure

- All packages follow `@nxrocks/*` scoping
- Independent versioning with semantic-release
- Workspace protocol for internal dependencies (`workspace:*`)
- ESM modules with TypeScript declaration maps
