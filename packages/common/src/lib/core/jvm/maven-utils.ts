import { Tree } from '@nx/devkit';
import {
  addXmlNode,
  findXmlMatching,
  hasXmlMatching,
  isXmlNodeEmpty,
  readXml,
  removeXmlNode,
  stripIndent,
} from '../utils';
import { isMavenProjectInTree } from './utils';

export const SPOTLESS_MAVEN_PLUGIN_GROUP_ID = 'com.diffplug.spotless';
export const SPOTLESS_MAVEN_PLUGIN_ARTIFACT_ID = 'spotless-maven-plugin';
export const SPOTLESS_MAVEN_PLUGIN_VERSION = '2.23.0';

export function hasMavenPlugin(
  tree: Tree,
  rootFolder: string,
  groupId: string,
  artifactId: string,
  version?: string
): boolean {
  const pomXmlStr = tree.read(`${rootFolder}/pom.xml`, 'utf-8');
  const pomXml = readXml(pomXmlStr);

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
  const pomXmlStr = tree.read(`${rootFolder}/pom.xml`, 'utf-8');
  const pomXml = readXml(pomXmlStr);

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
  configuration?: { [key: string]: any } | string,
  executions?: { [key: string]: any } | string
): boolean {
  const pomXmlStr = tree.read(`${rootFolder}/pom.xml`, 'utf-8');
  const pomXml = readXml(pomXmlStr);

  if (hasMavenPlugin(tree, rootFolder, groupId, artifactId, version)) {
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

  addXmlNode(pluginsNode, pluginNode);
  tree.write(
    `${rootFolder}/pom.xml`,
    pomXml.toString({ prettyPrint: true, indent: '\t' })
  );
  return true;
}

export function removeMavenPlugin(
  tree: Tree,
  rootFolder: string,
  groupId: string,
  artifactId: string
): boolean {
  const pomXmlStr = tree.read(`${rootFolder}/pom.xml`, 'utf-8');
  const pomXml = readXml(pomXmlStr);

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
  const pomXmlStr = tree.read(`${rootFolder}/pom.xml`, 'utf-8');
  const pomXml = readXml(pomXmlStr);

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

  addXmlNode(propertiesNode, propertyNode);
  tree.write(
    `${rootFolder}/pom.xml`,
    pomXml.toString({ prettyPrint: true, indent: '\t' })
  );
  return true;
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

export function isMultiModuleMavenProject(tree: Tree, rootFolder: string){

  if (!isMavenProjectInTree(tree,rootFolder))
    return false;

    
  const pomXmlStr = tree.read(`./${rootFolder}/pom.xml`, 'utf-8');
  const pomXml = readXml(pomXmlStr);

  const modulesXpath = `/project/modules`;

  return hasXmlMatching(pomXml, modulesXpath);
}

export function hasMavenModule(tree: Tree, rootFolder: string, moduleName){

  if (!isMultiModuleMavenProject(tree,rootFolder))
    return false;
    
  const pomXmlStr = tree.read(`./${rootFolder}/pom.xml`, 'utf-8');
  const pomXml = readXml(pomXmlStr);

  const modulesXpath = `/project/modules/module/text()[.="${moduleName}"]`;

  return hasXmlMatching(pomXml, modulesXpath);
}

export function addMavenModule(
  tree: Tree,
  rootFolder: string,
  moduleName: string,
) {

  if(hasMavenModule(tree, rootFolder, moduleName))
    return false;
  const pomXmlStr = tree.read(`${rootFolder}/pom.xml`, 'utf-8');
  const pomXml = readXml(pomXmlStr);

  const modulesNode =  findXmlMatching(pomXml, `/project/modules`);;

  addXmlNode(modulesNode, {
    module: moduleName
  });
  tree.write(
    `${rootFolder}/pom.xml`,
    pomXml.toString({ prettyPrint: true, indent: '\t' })
  );

  return true
}