#!/bin/sh

# Uninstall globally installed PNPM (required version will be reinstalled through corepack)
echo "❌ Uninstalling globally installed PNPM..."
npm uninstall -g pnpm

# Prevent corepack from prompting user before downloading PNPM 
export COREPACK_ENABLE_DOWNLOAD_PROMPT=0

# Enable corepack 
corepack enable 

# Install the PNPM version defined in the root package.json
echo "⚙️ Installing required PNPM version..."
corepack prepare --activate

# Install NPM dependencies
echo "⚙️ Installing NPM dependencies..."
pnpm install --frozen-lockfile
