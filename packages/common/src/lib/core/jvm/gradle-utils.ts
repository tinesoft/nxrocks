import { Tree } from "@nrwl/devkit";

export const GRADLE_PLUGINS_REGEX = /(?:plugins\s*\{\s*)([^}]+)(?:\s*\})/g;

export const SPOTLESS_CONFIG_REGEX = /(?:spotless\s*\{\s*)([^}]+)(?:\s*\})/g;

export const GRADLE_PLUGIN_REGEX = /\s*(id|kotlin)\s*\(?\s*['"]([^'"]+)['"]\s*\)?\s*(?:version\s+['"]([^'"]+)['"])?/g;

export interface GradlePlugin {
    id: string;
    version?: string;
    kotlin: boolean;
}

export function getGradlePlugins(content: string): GradlePlugin[] {
    const plugins = [];
    const pluginsContent = new RegExp(GRADLE_PLUGINS_REGEX).exec(content)?.[1];
    if (pluginsContent) {
        const pluginRegExp = new RegExp(GRADLE_PLUGIN_REGEX);
        let pluginMatches = pluginRegExp.exec(pluginsContent);
        while (pluginMatches) {
            const id = pluginMatches[2];
            const version = pluginMatches[3];
            const kotlin = pluginMatches[1] === 'kotlin';
            plugins.push({ id, version, kotlin });
            pluginMatches = pluginRegExp.exec(pluginsContent);
        }
    }
    return plugins;
}

export function hasGradlePlugin(content: string, pluginId: string, pluginVersion?: string): boolean {
    const plugins = getGradlePlugins(content);
    return plugins.some(plugin => plugin.id === pluginId && (!pluginVersion || plugin.version === pluginVersion));
}

export function addGradlePlugin(tree: Tree, language: 'java' | 'kotlin' | 'groovy', pluginId: string, pluginVersion: string) {
    const ext = language === 'kotlin' ? '.gradle.kts' : '.gradle';
    const buildGradle = tree.read(`build${ext}`, 'utf-8');
    const pluginToAdd = language === 'kotlin' ? `id("${pluginId}") version "${pluginVersion}"` : `id '${pluginId}' version '${pluginVersion}'`;

    if (!hasGradlePlugin(buildGradle, pluginId)) {
        if (!GRADLE_PLUGINS_REGEX.test(buildGradle)) {
            const plugins = `plugins {\n\t${pluginToAdd}\n}\n`;
            tree.write(`build${ext}`, plugins + buildGradle);
        }
        else {
            const newBuildGradle = buildGradle.replace(GRADLE_PLUGINS_REGEX, (match, content) => {
                return `plugins {\n\t${content}\t${pluginToAdd}\n}`;
            });
            tree.write(`build${ext}`, newBuildGradle);
        }

        return true
    }

    return false;
}

function getGradleSpotlessBaseConfig(language: 'java' | 'kotlin' | 'groovy', languageConfig:string,  baseGitBranch?: string): string {
    
    const ratchetFrom = baseGitBranch ? 
    `// optional: limit format enforcement to just the files changed by this feature branch
    ratchetFrom "${baseGitBranch}"
    ` : '';

    return `
${language === 'kotlin' ? 'configure<com.diffplug.gradle.spotless.SpotlessExtension> {' : 'spotless'} {
    ${ratchetFrom}
    format 'misc', {
        // define the files to apply 'misc' to
        target '*.gradle${language === 'kotlin' ? '.kts': ''}', '*.md', '.gitignore'
    
        // define the steps to apply to those files
        trimTrailingWhitespace()
        indentWithTabs() // or spaces. Takes an integer argument if you don't like 4
        endWithNewline()
    }
    ${languageConfig}
}
`;
}

export function getGradleSpotlessConfig(language: 'java' | 'kotlin' | 'groovy', jdkVersion?: number, baseGitBranch?:string): string {
   
    switch(language) {
        case 'java':
            return getGradleSpotlessBaseConfig(language,`
    java {// to customize, go to https://github.com/diffplug/spotless/tree/main/plugin-gradle#java

        target 'src/*/java/**/*.java'

        // Use the default importOrder configuration
        importOrder()

        // Clean up
        removeUnusedImports()
        removeUnusedLocalVariables()
        removeUnusedParameters()
        removeUnusedThrows()

        // Apply google-java-format formatter
        googleJavaFormat()

    }`, baseGitBranch);
        case 'kotlin':
            return getGradleSpotlessBaseConfig(language,`
    kotlin { // to customize, go to https://github.com/diffplug/spotless/tree/main/plugin-gradle#kotlin 
        // Use the default importOrder configuration
        importOrder()

        // Clean up
        removeUnusedImports()
        removeUnusedLocalVariables()
        removeUnusedParameters()
        removeUnusedThrows()

        ${jdkVersion && jdkVersion >= 11 ? '// Apply ktfmt formatter(similar to google-java-format, but for Kotlin)' : '// Apply ktlint formatter'}
        ${jdkVersion && jdkVersion >= 11 ? 'ktfmt()' : 'ktlint()'}

    }
    kotlinGradle {
        target '*.gradle.kts' // default target for kotlinGradle
        ${jdkVersion && jdkVersion >= 11 ? 'ktfmt()' : 'ktlint()'}
    }`, baseGitBranch);
        case 'groovy':
            return getGradleSpotlessBaseConfig(language,`
    groovy {// to customize, go to https://github.com/diffplug/spotless/tree/main/plugin-gradle#groovy

        // Use the default importOrder configuration
        importOrder()

        // Clean up
        removeUnusedImports()
        removeUnusedLocalVariables()
        removeUnusedParameters()
        removeUnusedThrows()

        // Apply groovy-eclipse formatter
        greclipse()

    }
    groovyGradle {
        target '*.gradle' // default target of groovyGradle
        greclipse()
    }`, baseGitBranch);
    }
}


export function applySpotlessGradlePlugin(tree: Tree, language: 'java' | 'kotlin' | 'groovy', jdkVersion?: number, gitBaseBranch?: string):boolean {
    const ext = language === 'kotlin' ? '.gradle.kts' : '.gradle';
    const buildGradle = tree.read(`build${ext}`, 'utf-8');

    if (!SPOTLESS_CONFIG_REGEX.test(buildGradle)) {
        const spotlessConfig = getGradleSpotlessConfig(language, jdkVersion, gitBaseBranch);
        tree.write(`build${ext}`, buildGradle + spotlessConfig);
        return true;
    }

    return false;
}
