import { Tree } from '@nx/devkit';
import { checkProjectFileContains, getGradleBuildFilesExtension, getGradleBuildFilesExtensionInTree, hasGradleSettingsFile, isGradleProjectSettingsInTree as hasGradleProjectSettingsInTree } from './utils';
import { fileExists } from '@nx/workspace/src/utilities/fileutils';
import { resolve } from 'path';
import { getProjectFileContent } from '@nxrocks/common';

export const GRADLE_PLUGINS_REGEX = /(?:plugins\s*\{\s*)([^}]+)(?:\s*\})/g;
export const SPOTLESS_CONFIG_REGEX =
  /(?:(spotless|configure<com.diffplug.gradle.spotless.SpotlessExtension>)\s*\{\s*)([^}]+)(?:\s*\})/g;
export const GRADLE_PLUGIN_REGEX =
  /\s*(id|java|kotlin)(?:\s*\(?\s*['"]([^'"]+)['"]\s*\)?\s*(?:version\s+['"]([^'"]+)['"])?\s*(?:apply\s+(true|false))?)?/g;

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

export function hasGradlePlugin(
  content: string,
  pluginId: string,
  pluginVersion?: string
): boolean {
  const plugins = getGradlePlugins(content);
  return plugins.some(
    (plugin) =>
      plugin.id === pluginId &&
      (!pluginVersion || plugin.version === pluginVersion)
  );
}

export function getGradlePlugin(
  content: string,
  pluginId: string
): GradlePlugin | undefined {
  const plugins = getGradlePlugins(content);
  return plugins.find((plugin) => plugin.id === pluginId);
}

export function disableGradlePlugin(
  tree: Tree,
  rootFolder: string,
  language: 'java' | 'kotlin' | 'groovy',
  pluginId: string,
  withKotlinDSL = language === 'kotlin'
) {
  const ext = withKotlinDSL ? '.gradle.kts' : '.gradle';
  const buildGradle = tree.read(`${rootFolder}/build${ext}`, 'utf-8');

  if(buildGradle === null)
    return false;
  const plugin = getGradlePlugin(buildGradle, pluginId);
  if (plugin && plugin.applied) {
    const newBuildGradle = buildGradle.replace(
      GRADLE_PLUGINS_REGEX,
      (_match, content) => {
        const newContent = content.replace(
          GRADLE_PLUGIN_REGEX,
          (pluginMatch: string, _: string, id: string) => {
            if (id === pluginId) {
              const lastQuoteIdx = pluginMatch.lastIndexOf( withKotlinDSL ? '"': "'");
              const disabledPlugin = `${pluginMatch.substring(0, lastQuoteIdx+1)} apply false${pluginMatch.substring(lastQuoteIdx+1)}`;
              return disabledPlugin;
            }
            return pluginMatch;
          }
        );
        return `plugins {\n\t${newContent}}`;
      }
    );
    tree.write(`${rootFolder}/build${ext}`, newBuildGradle);
    return true;
  }

  return false;
}

export function addGradlePlugin(
  tree: Tree,
  rootFolder: string,
  language: 'java' | 'kotlin' | 'groovy',
  pluginId: string,
  pluginVersion?: string,
  withKotlinDSL = language === 'kotlin'
) {
  const ext = withKotlinDSL ? '.gradle.kts' : '.gradle';
  const buildGradle = tree.read(`${rootFolder}/build${ext}`, 'utf-8');
  if(buildGradle === null)
    return false;

  let withVersion = '';
  if (pluginVersion) {
    withVersion = withKotlinDSL
      ? ` version "${pluginVersion}"`
      : ` version '${pluginVersion}'`;
  }
  const pluginToAdd = withKotlinDSL
    ? `id("${pluginId}")${withVersion}`
    : `id '${pluginId}'${withVersion}`;

  if (!hasGradlePlugin(buildGradle, pluginId)) {
    if (!GRADLE_PLUGINS_REGEX.test(buildGradle)) {
      const plugins = `plugins {\n\t${pluginToAdd}\n}\n`;
      tree.write(`${rootFolder}/build${ext}`, plugins + buildGradle);
    } else {
      const newBuildGradle = buildGradle.replace(
        GRADLE_PLUGINS_REGEX,
        (match, content) => {
          return `plugins {\n\t${content}\t${pluginToAdd}\n}`;
        }
      );
      tree.write(`${rootFolder}/build${ext}`, newBuildGradle);
    }

    return true;
  }

  return false;
}

function getGradleSpotlessBaseConfig(
  language: 'java' | 'kotlin' | 'groovy',
  languageConfig: string,
  baseGitBranch?: string,
  withKotlinDSL = language === 'kotlin'
): string {
  const ratchetFrom = baseGitBranch
    ? `// optional: limit format enforcement to just the files changed by this feature branch
    ratchetFrom${withKotlinDSL ? `("${baseGitBranch}")` : ` '${baseGitBranch}'`}
    `
    : '';

  return `
${
  withKotlinDSL
    ? 'configure<com.diffplug.gradle.spotless.SpotlessExtension>'
    : 'spotless'
} {
    ${ratchetFrom}
    format${withKotlinDSL ? '("misc")' : " 'misc',"} {
        // define the files to apply 'misc' to
        target${
          withKotlinDSL
            ? '("*.gradle.kts", "*.md", ".gitignore")'
            : " '*.gradle', '*.md', '.gitignore'"
        }
    
        // define the steps to apply to those files
        trimTrailingWhitespace()
        indentWithTabs() // or spaces. Takes an integer argument if you don't like 4
        endWithNewline()
    }
    ${languageConfig}
}
`;
}

export function getGradleSpotlessConfig(
  language: 'java' | 'kotlin' | 'groovy',
  jdkVersion?: number,
  baseGitBranch?: string,
  withKotlinDSL = language === 'kotlin'
): string {
  switch (language) {
    case 'java':
      return getGradleSpotlessBaseConfig(
        language,
        `
    java {// to customize, go to https://github.com/diffplug/spotless/tree/main/plugin-gradle#java

        target${
          withKotlinDSL ? '("src/*/java/**/*.java")' : " 'src/*/java/**/*.java'"
        }

        // Use the default importOrder configuration
        importOrder()

        // Clean up
        removeUnusedImports()

        // Apply google-java-format formatter
        googleJavaFormat()
    }`,
        baseGitBranch,
        withKotlinDSL
      );
    case 'kotlin':
      return getGradleSpotlessBaseConfig(
        language,
        `
    kotlin { // to customize, go to https://github.com/diffplug/spotless/tree/main/plugin-gradle#kotlin

        ${
          jdkVersion && jdkVersion >= 11
            ? '// Apply ktfmt formatter(similar to google-java-format, but for Kotlin)'
            : '// Apply ktlint formatter'
        }
        ${jdkVersion && jdkVersion >= 11 ? 'ktfmt()' : 'ktlint()'}
    }
    kotlinGradle {
        target${
          withKotlinDSL ? '("*.gradle.kts")' : " '*.gradle.kts'"
        } // default target for kotlinGradle
        ${jdkVersion && jdkVersion >= 11 ? 'ktfmt()' : 'ktlint()'}
    }`,
        baseGitBranch,
        withKotlinDSL
      );
    case 'groovy':
      return getGradleSpotlessBaseConfig(
        language,
        `
    groovy {// to customize, go to https://github.com/diffplug/spotless/tree/main/plugin-gradle#groovy

        // Use the default importOrder configuration
        importOrder()

        // Clean up
        removeUnusedImports()

        // Apply groovy-eclipse formatter
        greclipse()
    }
    groovyGradle {
        target${
          withKotlinDSL ? '("*.gradle")' : " '*.gradle'"
        } // default target of groovyGradle
        greclipse()
    }`,
        baseGitBranch,
        withKotlinDSL
      );
  }
}

export function applySpotlessGradlePlugin(
  tree: Tree,
  rootFolder: string,
  language: 'java' | 'kotlin' | 'groovy',
  jdkVersion?: number,
  gitBaseBranch?: string,
  withKotlinDSL = language === 'kotlin'
): boolean {
  const ext = withKotlinDSL ? '.gradle.kts' : '.gradle';
  const buildGradle = tree.read(`${rootFolder}/build${ext}`, 'utf-8');

  if(buildGradle === null)
    return false;

  if (!SPOTLESS_CONFIG_REGEX.test(buildGradle)) {
    const spotlessConfig = getGradleSpotlessConfig(
      language,
      jdkVersion,
      gitBaseBranch,
      withKotlinDSL
    );
    tree.write(`${rootFolder}/build${ext}`, buildGradle + spotlessConfig);
    return true;
  }

  return false;
}

export function addSpotlessGradlePlugin(
  tree: Tree,
  rootFolder: string,
  language: 'java' | 'kotlin' | 'groovy',
  jdkVersion?: number,
  gitBaseBranch?: string,
  withKotlinDSL = language === 'kotlin'
): boolean {
  const added = addGradlePlugin(
    tree,
    rootFolder,
    language,
    SPOTLESS_GRADLE_PLUGIN_ID,
    SPOTLESS_GRADLE_PLUGIN_VERSION,
    withKotlinDSL
  );

  if (added) {
    applySpotlessGradlePlugin(
      tree,
      rootFolder,
      language,
      jdkVersion,
      gitBaseBranch,
      withKotlinDSL
    );
  }

  return added;
}

export function hasMultiModuleGradleProjectInTree(tree: Tree, rootFolder: string){

  if (!hasGradleProjectSettingsInTree(tree, rootFolder))
    return false;

  const extension = getGradleBuildFilesExtensionInTree(tree, rootFolder);
  const settings = tree.read(`./${rootFolder}/settings${extension}`, 'utf-8');
  if(settings === null)
    return false;

  return checkForMultiModuleProject(settings);
}

export function hasMultiModuleGradleProject(cwd: string){

  if (!hasGradleSettingsFile(cwd))
    return false;

  const extension = getGradleBuildFilesExtension({root: cwd});
  const settings = getProjectFileContent({root: cwd}, `settings${extension}`);

  return checkForMultiModuleProject(settings);
}

function  checkForMultiModuleProject(settings: string){
  const opts = {
    fragments: [/rootProject\.name\s*=\s*'/, /include\s+'/],
    logicalOp: 'and' as 'and' | 'or'
  };

  const optsKts = {
    fragments: [/rootProject\.name\s*=\s*"/, /include\("/],
    logicalOp: 'and' as 'and' | 'or'
  };

  return checkProjectFileContains(settings, opts) || checkProjectFileContains(settings, optsKts);
}

export function hasGradleModuleInTree(tree: Tree, rootFolder:string, moduleName: string){

  if (!hasMultiModuleGradleProjectInTree(tree, rootFolder))
    return false;

  const ext = getGradleBuildFilesExtensionInTree(tree, rootFolder);
  const settings = tree.read(`./${rootFolder}/settings${ext}`, 'utf-8');
  if(settings === null)
    return false;

  return checkForModule(settings, moduleName)
}

export function hasGradleModule(cwd:string, moduleName: string){

  if (!hasMultiModuleGradleProject(cwd))
    return false;

  const extension = getGradleBuildFilesExtension({root: cwd});
  const settings = getProjectFileContent({root: cwd}, `settings${extension}`);


  return checkForModule(settings, moduleName)
}

function checkForModule(settings:string, moduleName:string){
  const opts = {
    fragments: [new RegExp(`rootProject\\.name\\s*=\\s*'`), new RegExp(`include\\s+':?${moduleName}'`)],
    logicalOp: 'and' as 'and' | 'or'
  };

  const optsKts = {
    fragments: [new RegExp(`rootProject\\.name\\s*=\\s*"`), new RegExp(`include\\(":?${moduleName}"\\)`)],
    logicalOp: 'and' as 'and' | 'or'
  };

  return checkProjectFileContains(settings, opts) || checkProjectFileContains(settings, optsKts);
}

export function getGradleModules(cwd:string): string[]{

  if (!hasMultiModuleGradleProject(cwd))
    return [];

  const extension = getGradleBuildFilesExtension({root: cwd});
  const settings = getProjectFileContent({root: cwd}, `settings${extension}`);

  const modulesRegex = extension === '.gradle.kts' ? /include\(":?(\w+)"\)/g : /include\s+':?(\w+)'/g;
  const modules = [];
  let m;
  while ( (m=modulesRegex.exec(settings))){
    modules.push(m?.[1])
  }
  return modules;
}

export function addGradleModule(
  tree: Tree,
  rootFolder: string,
  moduleName: string,
  withKotlinDSL: boolean
) {

  if(hasGradleModuleInTree(tree, rootFolder, moduleName))
    return false;
  const ext = withKotlinDSL ? '.gradle.kts' : '.gradle';
  const settingsGradle = tree.read(`${rootFolder}/settings${ext}`, 'utf-8');

  if(settingsGradle === null)
    return false;
  
  let lastIncludeIdx = settingsGradle.lastIndexOf('include');
  lastIncludeIdx = lastIncludeIdx > 0 ? lastIncludeIdx : settingsGradle.length;
  const newModule = withKotlinDSL ? `\ninclude("${moduleName}")\n`: `\ninclude '${moduleName}'\n`;

  const newSettingGradle  = settingsGradle.slice(0, lastIncludeIdx) + newModule + settingsGradle.slice(lastIncludeIdx);
  tree.write(`${rootFolder}/settings${ext}`, newSettingGradle)
  return true
}

export function initGradleParentModule(tree: Tree, rootFolder: string, parentModuleName: string, childModuleName: string, withKotlinDSL:boolean, helpComment=''){

  const settingsGradle = `
${helpComment}
rootProject.name = ${withKotlinDSL?  `"${parentModuleName}"` : `'${parentModuleName}'`}

${withKotlinDSL?  `include("${childModuleName}")` : `include '${childModuleName}'`}
`;

  tree.write(`./${rootFolder}/settings.gradle${withKotlinDSL ? '.kts' : ''}`, settingsGradle);
}

export function getGradleWrapperFiles() {
  return [
    'gradlew',
    'gradlew.bat',
    'gradlew.cmd',
    'gradle/wrapper/gradle-wrapper.jar',
    'gradle/wrapper/gradle-wrapper.properties'
  ];
}

export function hasGradleWrapperInTree(tree: Tree, rootFolder: string) {
  return hasGradleWrapperWithPredicate((file: string) => tree.exists(`./${rootFolder}/${file}`));
}

export function hasGradleWrapper(rootFolder: string) {
  return hasGradleWrapperWithPredicate((file: string) => fileExists(resolve(rootFolder, file)));
}

function hasGradleWrapperWithPredicate(predicate: (file: string) => boolean) {
  return [
    'gradlew',
    'gradle/wrapper/gradle-wrapper.jar',
    'gradle/wrapper/gradle-wrapper.properties'
  ].every(file => predicate(file)) &&
    [
      'gradlew.bat',
      'gradlew.cmd',
    ].some(file => predicate(file)) ;;
}