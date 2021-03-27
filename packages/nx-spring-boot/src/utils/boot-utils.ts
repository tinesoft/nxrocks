import { logger } from '@nrwl/devkit'
import { fileExists } from '@nrwl/workspace/src/utils/fileutils';
import { escape } from 'querystring'
import { execSync } from 'child_process'
import { BuildCommandAliasType, BuildCore } from '../core/build-core.class';
import { GradleBuild } from '../core/gradle-build.class';
import { MavenBuild } from '../core/maven-build.class';
import { NormalizedSchema } from '../generators/application/schema';


export function determineBuildSystem(cwd: string): BuildCore {
    if (fileExists(`${cwd}/pom.xml`))
        return new MavenBuild();

    if (fileExists(`${cwd}/build.gradle`) || fileExists(`${cwd}/build.gradle.kts`))
        return new GradleBuild();

    throw new Error(`Cannot determine the build system. No 'pom.xml' nor 'build.gradle' file found under '${cwd}'`);
}

export function getPackageLatestNpmVersion(pkg: string): string {
    try {
        return execSync(`npm show ${pkg} version`).toString().trim() || 'latest';
    } catch (e) {
        return 'latest';
    }
}

export function runBootPluginCommand(
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


export function buildBootDownloadUrl(options: NormalizedSchema) {
    const params = [
        { key: 'type', value: options.buildSystem },
        { key: 'language', value: options.language },
        { key: 'name', value: options.name },
        { key: 'groupId', value: options.groupId },
        { key: 'artifactId', value: options.artifactId },
        { key: 'version', value: options.version },
        { key: 'packageName', value: options.packageName },
        { key: 'javaVersion', value: options.javaVersion },
        { key: 'packaging', value: options.packaging },
        { key: 'dependencies', value: options.projectDependencies },
        { key: 'description', value: options.description ? escape(options.description) : null },
        { key: 'bootVersion', value: options.bootVersion },
    ].filter(e => !!e.value);

    const queryParams = params.map(e => `${e.key}=${e.value}`).join('&');

    return `${options.springInitializerUrl}/starter.zip?${queryParams}`;
}

