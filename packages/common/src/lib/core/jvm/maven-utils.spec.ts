import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { addMavenPlugin } from '.';
import { stripIndent } from '../utils';
import { addSpotlessMavenPlugin, SPOTLESS_MAVEN_PLUGIN_GROUP_ID, SPOTLESS_MAVEN_PLUGIN_ARTIFACT_ID, SPOTLESS_MAVEN_PLUGIN_VERSION, removeMavenPlugin } from './maven-utils';

const getPomXmlFile = (hasBuildNode = true, hasPluginsNode = true) => {

    const pluginsNode = hasPluginsNode ? stripIndent`
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
    </plugins>`: '';
    const buildNode = hasBuildNode ? stripIndent`
    <build>
        ${pluginsNode}
    </build>` : '';

    return stripIndent`
    <?xml version="1.0" encoding="UTF-8"?>
    <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
        <modelVersion>4.0.0</modelVersion>
        <parent>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-parent</artifactId>
            <version>2.6.2</version>
            <relativePath/> <!-- lookup parent from repository -->
        </parent>
        <groupId>com.example</groupId>
        <artifactId>demo</artifactId>
        <version>0.0.1-SNAPSHOT</version>
        <name>demo</name>
        <description>Demo project for Spring Boot</description>
        <properties>
            <java.version>11</java.version>
        </properties>
        <dependencies>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter</artifactId>
            </dependency>

            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-test</artifactId>
                <scope>test</scope>
            </dependency>
        </dependencies>
        ${buildNode}
    </project>`;
};

describe('maven-utils', () => {

    describe('addMavenPlugin', () => {

        let tree: Tree;
        beforeEach(() => {
            tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
        });

        it('should not add the plugin if already exists', () => {
            tree.write(`./pom.xml`, getPomXmlFile());
            const added = addMavenPlugin(tree, '.', 'org.springframework.boot', 'spring-boot-maven-plugin');
            expect(added).toEqual(false);
        });

        it.each`
            hasBuildNode | hasPluginsNode
            ${true}     | ${true}
            ${true}     | ${false}
            ${false}    | ${true}
            ${false}    | ${false}
        `('should add the plugin even when hasBuildNode: $hasBuildNode and hasPluginsNode: $hasPluginsNode', ({hasBuildNode, hasPluginsNode}) => {
            tree.write(`./pom.xml`, getPomXmlFile(hasBuildNode, hasPluginsNode));
            const previousPlugins = hasBuildNode && hasPluginsNode ? stripIndent`
            <plugin>
            	<groupId>org.springframework.boot</groupId>
            	<artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>` : '';

            const added = addMavenPlugin(tree, '.', SPOTLESS_MAVEN_PLUGIN_GROUP_ID, SPOTLESS_MAVEN_PLUGIN_ARTIFACT_ID, SPOTLESS_MAVEN_PLUGIN_VERSION);
            const pomXml = tree.read(`./pom.xml`, 'utf-8');
            expect(added).toEqual(true);
            expect(pomXml.replace(/\s+/g,'')).toContain(
            `
            <build>
            	<plugins>
            		${previousPlugins}
            		<plugin>
            			<groupId>${SPOTLESS_MAVEN_PLUGIN_GROUP_ID}</groupId>
            			<artifactId>${SPOTLESS_MAVEN_PLUGIN_ARTIFACT_ID}</artifactId>
            			<version>${SPOTLESS_MAVEN_PLUGIN_VERSION}</version>
            		</plugin>
            	</plugins>
            </build>
            `.replace(/\s+/g,'')
            );
        });
    });

    describe('removeMavenPlugin', () => {

        let tree: Tree;
        beforeEach(() => {
            tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
        });

        it('should not remove the plugin if does not exist', () => {
            tree.write(`./pom.xml`, getPomXmlFile());
            const removed = removeMavenPlugin(tree, '.', 'org.springframework.boot.fake', 'spring-boot-maven-plugin-fake');
            expect(removed).toEqual(false);
        });

        it(`should remove the plugin node if found along with its ancestors 'plugins' and 'build' node if empty afterwards`, () => {
            tree.write(`./pom.xml`, getPomXmlFile());

            const removed = removeMavenPlugin(tree, '.','org.springframework.boot', 'spring-boot-maven-plugin');
            const pomXml = tree.read(`./pom.xml`, 'utf-8');
            expect(removed).toEqual(true);
            expect(pomXml.replace(/\s+/g,'')).not.toContain(
            `
            <build>
            	<plugins>
            		<plugin>
            			<groupId>org.springframework.boot</groupId>
            			<artifactId>spring-boot-maven-plugin</artifactId>
            		</plugin>
            	</plugins>
            </build>
            `.replace(/\s+/g,'')
            );
        });
    });

    describe('addSpotlessMavenPlugin', () => {
        let tree: Tree;
        beforeEach(() => {
            tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
        });

        it.each`
            language    | jdkVersion    | baseGitBranch | formatter                 | expected
            ${'java'}   | ${'11'}       | ${'master'}   | ${'<googleJavaFormat/>'}   | ${true}
            ${'java'}   | ${undefined}  | ${undefined}  | ${'<googleJavaFormat/>'}   | ${true}
            ${'kotlin'} | ${'11'}       | ${'develop'}  | ${'<ktfmt/>'}              | ${true}
            ${'kotlin'} | ${'8'}        | ${'develop'}  | ${'<ktlint/>'}             | ${true}
            ${'kotlin'} | ${undefined}  | ${undefined}  | ${'<ktlint/>'}             | ${true}
            ${'groovy'} | ${'11'}       | ${'master'}   | ${'<greclipse/>'}          | ${true}
            ${'groovy'} | ${undefined}  | ${undefined}  | ${'<greclipse/>'}          | ${true}
        `(`should return $expected when applying spotless gradle plugin to project with language: '$language', jdkVersion: '$jdkVersion', baseGitBranch: '$baseGitBranch'`,
            ({ language, jdkVersion, baseGitBranch, formatter, expected }) => {
                tree.write(`./pom.xml`, getPomXmlFile());
                const added = addSpotlessMavenPlugin(tree, '.', language, jdkVersion, baseGitBranch);
                const pomXml = tree.read(`./pom.xml`, 'utf-8');
                expect(added).toBe(expected);
                expect(pomXml).toContain(formatter);

                if (baseGitBranch) {
                    expect(pomXml).toContain(`<ratchetFrom>${baseGitBranch}</ratchetFrom>`);
                } else {
                    expect(pomXml).not.toContain(`<ratchetFrom>${baseGitBranch}</ratchetFrom>`);
                }

            }
        );

    });
});