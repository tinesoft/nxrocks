import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { addSpotlessMavenPlugin } from './maven-utils';

const POM_XML_FILE = `<?xml version="1.0" encoding="UTF-8"?>
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

	<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
			</plugin>
		</plugins>
	</build>

</project>`;

describe('maven-utils', () => {
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
                tree.write(`pom.xml`, POM_XML_FILE);
                const added = addSpotlessMavenPlugin(tree, language, jdkVersion, baseGitBranch);
                const pomXml = tree.read(`pom.xml`, 'utf-8');
                expect(added).toBe(expected);
                expect(pomXml).toContain(formatter);

                if(baseGitBranch) {
                    expect(pomXml).toContain(`<ratchetFrom>${baseGitBranch}</ratchetFrom>`);
                }   else {
                    expect(pomXml).not.toContain(`<ratchetFrom>${baseGitBranch}</ratchetFrom>`);
                }
                
            }
        );

    });
});