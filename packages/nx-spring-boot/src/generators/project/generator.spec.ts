import { Tree, logger, readProjectConfiguration, readJson } from '@nrwl/devkit';
import { appRootPath } from '@nrwl/workspace/src/utils/app-root';

import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

import { projectGenerator } from './generator';
import { ProjectGeneratorOptions } from './schema';

import { Readable } from 'stream';

//mock 'node-fetch' to avoid making the actual call to Spring Initializer
jest.mock('node-fetch');
import fetch from 'node-fetch';
const { Response } = jest.requireActual('node-fetch');

import { NX_SPRING_BOOT_PKG } from '@nxrocks/common';
import { mockZipEntries, syncToAsyncIterable } from '@nxrocks/common/testing';

const POM_XML = `<?xml version="1.0" encoding="UTF-8"?>
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

const BUILD_GRADLE =
`plugins {
	id 'org.springframework.boot' version '2.6.2'
	id 'io.spring.dependency-management' version '1.0.11.RELEASE'
	id 'groovy'
}

group = 'com.example'
version = '0.0.1-SNAPSHOT'
sourceCompatibility = '11'

repositories {
	mavenCentral()
}

dependencies {
	implementation 'org.springframework.boot:spring-boot-starter'
	implementation 'org.codehaus.groovy:groovy'
	testImplementation 'org.springframework.boot:spring-boot-starter-test'
}

test {
	useJUnitPlatform()
}`;


describe('project generator', () => {
  let tree: Tree;
  const options: ProjectGeneratorOptions = {
    name: 'bootapp',
    projectType: 'application',
    springInitializerUrl: 'https://start.spring.io',
    language: 'java'
  };

  const mockedFetch = (fetch as jest.MockedFunction<typeof fetch>);
  const mockedResponse = new Response(Readable.from(['starter.zip']));

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    jest.spyOn(logger, 'info');
    jest.spyOn(logger, 'debug');
    jest.spyOn(mockedResponse.body, 'pipe').mockReturnValue(syncToAsyncIterable([]));
    mockedFetch.mockResolvedValue(mockedResponse);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it.each`
    projectType      | buildSystem         | buildFile         | buildFileContent | wrapperName
    ${'application'} | ${'maven-project'}  | ${'pom.xml'}      | ${POM_XML}       | ${'mvnw'}
    ${'application'} | ${'gradle-project'} | ${'build.gradle'} | ${BUILD_GRADLE}  | ${'gradlew'}
    ${'library'}     | ${'maven-project'}  | ${'pom.xml'}      | ${POM_XML}       | ${'mvnw'}
    ${'library'}     | ${'gradle-project'} | ${'build.gradle'} | ${BUILD_GRADLE}  | ${'gradlew'}
  `(`should download a spring boot '$projectType' build with $buildSystem`, async ({ projectType, buildSystem, buildFile, buildFileContent, wrapperName }) => {

    const rootDir = projectType === 'application' ? 'apps' : 'libs';
    const downloadUrl = `${options.springInitializerUrl}/starter.zip?type=${buildSystem}&language=${options.language}&name=${options.name}`;

    const zipFiles = [ { filePath: buildFile, fileContent: buildFileContent}, wrapperName, 'README.md',];
    const starterZip = mockZipEntries(zipFiles);
    // mock the zip content returned by the real call to Spring Initializer
    jest.spyOn(mockedResponse.body, 'pipe').mockReturnValue(syncToAsyncIterable(starterZip));

    await projectGenerator(tree, { ...options, projectType, buildSystem });

    expect(mockedFetch).toHaveBeenCalledWith(
      downloadUrl,
      expect.objectContaining({
        headers: {
          'User-Agent': expect.stringContaining('@nxrocks_nx-spring-boot/')
        }
      })
    );

    expect(logger.info).toHaveBeenNthCalledWith(1, `Downloading Spring Boot project zip from : ${downloadUrl}...`);

    expect(logger.info).toHaveBeenNthCalledWith(2, `Extracting Spring Boot project zip to '${appRootPath}/${rootDir}/${options.name}'...`);

    if (buildSystem === 'gradle-project') {

      if (projectType === 'library') {
        expect(logger.debug).toHaveBeenCalledWith(`Disabling 'bootJar' task on a library project...`);
      } else {
        expect(logger.debug).toHaveBeenCalledWith(`Adding 'buildInfo' task to the build.gradle file...`);
      }
    }

    if (buildSystem === 'maven-project' && projectType === 'library') {
      expect(logger.debug).toHaveBeenCalledWith(`Removing 'spring-boot' maven plugin on a library project...`);
    }
  });

  it.each`
    projectType      | subDir
    ${'application'} | ${'apps'}
    ${'library'}     | ${'libs'}
  `(`should update workspace.json for '$projectType'`, async ({ projectType, subDir }) => {

    const zipFiles = [{ filePath: 'pom.xml', fileContent: POM_XML }, 'mvnw', 'README.md',];
    const starterZip = mockZipEntries(zipFiles);
    // mock the zip content returned by the real call to Spring Initializer
    jest.spyOn(mockedResponse.body, 'pipe').mockReturnValue(syncToAsyncIterable(starterZip));

    await projectGenerator(tree, { ...options, projectType });

    const project = readProjectConfiguration(tree, options.name);
    expect(project.root).toBe(`${subDir}/${options.name}`);

    const commands = ['build', 'format', 'format-check', 'test', 'clean']
    const bootOnlyCommands = ['run', 'serve', 'buildImage', 'buildInfo'];

    if (projectType === 'application') {
      commands.push(...bootOnlyCommands);
    }

    commands.forEach(cmd => {
      expect(project.targets[cmd].executor).toBe(`${NX_SPRING_BOOT_PKG}:${cmd}`);
    });
  });

  it('should add plugin to nx.json', async () => {
    const zipFiles = [{ filePath: 'pom.xml', fileContent: POM_XML }, 'mvnw', 'README.md',];
    const starterZip = mockZipEntries(zipFiles);
    // mock the zip content returned by the real call to Spring Initializer
    jest.spyOn(mockedResponse.body, 'pipe').mockReturnValue(syncToAsyncIterable(starterZip));

    await projectGenerator(tree, options);

    const nxJson = readJson(tree, 'nx.json');
    expect(nxJson.plugins).toEqual([NX_SPRING_BOOT_PKG]);

  });
});

