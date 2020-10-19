import { BuilderContext } from '@angular-devkit/architect'
import { execSync } from 'child_process'
import { BuildCommandAliasType, BuildCore } from '../core/build-core.class';
import { GradleBuild } from '../core/gradle-build.class';
import { MavenBuild } from '../core/maven-build.class';

const isWin = process.platform === "win32";

export function determineBuildSystem(cwd: string): BuildCore {
    try {
        execSync(`./mvnw${isWin ? '.cmd' : ''} --version`, {
            cwd,
            stdio: ['ignore', 'ignore', 'ignore'],
        });
        return new MavenBuild();
    } catch (e) {
        return new GradleBuild();
    }
}

export function runBootPluginCommand(
    context: BuilderContext,
    commandAlias: BuildCommandAliasType,
    params: string[],
    options: { cwd?: string; cmd?: string } = {},
): { success: boolean } {
    // Take the parameters or set defaults
    const cwd = options.cwd || process.cwd();
    const buildSystem = determineBuildSystem(cwd);
    const executable = options.cmd || buildSystem.getExecutable();
    const command = buildSystem.getCommand(commandAlias);

    // Create the command to execute
    const execute = `${executable} ${command} ${params.join(' ')}`

    try {
        context.logger.info(`Executing command: ${execute}`);
        execSync(execute, { cwd, stdio: [0, 1, 2] });
        return { success: true };
    } catch (e) {
        context.logger.error(`Failed to execute command: ${execute}`, e);
        return { success: false };
    }
}

