#!/usr/bin/env bash

set -euo pipefail

# Create new workspace in current directory (create subdirectory)
bunx create-nx-workspace@latest nxrocks-new --pm=bun --nxCloud=github --workspaces=true --useProjectjson=true  --bundler=tsc --formatter=prettier

cd nxrocks-new

bun nx add @nx/plugin 

# Generate plugins (will also generate <plugin>-e2e in packages/)
bunx nx g @nx/plugin:plugin --directory=packages/nx-flutter --importPath=@nxrocks/nx-flutter --linter=eslint --name=nx-flutter --unitTestRunner=jest --e2eTestRunner=jest --publishable=true --useProjectJson=true --compiler=tsc
bunx nx g @nx/plugin:plugin --directory=packages/nx-ktor --importPath=@nxrocks/nx-ktor --linter=eslint --name=nx-ktor --unitTestRunner=jest --e2eTestRunner=jest --publishable=true --useProjectJson=true --compiler=tsc
bunx nx g @nx/plugin:plugin --directory=packages/nx-melos --importPath=@nxrocks/nx-melos --linter=eslint --name=nx-melos --unitTestRunner=jest --e2eTestRunner=jest --publishable=true --useProjectJson=true --compiler=tsc
bunx nx g @nx/plugin:plugin --directory=packages/nx-micronaut --importPath=@nxrocks/nx-micronaut --linter=eslint --name=nx-micronaut --unitTestRunner=jest --e2eTestRunner=jest --publishable=true --useProjectJson=true --compiler=tsc
bunx nx g @nx/plugin:plugin --directory=packages/nx-quarkus --importPath=@nxrocks/nx-quarkus --linter=eslint --name=nx-quarkus --unitTestRunner=jest --e2eTestRunner=jest --publishable=true --useProjectJson=true --compiler=tsc
bunx nx g @nx/plugin:plugin --directory=packages/nx-spring-boot --importPath=@nxrocks/nx-spring-boot --linter=eslint --name=nx-spring-boot --unitTestRunner=jest --e2eTestRunner=jest --publishable=true --useProjectJson=true --compiler=tsc

# Move generated <plugin>-e2e projects to e2e/ using Nx generator
bunx nx g @nx/workspace:move --projectName=nx-flutter-e2e --destination=e2e/nx-flutter-e2e
bunx nx g @nx/workspace:move --projectName=nx-ktor-e2e --destination=e2e/nx-ktor-e2e
bunx nx g @nx/workspace:move --projectName=nx-melos-e2e --destination=e2e/nx-melos-e2e
bunx nx g @nx/workspace:move --projectName=nx-micronaut-e2e --destination=e2e/nx-micronaut-e2e
bunx nx g @nx/workspace:move --projectName=nx-quarkus-e2e --destination=e2e/nx-quarkus-e2e
bunx nx g @nx/workspace:move --projectName=nx-spring-boot-e2e --destination=e2e/nx-spring-boot-e2e

# Continue with libraries and create-* packages as before
bunx nx g @nx/js:library --directory=packages/common --importPath=@nxrocks/common --linter=eslint --name=common --publishable=true --unitTestRunner=jest --useProjectJson=true --bundler=tsc
bunx nx g @nx/js:library --directory=packages/common-cli --importPath=@nxrocks/common-cli --linter=eslint --name=common-cli --publishable=true --unitTestRunner=jest --useProjectJson=true --bundler=tsc
bunx nx g @nx/js:library --directory=packages/common-jvm --importPath=@nxrocks/common-jvm --linter=eslint --name=common-jvm --publishable=true --unitTestRunner=jest --useProjectJson=true --bundler=tsc

bunx nx g @nx/plugin:create-package --directory=packages/create-nx-flutter --name=create-nx-flutter --project=nx-flutter --e2eProject=nx-flutter-e2e --linter=eslint --unitTestRunner=jest --useProjectJson=true --compiler=tsc
bunx nx g @nx/plugin:create-package --directory=packages/create-nx-ktor --name=create-nx-ktor --project=nx-ktor --e2eProject=nx-ktor-e2e --linter=eslint --unitTestRunner=jest --useProjectJson=true --compiler=tsc
bunx nx g @nx/plugin:create-package --directory=packages/create-nx-micronaut --name=create-nx-micronaut --project=nx-micronaut --e2eProject=nx-micronaut-e2e --linter=eslint --unitTestRunner=jest --useProjectJson=true --compiler=tsc
bunx nx g @nx/plugin:create-package --directory=packages/create-nx-quarkus --name=create-nx-quarkus --project=nx-quarkus --e2eProject=nx-quarkus-e2e --linter=eslint --unitTestRunner=jest --useProjectJson=true --compiler=tsc
bunx nx g @nx/plugin:create-package --directory=packages/create-nx-spring-boot --name=create-nx-spring-boot --project=nx-spring-boot --e2eProject=nx-spring-boot-e2e --linter=eslint --unitTestRunner=jest --useProjectJson=true --compiler=tsc

# Manually generate and move any additional e2e or app projects as needed
bunx nx g @nx/js:library --directory=e2e/smoke --linter=eslint --name=smoke --unitTestRunner=jest --useProjectJson=true --bundler=tsc