#!/bin/bash

# Installing Bun
echo "⚙️ Installing bun..."
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc

# Adding Bun to path (for current session)
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

# Install NPM dependencies
echo "⚙️ Installing NPM dependencies..."
bun install --frozen-lockfile