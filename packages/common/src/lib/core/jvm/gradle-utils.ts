import { Tree } from "@nrwl/devkit";

export const GRADLE_PLUGINS_REGEX = /(?:plugins\s*\{\s*)([^}]+)(?:\s*\})/g;
export const SPOTLESS_CONFIG_REGEX = /(?:(spotless|configure<com.diffplug.gradle.spotless.SpotlessExtension>)\s*\{\s*)([^}]+)(?:\s*\})/g;
export const GRADLE_PLUGIN_REGEX = /\s*(id|java|kotlin)(?:\s*\(?\s*['"]([^'"]+)['"]\s*\)?\s*(?:version\s+['"]([^'"]+)['"])?\s*(?:apply\s+(true|false))?)?/g;

export const SPOTLESS_GRADLE_PLUGIN_ID = 'com.diffplug.spotless';
export const SPOTLESS_GRADLE_PLUGIN_VERSION = '6.8.0';
export interface GradlePlugin {
    id: string;
    version?: string;
    kotlin?: boolean;
    java?: boolean;
    applied?: boolean;
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
            const applied = pluginMatches[4] ? pluginMatches[4] === 'true' : true;
            const kotlin = pluginMatches[1] === 'kotlin';
            const java = pluginMatches[1] === 'java';
            plugins.push({ id, version, kotlin, java, applied });
            pluginMatches = pluginRegExp.exec(pluginsContent);
        }
    }
    return plugins;
}

export function hasGradlePlugin(content: string, pluginId: string, pluginVersion?: string): boolean {
    const plugins = getGradlePlugins(content);
    return plugins.some(plugin => plugin.id === pluginId && (!pluginVersion || plugin.version === pluginVersion));
}

export function getGradlePlugin(content: string, pluginId: string): GradlePlugin {
    const plugins = getGradlePlugins(content);
    return plugins.find(plugin => plugin.id === pluginId);
}

export function disableGradlePlugin(tree: Tree, rootFolder: string, language: 'java' | 'kotlin' | 'groovy', pluginId: string, withKotlinDSL = language === 'kotlin') {
    const ext = withKotlinDSL ? '.gradle.kts' : '.gradle';
    const buildGradle = tree.read(`${rootFolder}/build${ext}`, 'utf-8');

    const plugin = getGradlePlugin(buildGradle, pluginId);
    if (plugin && plugin.applied) {
        const newBuildGradle = buildGradle.replace(GRADLE_PLUGINS_REGEX, (_match, content) => {
            const newContent = content.replace(GRADLE_PLUGIN_REGEX, (pluginMatch: string, _: string, id: string, ) => {
                if (id === pluginId) {
                    return `${pluginMatch.trimEnd()} apply false\n\t`;
                }
                return pluginMatch;
            });
            return `plugins {\n${newContent}\n}`;
        });
        tree.write(`${rootFolder}/build${ext}`, newBuildGradle);
        return true
    }

    return false;
}

export function addGradlePlugin(tree: Tree, rootFolder: string, language: 'java' | 'kotlin' | 'groovy', pluginId: string, pluginVersion?: string, withKotlinDSL = language === 'kotlin') {
    const ext = withKotlinDSL ? '.gradle.kts' : '.gradle';
    const buildGradle = tree.read(`${rootFolder}/build${ext}`, 'utf-8');
    let withVersion = '';
    if(pluginVersion) {
        withVersion = withKotlinDSL ? ` version "${pluginVersion}"` : ` version '${pluginVersion}'`;
    }
    const pluginToAdd = withKotlinDSL ? `id("${pluginId}")${withVersion}` : `id '${pluginId}'${withVersion}`;

    if (!hasGradlePlugin(buildGradle, pluginId)) {
        if (!GRADLE_PLUGINS_REGEX.test(buildGradle)) {
            const plugins = `plugins {\n\t${pluginToAdd}\n}\n`;
            tree.write(`${rootFolder}/build${ext}`, plugins + buildGradle);
        }
        else {
            const newBuildGradle = buildGradle.replace(GRADLE_PLUGINS_REGEX, (match, content) => {
                return `plugins {\n\t${content}\t${pluginToAdd}\n}`;
            });
            tree.write(`${rootFolder}/build${ext}`, newBuildGradle);
        }

        return true
    }

    return false;
}

function getGradleSpotlessBaseConfig(language: 'java' | 'kotlin' | 'groovy', languageConfig:string,  baseGitBranch?: string, withKotlinDSL = language === 'kotlin'): string {
    
    const ratchetFrom = baseGitBranch ? 
    `// optional: limit format enforcement to just the files changed by this feature branch
    ratchetFrom${withKotlinDSL ? `("${baseGitBranch}")`: ` '${baseGitBranch}'`}
    ` : '';

    return `
${withKotlinDSL ? 'configure<com.diffplug.gradle.spotless.SpotlessExtension>' : 'spotless'} {
    ${ratchetFrom}
    format${withKotlinDSL ? '("misc")': " 'misc',"} {
        // define the files to apply 'misc' to
        target${withKotlinDSL ? '("*.gradle.kts", "*.md", ".gitignore")': " '*.gradle', '*.md', '.gitignore'"}
    
        // define the steps to apply to those files
        trimTrailingWhitespace()
        indentWithTabs() // or spaces. Takes an integer argument if you don't like 4
        endWithNewline()
    }
    ${languageConfig}
}
`;
}

export function getGradleSpotlessConfig(language: 'java' | 'kotlin' | 'groovy', jdkVersion?: number, baseGitBranch?:string, withKotlinDSL = language === 'kotlin'): string {
   
    switch(language) {
        case 'java':
            return getGradleSpotlessBaseConfig(language,`
    java {// to customize, go to https://github.com/diffplug/spotless/tree/main/plugin-gradle#java

        target${withKotlinDSL ? '("src/*/java/**/*.java")': " 'src/*/java/**/*.java'"}

        // Use the default importOrder configuration
        importOrder()

        // Clean up
        removeUnusedImports()

        // Apply google-java-format formatter
        googleJavaFormat()
    }`, baseGitBranch, withKotlinDSL);
        case 'kotlin':
            return getGradleSpotlessBaseConfig(language,`
    kotlin { // to customize, go to https://github.com/diffplug/spotless/tree/main/plugin-gradle#kotlin

        ${jdkVersion && jdkVersion >= 11 ? '// Apply ktfmt formatter(similar to google-java-format, but for Kotlin)' : '// Apply ktlint formatter'}
        ${jdkVersion && jdkVersion >= 11 ? 'ktfmt()' : 'ktlint()'}
    }
    kotlinGradle {
        target${withKotlinDSL ? '("*.gradle.kts")': " '*.gradle.kts'"} // default target for kotlinGradle
        ${jdkVersion && jdkVersion >= 11 ? 'ktfmt()' : 'ktlint()'}
    }`, baseGitBranch, withKotlinDSL);
        case 'groovy':
            return getGradleSpotlessBaseConfig(language,`
    groovy {// to customize, go to https://github.com/diffplug/spotless/tree/main/plugin-gradle#groovy

        // Use the default importOrder configuration
        importOrder()

        // Clean up
        removeUnusedImports()

        // Apply groovy-eclipse formatter
        greclipse()
    }
    groovyGradle {
        target${withKotlinDSL ? '("*.gradle")': " '*.gradle'"} // default target of groovyGradle
        greclipse()
    }`, baseGitBranch, withKotlinDSL);
    }
}


export function applySpotlessGradlePlugin(tree: Tree, rootFolder:string, language: 'java' | 'kotlin' | 'groovy', jdkVersion?: number, gitBaseBranch?: string, withKotlinDSL = language === 'kotlin'):boolean {
    const ext = withKotlinDSL ? '.gradle.kts' : '.gradle';
    const buildGradle = tree.read(`${rootFolder}/build${ext}`, 'utf-8');

    if (!SPOTLESS_CONFIG_REGEX.test(buildGradle)) {
        const spotlessConfig = getGradleSpotlessConfig(language, jdkVersion, gitBaseBranch, withKotlinDSL);
        tree.write(`${rootFolder}/build${ext}`, buildGradle + spotlessConfig);
        return true;
    }

    return false;
}

export function addSpotlessGradlePlugin(tree: Tree, rootFolder:string, language: 'java' | 'kotlin' | 'groovy', jdkVersion?: number, gitBaseBranch?: string, withKotlinDSL = language === 'kotlin'):boolean {
    
    const added = addGradlePlugin(tree, rootFolder, language, SPOTLESS_GRADLE_PLUGIN_ID, SPOTLESS_GRADLE_PLUGIN_VERSION, withKotlinDSL);

    if(added) {
        applySpotlessGradlePlugin(tree, rootFolder, language, jdkVersion, gitBaseBranch, withKotlinDSL);
    }

    return added;
}

