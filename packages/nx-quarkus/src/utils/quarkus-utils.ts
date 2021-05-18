import { logger } from '@nrwl/devkit'
import { fileExists } from '@nrwl/workspace/src/utils/fileutils';
import { execSync, spawnSync } from 'child_process'
import { BuildCommandAliasType, BuildCore } from '../core/build-core.class';
import { GradleBuild } from '../core/gradle-build.class';
import { MavenBuild } from '../core/maven-build.class';
import { NormalizedSchema } from '../generators/project/schema';


export function determineBuildSystem(cwd: string): BuildCore {
    if (fileExists(`${cwd}/pom.xml`))
        return new MavenBuild();

    if (fileExists(`${cwd}/build.gradle`) || fileExists(`${cwd}/build.gradle.kts`))
        return new GradleBuild();

    throw new Error(`Cannot determine the build system. No 'pom.xml' nor 'build.gradle' file found under '${cwd}'`);
}

export function getPackageLatestNpmVersion(pkg: string): string {
    try {
        return spawnSync(`npm show ${pkg} version`, { shell: false}).toString().trim() || 'latest';
    } catch (e) {
        return 'latest';
    }
}

export function runQuarkusPluginCommand(
    commandAlias: BuildCommandAliasType,
    params: string[],
    options: { cwd?: string; ignoreWrapper?: boolean } = { ignoreWrapper: false },
): { success: boolean } {
    // Take the parameters or set defaults
    const cwd = options.cwd || process.cwd();
    const buildSystem = determineBuildSystem(cwd);
    const executable = buildSystem.getExecutable(options.ignoreWrapper);
    const command = buildSystem.getCommand(commandAlias);

    // Create the command to execute
    const execute = `${executable} ${command} ${(params || []).join(' ')}`

    try {
        logger.info(`Executing command: ${execute}`);
        execSync(execute, { cwd, stdio: [0, 1, 2] });
        return { success: true };
    } catch (e) {
        logger.error(`Failed to execute command: ${execute}`);
        logger.error(e);
        return { success: false };
    }
}


export function buildQuarkusDownloadUrl(options: NormalizedSchema) {
    const params = [
        { key: 'b', value: options.buildSystem },
        { key: 'g', value: options.groupId },
        { key: 'a', value: options.artifactId },
        { key: 'v', value: options.version },
        { key: 'ne', value: options.skipCodeSamples },
    ].filter( e => typeof e.value !== 'undefined');

    const extensions = options.projectExtensions.map(ext => `e=${ext.replace('io.quarkus:quarkus-', '')}`).join('&');
    const queryParams = params.map(e => `${e.key}=${e.value}`).join('&').concat(...(extensions?.length ? ['&',extensions]: []));

    return `${options.quarkusInitializerUrl}/d?${queryParams}`;
}

