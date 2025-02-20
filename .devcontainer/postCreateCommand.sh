#!/bin/bash

# Installing Bun
echo "⚙️ Installing bun..."
curl -fsSL https://bun.sh/install | bash


# Adding Bun to path
echo 'export PATH="$HOME/.bun/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Install NPM dependencies
echo "⚙️ Installing NPM dependencies..."
bun install --frozen-lockfile
