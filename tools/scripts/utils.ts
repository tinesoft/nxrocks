import { workspaceRoot } from "@nx/devkit";
import { execFileSync } from "child_process";


const nx = require.resolve('nx');

export const execNx = (args: string[]) =>
  execFileSync(nx, args, {
    env: process.env,
    stdio: 'inherit',
    maxBuffer: 1024 * 1024 * 10,
    cwd: workspaceRoot,
  });
