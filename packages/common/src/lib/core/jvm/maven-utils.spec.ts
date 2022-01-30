import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { addMavenPlugin } from '.';
import { stripIndent } from '../utils';
import { addSpotlessMavenPlugin } from './maven-utils';

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
            tree = createTreeWithEmptyWorkspace();
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

            const added = addMavenPlugin(tree, '.', 'com.github.spotlesscode', 'spotless-maven-plugin', '2.19.2');
            const pomXml = tree.read(`./pom.xml`, 'utf-8');
            expect(added).toEqual(true);
            expect(pomXml.replace(/\s+/g,'')).toContain(
            `
            <build>
            	<plugins>
            		${previousPlugins}
            		<plugin>
            			<groupId>com.github.spotlesscode</groupId>
            			<artifactId>spotless-maven-plugin</artifactId>
            			<version>2.19.2</version>
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
            tree = createTreeWithEmptyWorkspace();
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