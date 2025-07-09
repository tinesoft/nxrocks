import { ExecutorContext } from '@nx/devkit';
import { execSync } from 'child_process';

export interface IonicExecutorOptions {
  command: string;
  cwd?: string;
  args?: string[];
}

export default async function ionicExecutor(
  options: IonicExecutorOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  try {
    const cmd = [options.command, ...(options.args || [])].join(' ');
    execSync(cmd, { stdio: 'inherit', cwd: options.cwd || context.root });
    return { success: true };
  } catch {
    return { success: false };
  }
}
