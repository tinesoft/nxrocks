import { BuilderContext } from '@angular-devkit/architect'
import { Tree, SchematicContext } from '@angular-devkit/schematics';
import fetch from 'node-fetch';
import { escape } from 'querystring'
import { execSync } from 'child_process'
import { Extract } from 'unzipper';
import { BuildCommandAliasType, BuildCore } from '../core/build-core.class';
import { GradleBuild } from '../core/gradle-build.class';
import { MavenBuild } from '../core/maven-build.class';
import { NormalizedSchema } from '../schematics/application/schema';
import { fileExists } from '@nrwl/workspace/src/utils/fileutils';


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
    context: BuilderContext,
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


export function buildBootDownloadUrl(options: NormalizedSchema) {
    const params = [
        { key: 'type', value: options.type },
        { key: 'language', value: options.language },
        { key: 'name', value: options.name },
        { key: 'groupId', value: options.groupId },
        { key: 'artifactId', value: options.artifactId },
        { key: 'version', value: options.version },
        { key: 'packageName', value: options.packageName },
        { key: 'javaVersion', value: options.javaVersion },
        { key: 'packaging', value: options.packaging },
        { key: 'dependencies', value: options.dependencies },
        { key: 'description', value: options.description ? escape(options.description) : null },
        { key: 'bootVersion', value: options.bootVersion },
    ].filter(e => !!e.value);

    const queryParams = params.map(e => `${e.key}=${e.value}`).join('&');

    return `${options.springInitializerUrl}/starter.zip?${queryParams}`;
}

export async function generateBootProject(options: NormalizedSchema, tree: Tree, context: SchematicContext): Promise<void> {
    const downloadUrl = this.buildBootDownloadUrl(options);

    context.logger.info(`Downloading Spring Boot project zip from : ${downloadUrl}...`);

    const pkg = '@nxrocks/nx-spring-boot';
    const pkgVersion = getPackageLatestNpmVersion(pkg);
    const userAgent = `@nxrocks_nx-spring-boot/${pkgVersion}`;
    const opts = {
        headers: {
            'User-Agent': userAgent
        }
    }
    const response = await fetch(downloadUrl, opts);

    context.logger.info(`Extracting Spring Boot project zip to : ${options.projectRoot}...`);

    return response.body.pipe(Extract({ path: options.projectRoot })).promise();
    /*
    return response.body.pipe(Parse({forceStream: true}))
        .on('entry', async (entry: Entry)=>{
            if( entry.type === 'Directory'){
                return entry.autodrain();
            }

            const fileName = entry.path;
            const fileContent = await entry.buffer();
            context.logger.info(`Processing zip file entry '${fileName}'...`);
            tree.create(`${options.projectRoot}/${fileName}`, fileContent);
            // entry.pipe(process.stdout);
        })
        .promise();
    */
}

