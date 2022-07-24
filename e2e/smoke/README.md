# Smoke

## What

The tests in this project should test very similar things to e2e-core, with the main difference being that the nx workspace is created through `npx create-nx-workspace ...` and we do not utilize the e2e utils from nx-plugin.

## Why

Testing this way allows us to detect breakage due to a new version of Nx or of the plugins themselves.