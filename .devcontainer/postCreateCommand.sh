#!/bin/sh

# Install pnpm
npm install -g @pnpm/exe@8.3.1


# Make sure 'node' user can access the 'node_modules' folder that will be mounted as a volume
# https://code.visualstudio.com/remote/advancedcontainers/improve-performance#_use-a-targeted-named-volume
#sudo chown node node_modules

# Install dependencies
pnpm install
