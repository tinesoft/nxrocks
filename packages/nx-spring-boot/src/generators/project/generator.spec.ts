import { Tree, logger, readProjectConfiguration, readJson, workspaceRoot } from '@nrwl/devkit';

import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

import { projectGenerator } from './generator';
import { ProjectGeneratorOptions } from './schema';

import { Readable } from 'stream';

//mock 'node-fetch' to avoid making the actual call to Spring Initializer
jest.mock('node-fetch');
import fetch from 'node-fetch';
const { Response } = jest.requireActual('node-fetch');

import { hasMavenPlugin, NX_SPRING_BOOT_PKG, SPOTLESS_MAVEN_PLUGIN_ARTIFACT_ID, SPOTLESS_MAVEN_PLUGIN_GROUP_ID, stripIndent } from '@nxrocks/common';
import { mockZipStream } from '@nxrocks/common/testing';

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

const BUILD_GRADLE_KTS =
`plugins {
	java
	id("org.springframework.boot") version "3.0.0"
	id("io.spring.dependency-management") version "1.1.0"
}

group = "com.example"
version = "0.0.1-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_17

repositories {
	mavenCentral()
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
}

tasks.withType<Test> {
	useJUnitPlatform()
}`;

describe('project generator', () => {
  let tree: Tree;
  const options: ProjectGeneratorOptions = {
    name: 'bootapp',
    projectType: 'application',
    springInitializerUrl: 'https://start.spring.io',
    language: 'java',
    buildSystem: 'maven-project',
  };

  const mockedFetch = (fetch as jest.MockedFunction<typeof fetch>);
  const mockedResponse = new Response(Readable.from(['starter.zip']));

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    jest.spyOn(logger, 'info');
    jest.spyOn(logger, 'debug');
    jest.spyOn(mockedResponse.body, 'pipe').mockReturnValue(mockZipStream([]));
    mockedFetch.mockResolvedValue(mockedResponse);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it.each`
    projectType      | buildSystem         | buildFile         | buildFileContent | wrapperName
    ${'application'} | ${'maven-project'}  | ${'pom.xml'}      | ${POM_XML}       | ${'mvnw'}
    ${'application'} | ${'gradle-project'} | ${'build.gradle'} | ${BUILD_GRADLE}  | ${'gradlew'}
    ${'application'} | ${'gradle-project-kotlin'} | ${'build.gradle.kts'} | ${BUILD_GRADLE_KTS}  | ${'gradlew'}
    ${'library'}     | ${'maven-project'}  | ${'pom.xml'}      | ${POM_XML}       | ${'mvnw'}
    ${'library'}     | ${'gradle-project'} | ${'build.gradle'} | ${BUILD_GRADLE}  | ${'gradlew'}
    ${'library'}     | ${'gradle-project-kotlin'} | ${'build.gradle.kts'} | ${BUILD_GRADLE_KTS}  | ${'gradlew'}
  `(`should download a spring boot '$projectType' build with $buildSystem`, async ({ projectType, buildSystem, buildFile, buildFileContent, wrapperName }) => {

    const rootDir = projectType === 'application' ? 'apps' : 'libs';
    const downloadUrl = `${options.springInitializerUrl}/starter.zip?type=${buildSystem}&language=${options.language}&name=${options.name}`;

    const zipFiles = [ { filePath: buildFile, fileContent: buildFileContent}, wrapperName, 'README.md',];
    // mock the zip content returned by the real call to Spring Initializer
    jest.spyOn(mockedResponse.body, 'pipe').mockReturnValue(mockZipStream(zipFiles));

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

    expect(logger.info).toHaveBeenNthCalledWith(2, `Extracting Spring Boot project zip to '${workspaceRoot}/${rootDir}/${options.name}'...`);

    
    if (buildSystem === 'gradle-project') {
      
      if (projectType === 'library') {
        expect(logger.debug).toHaveBeenNthCalledWith(1,`Disabling 'spring-boot' gradle plugin on a library project...`);
      } else {
        expect(logger.debug).toHaveBeenNthCalledWith(1,`Adding 'buildInfo' task to the ${buildFile} file...`);
      }
      expect(logger.debug).toHaveBeenNthCalledWith(2,`Adding 'maven-publish' plugin...`);
    }

    if (buildSystem === 'maven-project' && projectType === 'library') {
      expect(logger.debug).toHaveBeenCalledWith(`Removing 'spring-boot' maven plugin on a library project...`);
    }
  });

  it.each`
    projectType     
    ${'application'}
    ${'library'}    
  `(`should update workspace.json for '$projectType'`, async ({ projectType }) => {

    const zipFiles = [{ filePath: 'pom.xml', fileContent: POM_XML }, 'mvnw', 'README.md',];
    // mock the zip content returned by the real call to Spring Initializer
    jest.spyOn(mockedResponse.body, 'pipe').mockReturnValue(mockZipStream(zipFiles));

    await projectGenerator(tree, { ...options, projectType });

    const project = readProjectConfiguration(tree, options.name);
    const projectDir = projectType === 'application' ? 'apps' : 'libs';
    expect(project.root).toBe(`${projectDir}/${options.name}`);

    const commands = ['build', 'install', 'format', 'apply-format', 'check-format', 'test', 'clean']
    const appOnlyCommands = ['run', 'serve', 'build-image', 'build-info'];

    if (projectType === 'application') {
      commands.push(...appOnlyCommands);
    }

    commands.forEach(cmd => {
      expect(project.targets[cmd].executor).toBe(`${NX_SPRING_BOOT_PKG}:${cmd}`);
      if(['build', 'install'].includes(cmd)) { 
        expect(project.targets[cmd].outputs).toEqual([`{workspaceRoot}/${project.root}/target`]);
      }
    });
  });

  it('should add plugin to nx.json', async () => {
    const zipFiles = [{ filePath: 'pom.xml', fileContent: POM_XML }, 'mvnw', 'README.md',];
    // mock the zip content returned by the real call to Spring Initializer
    jest.spyOn(mockedResponse.body, 'pipe').mockReturnValue(mockZipStream(zipFiles));

    await projectGenerator(tree, options);

    const nxJson = readJson(tree, 'nx.json');
    expect(nxJson.plugins).toEqual([NX_SPRING_BOOT_PKG]);

  });


  it.each`
  projectType      | expectedAction  
  ${'application'} | ${'keep as-is'} 
  ${'library'}     | ${'remove'}     
`(`should $expectedAction the Spring Boot Maven plugin in pom.xml when generating a '$projectType'`, async ({ projectType }) => {

    const opts: ProjectGeneratorOptions = { ...options, buildSystem: 'maven-project', projectType};

    const zipFiles = [{ filePath: 'pom.xml', fileContent: POM_XML }, 'mvnw', 'README.md',];
    // mock the zip content returned by the real call to Spring Initializer
    jest.spyOn(mockedResponse.body, 'pipe').mockReturnValue(mockZipStream(zipFiles));

    await projectGenerator(tree, opts);

    const expectedResult = projectType === 'application';
    expect(hasMavenPlugin(tree, `./${projectType === 'application' ? 'apps':'libs'}/${options.name}`, 'org.springframework.boot', 'spring-boot-maven-plugin')).toEqual(expectedResult);
  });


  it.each`
  projectType      | expectedAction  
  ${'application'} | ${'keep as-is'} 
  ${'library'}     | ${'disable'}    
`(`should $expectedAction the Spring Boot Gradle plugin in build.gradle when generating a '$projectType'`, async ({ projectType }) => {

    const opts: ProjectGeneratorOptions = { ...options, buildSystem: 'gradle-project', projectType};

    const zipFiles = [{ filePath: 'build.gradle', fileContent: BUILD_GRADLE }, 'gradlew', 'README.md',];
    // mock the zip content returned by the real call to Spring Initializer
    jest.spyOn(mockedResponse.body, 'pipe').mockReturnValue(mockZipStream(zipFiles));

    await projectGenerator(tree, opts);

    const buildGradle = tree.read( `./${projectType === 'application' ? 'apps':'libs'}/${options.name}/build.gradle`, 'utf-8');

    const dependencyManagement = 
    stripIndent`
    dependencyManagement {
    	imports {
    		mavenBom org.springframework.boot.gradle.plugin.SpringBootPlugin.BOM_COORDINATES
    	}
    }
    `;

    if(projectType === 'application') {
      expect(buildGradle).not.toContain(`id 'org.springframework.boot' version '2.6.2' apply false`);
      expect(buildGradle).not.toContain(dependencyManagement);
    }
    else {
      expect(buildGradle).toContain(`id 'org.springframework.boot' version '2.6.2' apply false`);
      expect(buildGradle).toContain(dependencyManagement);
    }

  });

  it.each`
  skipFormat      | expectedAction
  ${true}         | ${'not add'}
  ${false}        | ${'add'}
`(`should $expectedAction code formatting features if skipFormat=$skipFormat`, async ({ skipFormat }) => {

    const zipFiles = [{ filePath: 'pom.xml', fileContent: POM_XML }, 'mvnw', 'README.md',];
    // mock the zip content returned by the real call to Spring Initializer
    jest.spyOn(mockedResponse.body, 'pipe').mockReturnValue(mockZipStream(zipFiles));

    await projectGenerator(tree, { ...options, skipFormat });

    const project = readProjectConfiguration(tree, options.name);
    const formatCommands = ['format', 'apply-format', 'check-format'];
    
    if(skipFormat) {
      // expect project.targets not to have the format commands
      formatCommands.forEach(cmd => {
        expect(project.targets[cmd]).toBeUndefined();
      });
    }
    else {
      // expect project.targets to have the format commands
      formatCommands.forEach(cmd => {
        expect(project.targets[cmd].executor).toBe(`${NX_SPRING_BOOT_PKG}:${cmd}`);
      });
    }

    expect(hasMavenPlugin(tree, `./${options.projectType === 'application' ? 'apps':'libs'}/${options.name}`, SPOTLESS_MAVEN_PLUGIN_GROUP_ID, SPOTLESS_MAVEN_PLUGIN_ARTIFACT_ID)).toEqual(!skipFormat);
  });

});

