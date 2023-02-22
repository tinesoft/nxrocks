import { Tree, logger, readProjectConfiguration, readJson, workspaceRoot } from '@nrwl/devkit';

import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

import { projectGenerator } from './generator';
import { ProjectGeneratorOptions } from './schema';

import { Readable } from 'stream';

//mock 'node-fetch' to avoid making the actual call to Quarkus Initializer
jest.mock('node-fetch');
import fetch from 'node-fetch';
const { Response } = jest.requireActual('node-fetch');

import { BuilderCommandAliasType, hasMavenPlugin, NX_QUARKUS_PKG, SPOTLESS_MAVEN_PLUGIN_ARTIFACT_ID, SPOTLESS_MAVEN_PLUGIN_GROUP_ID,  } from '@nxrocks/common';
import { mockZipStream } from '@nxrocks/common/testing';

const POM_XML = `<?xml version="1.0"?>
<project xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd" xmlns="http://maven.apache.org/POM/4.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <modelVersion>4.0.0</modelVersion>
  <groupId>org.acme</groupId>
  <artifactId>code-with-quarkus</artifactId>
  <version>1.0.0-SNAPSHOT</version>
  <properties>
    <compiler-plugin.version>3.8.1</compiler-plugin.version>
    <failsafe.useModulePath>false</failsafe.useModulePath>
    <maven.compiler.release>11</maven.compiler.release>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
    <quarkus.platform.artifact-id>quarkus-bom</quarkus.platform.artifact-id>
    <quarkus.platform.group-id>io.quarkus.platform</quarkus.platform.group-id>
    <quarkus.platform.version>2.7.1.Final</quarkus.platform.version>
    <surefire-plugin.version>3.0.0-M5</surefire-plugin.version>
  </properties>
</project>
`;

const BUILD_GRADLE = `plugins {
  id 'java'
  id 'io.quarkus'
}

repositories {
  mavenCentral()
  mavenLocal()
}

dependencies {
  implementation 'io.quarkus:quarkus-arc'
  implementation 'io.quarkus:quarkus-resteasy'
  testImplementation 'io.quarkus:quarkus-junit5'
  testImplementation 'io.rest-assured:rest-assured'
}

group 'org.acme'
version '1.0.0-SNAPSHOT'

java {
  sourceCompatibility = JavaVersion.VERSION_11
  targetCompatibility = JavaVersion.VERSION_11
}

compileJava {
  options.encoding = 'UTF-8'
  options.compilerArgs << '-parameters'
}

compileTestJava {
  options.encoding = 'UTF-8'
}
`;
describe('project generator', () => {
  let tree: Tree;
  const options: ProjectGeneratorOptions = {
    name: 'quarkusapp',
    projectType: 'application',
    groupId:'com.tinesoft', 
    artifactId:'demo',
    buildSystem: 'MAVEN',
    quarkusInitializerUrl: 'https://code.quarkus.io'
  };

  const mockedFetch = (fetch as jest.MockedFunction<typeof fetch>);
  const mockedResponse = new Response(Readable.from(['quarkus.zip']));

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
    projectType      | buildSystem | buildFileName     | buildFileContent | wrapperName
    ${'application'} | ${'MAVEN'}  | ${'pom.xml'}      | ${POM_XML}       | ${'mvnw'}
    ${'application'} | ${'GRADLE'} | ${'build.gradle'} | ${BUILD_GRADLE}  | ${'gradlew'}
    ${'library'}     | ${'MAVEN'}  | ${'pom.xml'}      | ${POM_XML}       | ${'mvnw'}
    ${'library'}     | ${'GRADLE'} | ${'build.gradle'} | ${BUILD_GRADLE}  | ${'gradlew'}
  `(`should download a quarkus '$projectType' build with $buildSystem`, async ({ projectType, buildSystem, buildFileName, buildFileContent, wrapperName }) => {

    const rootDir = projectType === 'application' ? 'apps': 'libs';
    const downloadUrl = `${options.quarkusInitializerUrl}/d?b=${buildSystem}&g=${options.groupId}&a=${options.artifactId}`;

    const zipFiles = [{ filePath: `${options.artifactId}/${buildFileName}`, fileContent: buildFileContent}, `${options.artifactId}/${wrapperName}`, `${options.artifactId}/README.md`, ];
    // mock the zip content returned by the real call to Quarkus Initializer
    jest.spyOn(mockedResponse.body, 'pipe').mockReturnValue(mockZipStream(zipFiles));

    await projectGenerator(tree, { ...options, projectType, buildSystem});

    expect(mockedFetch).toHaveBeenCalledWith(
      downloadUrl,
      expect.objectContaining({
        headers: {
          'User-Agent': expect.stringContaining('@nxrocks_nx-quarkus/')
        }
      })
    );

    expect(logger.info).toHaveBeenNthCalledWith(1, `⬇️ Downloading Quarkus project zip from : ${downloadUrl}...`);

    expect(logger.info).toHaveBeenNthCalledWith(2, `📦 Extracting Quarkus project zip to '${workspaceRoot}/${rootDir}/${options.name}'...`);
  });
  it.each`
    projectType     
    ${'application'}
    ${'library'}    
  `(`should update workspace.json for '$projectType'`, async ({ projectType }) => {
    const zipFiles = [{ filePath: `${options.artifactId}/pom.xml`, fileContent: POM_XML}, `${options.artifactId}/mvnw`, `${options.artifactId}/README.md`, ];
    // mock the zip content returned by the real call to Quarkus Initializer
    jest.spyOn(mockedResponse.body, 'pipe').mockReturnValue(mockZipStream(zipFiles));

    await projectGenerator(tree, {...options, projectType});

    const project = readProjectConfiguration(tree, options.name);
    const projectDir = projectType === 'application' ? 'apps' : 'libs';
    expect(project.root).toBe(`${projectDir}/${options.name}`);

    const commands:BuilderCommandAliasType[] = ['dev', 'serve', 'remote-dev', 'test', 'clean', 'build', 'format', 'apply-format', 'check-format', 'package', 'add-extension', 'list-extensions'];
    commands.forEach(cmd => {
      expect(project.targets[cmd].executor).toBe(`${NX_QUARKUS_PKG}:${cmd}`);
      if(['build', 'install', 'test'].includes(cmd)) { 
        expect(project.targets[cmd].outputs).toEqual([`{workspaceRoot}/${project.root}/target`]);
      }
    });
  });

  it('should add plugin to nx.json', async () => {
    const zipFiles = [{ filePath: `${options.artifactId}/pom.xml`, fileContent: POM_XML}, `${options.artifactId}/mvnw`, `${options.artifactId}/README.md`, ];
    // mock the zip content returned by the real call to Quarkus Initializer
    jest.spyOn(mockedResponse.body, 'pipe').mockReturnValue(mockZipStream(zipFiles));

    
    await projectGenerator(tree, options);
    const nxJson = readJson(tree, 'nx.json');
    expect(nxJson.plugins).toEqual([NX_QUARKUS_PKG]);
  });

  
  it.each`
  skipFormat      | expectedAction
  ${true}         | ${'not add'}
  ${false}        | ${'add'}
`(`should $expectedAction code formatting features if skipFormat=$skipFormat`, async ({ skipFormat }) => {

    const zipFiles = [{ filePath: `${options.artifactId}/pom.xml`, fileContent: POM_XML}, `${options.artifactId}/mvnw`, `${options.artifactId}/README.md`, ];
    // mock the zip content returned by the real call to Quarkus Initializer
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
        expect(project.targets[cmd].executor).toBe(`${NX_QUARKUS_PKG}:${cmd}`);
      });
    }
    expect(hasMavenPlugin(tree, `./${options.projectType === 'application' ? 'apps':'libs'}/${options.name}`, SPOTLESS_MAVEN_PLUGIN_GROUP_ID, SPOTLESS_MAVEN_PLUGIN_ARTIFACT_ID)).toEqual(!skipFormat);
  });

});

