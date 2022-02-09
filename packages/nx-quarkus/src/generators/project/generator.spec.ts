import { Tree, logger, readProjectConfiguration, readJson } from '@nrwl/devkit';
import { appRootPath } from '@nrwl/workspace/src/utils/app-root';

import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

import { projectGenerator } from './generator';
import { ProjectGeneratorOptions } from './schema';

import { Readable } from 'stream';

//mock 'node-fetch' to avoid making the actual call to Quarkus Initializer
jest.mock('node-fetch');
import fetch from 'node-fetch';
const { Response } = jest.requireActual('node-fetch');

import { BuilderCommandAliasType, NX_QUARKUS_PKG,  } from '@nxrocks/common';
import { mockZipEntries, syncToAsyncIterable } from '@nxrocks/common/testing';

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
    quarkusInitializerUrl: 'https://code.quarkus.io'
  };

  const mockedFetch = (fetch as jest.MockedFunction<typeof fetch>);
  const mockedResponse = new Response(Readable.from(['quarkus.zip']));

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
    projectType      | buildSystem | buildFileName     | buildFileContent | wrapperName
    ${'application'} | ${'MAVEN'}  | ${'pom.xml'}      | ${POM_XML}       | ${'mvnw'}
    ${'application'} | ${'GRADLE'} | ${'build.gradle'} | ${BUILD_GRADLE}  | ${'gradlew'}
    ${'library'}     | ${'MAVEN'}  | ${'pom.xml'}      | ${POM_XML}       | ${'mvnw'}
    ${'library'}     | ${'GRADLE'} | ${'build.gradle'} | ${BUILD_GRADLE}  | ${'gradlew'}
  `(`should download a quarkus '$projectType' build with $buildSystem`, async ({ projectType, buildSystem, buildFileName, buildFileContent, wrapperName }) => {

    const rootDir = projectType === 'application' ? 'apps': 'libs';
    const downloadUrl = `${options.quarkusInitializerUrl}/d?b=${buildSystem}&g=${options.groupId}&a=${options.artifactId}`;

    const zipFiles = [{ filePath: `${options.artifactId}/${buildFileName}`, fileContent: buildFileContent}, `${options.artifactId}/${wrapperName}`, `${options.artifactId}/README.md`, ];
    const quarkusZip = mockZipEntries(zipFiles);
    // mock the zip content returned by the real call to Quarkus Initializer
    jest.spyOn(mockedResponse.body, 'pipe').mockReturnValue(syncToAsyncIterable(quarkusZip));

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

    expect(logger.info).toHaveBeenNthCalledWith(2, `📦 Extracting Quarkus project zip to '${appRootPath}/${rootDir}/${options.name}'...`);
  });

  it('should update workspace.json', async () => {
    const zipFiles = [{ filePath: `${options.artifactId}/pom.xml`, fileContent: POM_XML}, `${options.artifactId}/mvnw`, `${options.artifactId}/README.md`, ];
    const quarkusZip = mockZipEntries(zipFiles);
    // mock the zip content returned by the real call to Quarkus Initializer
    jest.spyOn(mockedResponse.body, 'pipe').mockReturnValue(syncToAsyncIterable(quarkusZip));

    await projectGenerator(tree, options);
    const project = readProjectConfiguration(tree, options.name);
    expect(project.root).toBe(`apps/${options.name}`);

    const commands:BuilderCommandAliasType[] = ['dev', 'remoteDev', 'test', 'clean', 'build', 'package', 'addExtension', 'listExtensions'];
    commands.forEach(cmd => {
      expect(project.targets[cmd].executor).toBe(`${NX_QUARKUS_PKG}:${cmd}`);
    });
  });

  it('should add plugin to nx.json', async () => {
    const zipFiles = [{ filePath: `${options.artifactId}/pom.xml`, fileContent: POM_XML}, `${options.artifactId}/mvnw`, `${options.artifactId}/README.md`, ];
    const quarkusZip = mockZipEntries(zipFiles);
    // mock the zip content returned by the real call to Quarkus Initializer
    jest.spyOn(mockedResponse.body, 'pipe').mockReturnValue(syncToAsyncIterable(quarkusZip));

    
    await projectGenerator(tree, options);
    const nxJson = readJson(tree, 'nx.json');
    expect(nxJson.plugins).toEqual([NX_QUARKUS_PKG]);

  });

});

