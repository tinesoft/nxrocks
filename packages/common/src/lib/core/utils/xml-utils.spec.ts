
import { stripIndent } from '.';
import { addXmlNode, findXmlMatching, findXmlNode, findXmlNodeContent, newXmlNode, readXml } from './xml-utils';

const XML_FILE = `<?xml version="1.0" encoding="UTF-8"?>
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

describe('xml-utils', () => {
    it('should read xml content', () => {
        const xml = readXml(XML_FILE);
        const xml2 = readXml(xml.toString());
        expect(xml).toEqual(xml2);
    });

    describe('findXmlNode', () => {
        it('should find xml node if namespace info are missing from "xpath" but "ignoreNamespace" is true', () => {
            const xml = readXml(XML_FILE);
            const node = findXmlNode(xml, `/project/groupId`, true);
            expect(node).toBeDefined();
            expect((node as Node).textContent).toEqual('com.example');
        });

        it('should not find xml node if namespace info are missing from "xpath"  and "ignoreNamespace" is false', () => {
            const xml = readXml(XML_FILE);
            const node = findXmlNode(xml, `/project/groupId`, false);
            expect(node).toBeUndefined();
        });

        it('should still find xml node if namespace info are present in "xpath" and "ignoreNamespace" is false', () => {
            const xml = readXml(XML_FILE);
            const node = findXmlNode(xml, `/*[local-name() = 'project']/*[local-name() = 'groupId']`, false);
            expect(node).toBeDefined();
            expect((node as Node).textContent).toEqual('com.example');
        });
    });

    describe('findXmlNodeContent', () => {

        it('should find xml node content if namespace info are missing from "xpath" but "ignoreNamespace" is true', () => {
            const xml = readXml(XML_FILE);
            const content = findXmlNodeContent(xml, `/project/groupId/text()`, true);
            expect(content).toBeDefined();
            expect(content).toEqual('com.example');
        });

        it('should not find xml node content if namespace info are missing from "xpath"  and "ignoreNamespace" is false', () => {
            const xml = readXml(XML_FILE);
            const content = findXmlNodeContent(xml, `/project/groupId/text()`, false);
            expect(content).toBeUndefined();
        });

        it('should still find xml node content if namespace info are present in "xpath" and "ignoreNamespace" is false', () => {
            const xml = readXml(XML_FILE);
            const content = findXmlNodeContent(xml, `/*[local-name() = 'project']/*[local-name() = 'groupId']/text()`, false);
            expect(content).toBeDefined();
            expect(content).toEqual('com.example');
        });
    });

    describe('findXmlMatching', () => {
        it('should find the xml matching the given xpath', () => {
            const xml = readXml(XML_FILE);
            const subXml = findXmlMatching(xml, '/project/build');
            expect(subXml.toString({ prettyPrint: true, indent: '    ' })).toEqual(
                stripIndent`
                <build xmlns="http://maven.apache.org/POM/4.0.0">
                    <plugins>
                        <plugin>
                            <groupId>org.springframework.boot</groupId>
                            <artifactId>spring-boot-maven-plugin</artifactId>
                        </plugin>
                    </plugins>
                </build>`);
        });

    });

    describe('newXmlNode', () => {
        it(`should create a new xml from given JSON content`, () => {
            const xml = newXmlNode({
                'plugin': {
                    'groupId': 'org.springframework.boot',
                    'artifactId': 'spring-boot-maven-plugin'
                }
            });

            expect(xml.toString({ prettyPrint: true, indent: '    ' })).toEqual(
                stripIndent`
                <?xml version="1.0"?>
                <plugin>
                    <groupId>org.springframework.boot</groupId>
                    <artifactId>spring-boot-maven-plugin</artifactId>
                </plugin>`);

        });

        it(`should create a new xml from given string content`, () => {
            const xml = newXmlNode(stripIndent`
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>`);

            expect(xml.toString({ prettyPrint: true, indent: '    ' })).toEqual(
                stripIndent`
                <?xml version="1.0"?>
                <plugin>
                    <groupId>org.springframework.boot</groupId>
                    <artifactId>spring-boot-maven-plugin</artifactId>
                </plugin>`);

        });
    });

    describe('addXmlNode', () => {
        it(`should append the given node in the target XML`, () => {
            const xml = readXml(XML_FILE);
            const pluginsXml = findXmlMatching(xml, '/project/build/plugins');

            expect(pluginsXml.toString({prettyPrint: true, indent: '    '})).toEqual(
                stripIndent`
                <plugins xmlns="http://maven.apache.org/POM/4.0.0">
                    <plugin>
                        <groupId>org.springframework.boot</groupId>
                        <artifactId>spring-boot-maven-plugin</artifactId>
                    </plugin>
                </plugins>`);


            const newPluginsXml = addXmlNode(pluginsXml, {
                'plugin': {
                    'groupId': 'com.github.spotlesscode',
                    'artifactId': 'spotless-maven-plugin',
                    'version': '2.19.2'
                }
            });

            expect(newPluginsXml.toString({ prettyPrint: true, indent: '    ' })).toEqual(
                stripIndent`
                <plugins xmlns="http://maven.apache.org/POM/4.0.0">
                    <plugin>
                        <groupId>org.springframework.boot</groupId>
                        <artifactId>spring-boot-maven-plugin</artifactId>
                    </plugin>
                    <plugin>
                        <groupId>com.github.spotlesscode</groupId>
                        <artifactId>spotless-maven-plugin</artifactId>
                        <version>2.19.2</version>
                    </plugin>
                </plugins>`);

        });
    });

});

