#!/bin/sh

# Install/Activate PNPM version defined in root package.json
corepack enable pnpm


# Make sure 'node' user can access the 'node_modules' folder that will be mounted as a volume
# https://code.visualstudio.com/remote/advancedcontainers/improve-performance#_use-a-targeted-named-volume
#sudo chown node node_modules

# Install dependencies
pnpm install --frozen-lockfile
