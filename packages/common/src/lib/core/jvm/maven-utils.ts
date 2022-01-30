import { Tree } from "@nrwl/devkit";
import { addXmlNode, findXmlMatching, readXml, stripIndent } from "../utils";

export const SPOTLESS_MAVEN_PLUGIN_GROUP_ID = 'com.github.spotlesscode';
export const SPOTLESS_MAVEN_PLUGIN_ARTIFACT_ID = 'spotless-maven-plugin';
export const SPOTLESS_MAVEN_PLUGIN_VERSION = '2.19.2';

export function addMavenPlugin(tree: Tree, groudId: string, artifactId: string, version: string, configuration?: { [key: string]: any } | string): boolean {
    const pomXmlStr = tree.read('pom.xml', 'utf-8');
    const pomXml = readXml(pomXmlStr);

    const pluginGrouIdNode = findXmlMatching(pomXml, '/project/build/plugins/plugin/groupId/text()[.="' + groudId + '"]');
    const pluginArtifactIdNode = findXmlMatching(pomXml, '/project/build/plugins/plugin/artifactId/text()[.="' + artifactId + '"]');
    if (pluginGrouIdNode && pluginArtifactIdNode) {
        return false;// plugin already exists
    }
    else {
        const pluginsXml = findXmlMatching(pomXml, '/project/build/plugins');
        const pluginNode = configuration && typeof configuration === 'object' ?
            {
                'plugin': {
                    'groupId': groudId,
                    'artifactId': artifactId,
                    'version': version,
                    'configuration': configuration
                }
            } :
            `<plugin>
                <groupId>${groudId}</groupId>
                <artifactId>${artifactId}</artifactId>
                <version>${version}</version>
                ${configuration ? `<configuration>${configuration}</configuration>` : ''}
            </plugin>`;

        addXmlNode(pluginsXml, pluginNode);
        tree.write('pom.xml', pomXml.toString({ prettyPrint: true, indent: '\t' }));
        return true;
    }

}


function getMavenSpotlessBaseConfig(languageConfig: string, baseGitBranch?: string): string {

    const ratchetFrom = baseGitBranch ?
    `<!-- optional: limit format enforcement to just the files changed by this feature branch -->
    <ratchetFrom>${baseGitBranch}</ratchetFrom>
    ` : '';
    return `
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

export function getMavenSpotlessConfig(language: 'java' | 'kotlin' | 'groovy', jdkVersion?: number, baseGitBranch?: string): string {

    switch (language) {
        case 'java':
            return getMavenSpotlessBaseConfig(`
    <java>
        <!-- to customize, go to https://github.com/diffplug/spotless/tree/main/plugin-maven#java -->

        <!-- Use the default importOrder configuration -->
        <importOrder/>

        <!-- Clean up -->
        <removeUnusedImports/>
        <removeUnusedLocalVariables/>
        <removeUnusedParameters/>
        <removeUnusedThrows/>

        <!-- Apply google-java-format formatter -->
        <googleJavaFormat/>

    </java`, baseGitBranch);
        case 'kotlin':
            return getMavenSpotlessBaseConfig(`
    <kotlin>
        <!-- to customize, go to https://github.com/diffplug/spotless/tree/main/plugin-maven#kotlin -->

        <!-- Use the default importOrder configuration -->
        <importOrder/>

        <!-- Clean up -->
        <removeUnusedImports/>
        <removeUnusedLocalVariables/>
        <removeUnusedParameters/>
        <removeUnusedThrows/>

        <!-- Apply ${jdkVersion && jdkVersion >= 11 ? 'ktfmt formatter(similar to google-java-format, but for Kotlin)' : 'ktlint formatter'} -->
        ${jdkVersion && jdkVersion >= 11 ? '<ktfmt/>' : '<ktlint/>'}

    </kotlin>`, baseGitBranch);
        case 'groovy':
            return getMavenSpotlessBaseConfig(`
    <groovy>
        <!-- to customize, go to https://github.com/diffplug/spotless/tree/main/plugin-maven#groovy -->

        <!-- Use the default importOrder configuration -->
        <importOrder/>

        <!-- Clean up -->
        <removeUnusedImports/>
        <removeUnusedLocalVariables/>
        <removeUnusedParameters/>
        <removeUnusedThrows/>

        <!-- Apply groovy-eclipse formatter -->
        <greclipse/>

    </groovy>`, baseGitBranch);
    }
}


export function addSpotlessMavenPlugin(tree: Tree, language: 'java' | 'kotlin' | 'groovy', jdkVersion?: number, gitBaseBranch?: string): boolean {
    const spotlessConfig = getMavenSpotlessConfig(language, jdkVersion, gitBaseBranch);

    return addMavenPlugin(tree, SPOTLESS_MAVEN_PLUGIN_GROUP_ID, SPOTLESS_MAVEN_PLUGIN_ARTIFACT_ID, SPOTLESS_MAVEN_PLUGIN_VERSION, spotlessConfig);
}