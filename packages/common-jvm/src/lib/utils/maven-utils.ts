import { Tree } from '@nx/devkit';
import {
  addXmlNode,
  findXmlContent,
  findXmlContents,
  findXmlMatching,
  hasMavenProject,
  hasXmlMatching,
  isMavenProjectInTree,
  isXmlNodeEmpty,
  readXml,
  removeXmlNode,
} from './index';
import { fileExists } from '@nx/workspace/src/utilities/fileutils';
import { resolve } from 'path';
import {
  stripIndent,
  getProjectFileContent,
  getNameAndRoot,
} from '@nxrocks/common';
import { XMLBuilder } from 'xmlbuilder2/lib/interfaces';

export const SPOTLESS_MAVEN_PLUGIN_GROUP_ID = 'com.diffplug.spotless';
export const SPOTLESS_MAVEN_PLUGIN_ARTIFACT_ID = 'spotless-maven-plugin';
export const SPOTLESS_MAVEN_PLUGIN_VERSION = '2.23.0';

function readPomXml(tree: Tree, rootFolder: string): XMLBuilder | null {
  const pomFile = `./${rootFolder}/pom.xml`;
  const pomXmlStr = tree.read(pomFile, 'utf-8');

  return pomXmlStr !== null ? readXml(pomXmlStr) : null;
}

export function hasMavenPlugin(
  cwd: string,
  groupId: string,
  artifactId: string,
  version?: string
): boolean {
  const pomXmlStr = getProjectFileContent({ root: cwd }, `pom.xml`);
  const pomXml = readXml(pomXmlStr);

  return hasMavenPluginBase(pomXml, groupId, artifactId, version);
}

export function hasMavenPluginInTree(
  tree: Tree,
  rootFolder: string,
  groupId: string,
  artifactId: string,
  version?: string
): boolean {
  const pomXml = readPomXml(tree, rootFolder);
  return hasMavenPluginBase(pomXml, groupId, artifactId, version);
}

function hasMavenPluginBase(
  pomXml: XMLBuilder | null,
  groupId: string,
  artifactId: string,
  version?: string
): boolean {
  if (pomXml === null) return false;

  let pluginXPath = `/project/build/plugins/plugin/groupId/text()[.="${groupId}"]/../../artifactId/text()[.="${artifactId}"]`;
  if (version) {
    pluginXPath += `/../../version/text()[.="${version}"]`;
  }

  return hasXmlMatching(pomXml, pluginXPath);
}

export function hasMavenProperty(
  tree: Tree,
  rootFolder: string,
  property: string,
  value?: string
): boolean {
  const pomXml = readPomXml(tree, rootFolder);

  if (pomXml === null) return false;

  const propertyXPath = value
    ? `/project/properties/${property}/text()[.="${value}"]`
    : `/project/properties/${property}`;

  return hasXmlMatching(pomXml, propertyXPath);
}

export function addMavenPlugin(
  tree: Tree,
  rootFolder: string,
  groupId: string,
  artifactId: string,
  version?: string,
  configuration?: { [key: string]: unknown } | string,
  executions?: { [key: string]: unknown } | string
): boolean {
  const pomXml = readPomXml(tree, rootFolder);

  if (pomXml === null) return false;

  if (hasMavenPluginInTree(tree, rootFolder, groupId, artifactId, version)) {
    return false; // plugin already exists
  }

  if (configuration && executions && typeof configuration !== typeof executions)
    throw new Error(
      '"configuration" and "executions" must be of same type (either object or string)'
    );

  const projectNode = findXmlMatching(pomXml, '/project');
  if (!projectNode)
    throw new Error('The POM.xml is invalid (no "<project>" node found)');

  const buildNode = findXmlMatching(pomXml, '/project/build');
  if (!buildNode) {
    // make sure the <build> node exists
    addXmlNode(projectNode, {
      build: {
        plugins: {},
      },
    });
  }

  let pluginsNode = findXmlMatching(pomXml, '/project/build/plugins');
  if (!pluginsNode) {
    // make sure the <plugins> node exists
    if (!buildNode) return false;

    addXmlNode(buildNode, {
      plugins: {},
    });
    pluginsNode = findXmlMatching(pomXml, '/project/build/plugins');
  }

  const pluginNode =
    (configuration || executions) &&
    (typeof configuration === 'object' || typeof executions === 'object')
      ? {
          plugin: {
            groupId: groupId,
            artifactId: artifactId,
            ...(version && { version: version }),
            ...(configuration && { configuration: configuration }),
            ...(executions && { executions: executions }),
          },
        }
      : `<plugin>
            <groupId>${groupId}</groupId>
            <artifactId>${artifactId}</artifactId>
            ${version ? `<version>${version}</version>` : ''}
            ${
              configuration
                ? `<configuration>${configuration}</configuration>`
                : ''
            }
            ${executions ? `<executions>${executions}</executions>` : ''}
        </plugin>`;

  if (pluginsNode) {
    addXmlNode(pluginsNode, pluginNode);
    tree.write(
      `${rootFolder}/pom.xml`,
      pomXml.toString({ prettyPrint: true, indent: '\t' })
    );
    return true;
  }
  return false;
}

export function removeMavenPlugin(
  tree: Tree,
  rootFolder: string,
  groupId: string,
  artifactId: string
): boolean {
  const pomXml = readPomXml(tree, rootFolder);

  if (pomXml === null) return false;

  const pluginNode = findXmlMatching(
    pomXml,
    `/project/build/plugins/plugin/groupId/text()[.="${groupId}"]/../../artifactId/text()[.="${artifactId}"]`
  )
    ?.up()
    ?.up();
  if (pluginNode) {
    const pluginsNode = removeXmlNode(pluginNode);

    //if parent 'plugins' node is now empty, remove it
    if (isXmlNodeEmpty(pluginsNode)) {
      const buildNode = removeXmlNode(pluginsNode);

      //if parent 'build' node is now empty, remove it
      if (isXmlNodeEmpty(buildNode)) {
        removeXmlNode(buildNode);
      }
    }

    tree.write(
      `${rootFolder}/pom.xml`,
      pomXml.toString({ prettyPrint: true, indent: '\t' })
    );
    return true;
  }

  return false;
}

export function addMavenProperty(
  tree: Tree,
  rootFolder: string,
  property: string,
  value: string
): boolean {
  const pomXml = readPomXml(tree, rootFolder);

  if (pomXml === null) return false;

  if (hasMavenProperty(tree, rootFolder, property, value)) {
    return false; // property already exists
  }

  const projectNode = findXmlMatching(pomXml, '/project');
  if (!projectNode)
    throw new Error('The POM.xml is invalid (no "<project>" node found)');

  let propertiesNode = findXmlMatching(pomXml, '/project/properties');
  if (!propertiesNode) {
    // make sure the <properties> node exists
    addXmlNode(projectNode, {
      properties: {},
    });
    propertiesNode = findXmlMatching(pomXml, '/project/properties');
  }

  const propertyNode = `<${property}>${value}</${property}>`;

  if (propertiesNode) {
    addXmlNode(propertiesNode, propertyNode);
    tree.write(
      `${rootFolder}/pom.xml`,
      pomXml.toString({ prettyPrint: true, indent: '\t' })
    );
    return true;
  }

  return false;
}

function getMavenSpotlessBaseConfig(
  languageConfig: string,
  baseGitBranch?: string
): string {
  const ratchetFrom = baseGitBranch
    ? stripIndent`
    <!-- optional: limit format enforcement to just the files changed by this feature branch -->
    <ratchetFrom>${baseGitBranch}</ratchetFrom>
    `
    : '';
  return stripIndent`
        ${ratchetFrom}
        <formats>
            <!-- you can define as many formats as you want, each is independent -->
            <format>
                <!-- define the files to apply to -->
                <includes>
                <include>*.md</include>
                <include>.gitignore</include>
                </includes>
                <!-- define the steps to apply to those files -->
                <trimTrailingWhitespace/>
                <endWithNewline/>
                <indent>
                <tabs>true</tabs>
                <spacesPerTab>4</spacesPerTab>
                </indent>
            </format>
        </formats>
        ${languageConfig}`;
}

export function getMavenSpotlessConfig(
  language: 'java' | 'kotlin' | 'groovy',
  jdkVersion?: number,
  baseGitBranch?: string
): string {
  switch (language) {
    case 'java':
      return getMavenSpotlessBaseConfig(
        stripIndent`
                <java>
                    <!-- to customize, go to https://github.com/diffplug/spotless/tree/main/plugin-maven#java -->

                    <!-- Use the default importOrder configuration -->
                    <importOrder/>

                    <!-- Clean up -->
                    <removeUnusedImports/>

                    <!-- Apply google-java-format formatter -->
                    <googleJavaFormat/>

                </java`,
        baseGitBranch
      );
    case 'kotlin':
      return getMavenSpotlessBaseConfig(
        stripIndent`
                <kotlin>
                    <!-- to customize, go to https://github.com/diffplug/spotless/tree/main/plugin-maven#kotlin -->

                    <!-- Use the default importOrder configuration -->
                    <importOrder/>

                    <!-- Clean up -->
                    <removeUnusedImports/>

                    <!-- Apply ${
                      jdkVersion && jdkVersion >= 11
                        ? 'ktfmt formatter(similar to google-java-format, but for Kotlin)'
                        : 'ktlint formatter'
                    } -->
                    ${jdkVersion && jdkVersion >= 11 ? '<ktfmt/>' : '<ktlint/>'}

                </kotlin>`,
        baseGitBranch
      );
    case 'groovy':
      return getMavenSpotlessBaseConfig(
        stripIndent`
                <groovy>
                    <!-- to customize, go to https://github.com/diffplug/spotless/tree/main/plugin-maven#groovy -->

                    <!-- Use the default importOrder configuration -->
                    <importOrder/>

                    <!-- Clean up -->
                    <removeUnusedImports/>

                    <!-- Apply groovy-eclipse formatter -->
                    <greclipse/>

                </groovy>`,
        baseGitBranch
      );
  }
}

export function addSpotlessMavenPlugin(
  tree: Tree,
  rootFolder: string,
  language: 'java' | 'kotlin' | 'groovy',
  jdkVersion?: number,
  gitBaseBranch?: string
): boolean {
  const spotlessConfig = getMavenSpotlessConfig(
    language,
    jdkVersion,
    gitBaseBranch
  );

  return addMavenPlugin(
    tree,
    rootFolder,
    SPOTLESS_MAVEN_PLUGIN_GROUP_ID,
    SPOTLESS_MAVEN_PLUGIN_ARTIFACT_ID,
    SPOTLESS_MAVEN_PLUGIN_VERSION,
    spotlessConfig
  );
}

export function hasMultiModuleMavenProjectInTree(
  tree: Tree,
  rootFolder: string
) {
  if (!isMavenProjectInTree(tree, rootFolder)) return false;

  const pomXml = readPomXml(tree, rootFolder);

  if (pomXml === null) return false;

  const modulesXpath = `/project/modules`;

  return hasXmlMatching(pomXml, modulesXpath);
}

export function hasMultiModuleMavenProject(cwd: string) {
  if (!hasMavenProject(cwd)) return false;

  const pomXmlStr = getProjectFileContent({ root: cwd }, `pom.xml`);
  const pomXml = readXml(pomXmlStr);

  const modulesXpath = `/project/modules`;

  return hasXmlMatching(pomXml, modulesXpath);
}

export function hasMavenModuleInTree(
  tree: Tree,
  rootFolder: string,
  moduleName: string
) {
  if (!hasMultiModuleMavenProjectInTree(tree, rootFolder)) return false;

  const pomXml = readPomXml(tree, rootFolder);

  if (pomXml === null) return false;

  const modulesXpath = `/project/modules/module/text()[.="${moduleName}"]`;

  return hasXmlMatching(pomXml, modulesXpath);
}

export function hasMavenModule(cwd: string, moduleName: string) {
  if (!hasMultiModuleMavenProject(cwd)) return false;

  const pomXmlStr = getProjectFileContent({ root: cwd }, `pom.xml`);
  const pomXml = readXml(pomXmlStr);

  const modulesXpath = `/project/modules/module/text()[.="${moduleName}"]`;

  return hasXmlMatching(pomXml, modulesXpath);
}

export function addMavenModule(
  tree: Tree,
  rootFolder: string,
  moduleName: string
) {
  if (hasMavenModuleInTree(tree, rootFolder, moduleName)) return false;

  const pomXml = readPomXml(tree, rootFolder);

  if (pomXml === null) return false;

  const modulesNode = findXmlMatching(pomXml, `/project/modules`);

  if (modulesNode) {
    addXmlNode(modulesNode, {
      module: moduleName,
    });
    tree.write(
      `${rootFolder}/pom.xml`,
      pomXml.toString({ prettyPrint: true, indent: '\t' })
    );
    return true;
  }

  return false;
}

export function initMavenParentModule(
  tree: Tree,
  rootFolder: string,
  groupId: string,
  parentModuleName: string,
  childModuleName: string,
  helpComment = '',
  version = 'O.0.1-SNAPSHOT'
) {
  const parentPomXml = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    ${helpComment}

    <groupId>${groupId}</groupId>
    <artifactId>${parentModuleName}</artifactId>
    <version>${version}</version>
    <packaging>pom</packaging>

    <modules>
      <module>${childModuleName}</module>
    </modules>

</project>
`;

  tree.write(`./${rootFolder}/pom.xml`, parentPomXml);
}

export function getMavenModules(cwd: string) {
  if (!hasMultiModuleMavenProject(cwd)) return [];

  const pomXmlStr = getProjectFileContent({ root: cwd }, `pom.xml`);
  const pomXml = readXml(pomXmlStr);

  const modulesXpath = `/project/modules/module/text()`;

  return findXmlContents(pomXml, modulesXpath);
}

export function getMavenWrapperFiles() {
  return [
    'mvnw',
    'mvnw.bat',
    'mvnw.cmd',
    '.mvn/wrapper/maven-wrapper.properties',
    '.mvn/wrapper/MavenWrapperDownloader.class',
    '.mvn/wrapper/MavenWrapperDownloader.java',
    '.mvn/wrapper/maven-wrapper.jar',
  ];
}

export function hasMavenWrapperInTree(tree: Tree, rootFolder: string) {
  return hasMavenWrapperWithPredicate((file: string) =>
    tree.exists(`./${rootFolder}/${file}`)
  );
}

export function hasMavenWrapper(rootFolder: string) {
  return hasMavenWrapperWithPredicate((file: string) =>
    fileExists(resolve(rootFolder, file))
  );
}

export function getCoordinatesForMavenProjet(cwd: string): {
  groupId?: string | null;
  artifactId?: string | null;
} {
  const pomXmlStr = getProjectFileContent({ root: cwd }, 'pom.xml');
  const pomXmlNode = readXml(pomXmlStr);

  let groupId = findXmlContent(pomXmlNode, `/project/groupId/text()`);
  const artifactId = findXmlContent(pomXmlNode, `/project/artifactId/text()`);

  if (!groupId && artifactId) {
    // groupId might be defined at parent module level,  continue searching for it
    groupId = getGroupIdInHierarchy(cwd);
  }

  return { groupId, artifactId };
}

function getGroupIdInHierarchy(cwd: string): string | undefined {
  const { root, name } = getNameAndRoot(cwd);

  if (root === '.')
    // we reach the root of the workspace without finding the groupId, so we stop the search
    return undefined;

  if (!hasMavenModule(root, name)) return undefined;

  const pomXmlStr = getProjectFileContent({ root }, 'pom.xml');
  const pomXmlNode = readXml(pomXmlStr);

  const groupId = findXmlContent(pomXmlNode, `/project/groupId/text()`);

  return groupId ?? getGroupIdInHierarchy(root);
}

function hasMavenWrapperWithPredicate(predicate: (file: string) => boolean) {
  return (
    ['mvnw', '.mvn/wrapper/maven-wrapper.properties'].every((file) =>
      predicate(file)
    ) && ['mvnw.bat', 'mvnw.cmd'].some((file) => predicate(file))
  );
}
