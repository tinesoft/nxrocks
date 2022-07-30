import { Tree, logger, readProjectConfiguration, readJson } from '@nrwl/devkit';
import { workspaceRoot } from '@nrwl/workspace/src/utils/app-root';

import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

import { projectGenerator } from './generator';
import { ProjectGeneratorOptions } from './schema';

import { Readable } from 'stream';

//mock 'node-fetch' to avoid making the actual call to Micronaut Launch
jest.mock('node-fetch');
import fetch from 'node-fetch';
const { Response } = jest.requireActual('node-fetch');

import { BuilderCommandAliasType, hasMavenPlugin, NX_MICRONAUT_PKG, SPOTLESS_MAVEN_PLUGIN_ARTIFACT_ID, SPOTLESS_MAVEN_PLUGIN_GROUP_ID,  } from '@nxrocks/common';
import { mockZipEntries, syncToAsyncIterable } from '@nxrocks/common/testing';

const POM_XML = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.example</groupId>
  <artifactId>demo</artifactId>
  <version>0.1</version>
  <packaging>docker</packaging>

  <parent>
    <groupId>io.micronaut</groupId>
    <artifactId>micronaut-parent</artifactId>
    <version>3.5.2</version>
  </parent>

  <properties>
    <packaging>jar</packaging>
    <jdk.version>11</jdk.version>
    <release.version>11</release.version>
    <micronaut.version>3.5.2</micronaut.version>
    <micronaut.runtime>netty</micronaut.runtime>
    <exec.mainClass>com.example.Application</exec.mainClass>
  </properties>

  <repositories>
    <repository>
      <id>central</id>
      <url>https://repo.maven.apache.org/maven2</url>
    </repository>
  </repositories>

  <dependencies>
    <dependency>
      <groupId>io.micronaut</groupId>
      <artifactId>micronaut-inject</artifactId>
      <scope>compile</scope>
    </dependency>
    <dependency>
      <groupId>io.micronaut</groupId>
      <artifactId>micronaut-validation</artifactId>
      <scope>compile</scope>
    </dependency>
    <dependency>
      <groupId>org.junit.jupiter</groupId>
      <artifactId>junit-jupiter-api</artifactId>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>org.junit.jupiter</groupId>
      <artifactId>junit-jupiter-engine</artifactId>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>io.micronaut.test</groupId>
      <artifactId>micronaut-test-junit5</artifactId>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>io.micronaut</groupId>
      <artifactId>micronaut-http-client</artifactId>
      <scope>compile</scope>
    </dependency>
    <dependency>
      <groupId>io.micronaut</groupId>
      <artifactId>micronaut-http-server-netty</artifactId>
      <scope>compile</scope>
    </dependency>
    <dependency>
      <groupId>io.micronaut</groupId>
      <artifactId>micronaut-jackson-databind</artifactId>
      <scope>compile</scope>
    </dependency>
    <dependency>
      <groupId>jakarta.annotation</groupId>
      <artifactId>jakarta.annotation-api</artifactId>
      <scope>compile</scope>
    </dependency>
    <dependency>
      <groupId>ch.qos.logback</groupId>
      <artifactId>logback-classic</artifactId>
      <scope>runtime</scope>
    </dependency>
  </dependencies>

  <build>
    <plugins>
      <plugin>
        <groupId>io.micronaut.build</groupId>
        <artifactId>micronaut-maven-plugin</artifactId>
      </plugin>
      
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-compiler-plugin</artifactId>
        <configuration>
          <!-- Uncomment to enable incremental compilation -->
          <!-- <useIncrementalCompilation>false</useIncrementalCompilation> -->

          <annotationProcessorPaths combine.children="append">
            <path>
              <groupId>io.micronaut</groupId>
              <artifactId>micronaut-http-validation</artifactId>
              <version>3.5.2</version>
            </path>
          </annotationProcessorPaths>
          <compilerArgs>
            <arg>-Amicronaut.processing.group=com.example</arg>
            <arg>-Amicronaut.processing.module=demo</arg>
          </compilerArgs>
        </configuration>
      </plugin>
    </plugins>
  </build>

</project>
`;

const BUILD_GRADLE = `
plugins {
  id("com.github.johnrengelman.shadow") version "7.1.2"
  id("io.micronaut.application") version "3.4.1"
}

version = "0.1"
group = "com.example"

repositories {
  mavenCentral()
}

dependencies {
  annotationProcessor("io.micronaut:micronaut-http-validation")
  implementation("io.micronaut:micronaut-http-client")
  implementation("io.micronaut:micronaut-jackson-databind")
  implementation("jakarta.annotation:jakarta.annotation-api")
  runtimeOnly("ch.qos.logback:logback-classic")
  implementation("io.micronaut:micronaut-validation")

}


application {
  mainClass.set("com.example.Application")
}
java {
  sourceCompatibility = JavaVersion.toVersion("11")
  targetCompatibility = JavaVersion.toVersion("11")
}

graalvmNative.toolchainDetection = false
micronaut {
  runtime("netty")
  testRuntime("junit5")
  processing {
      incremental(true)
      annotations("com.example.*")
  }
}
`;
describe('project generator', () => {
  let tree: Tree;
  const options: ProjectGeneratorOptions = {
    name: 'mnapp',
    type: 'default',
    basePackage:'com.tinesoft', 
    buildSystem: 'MAVEN',
    micronautLaunchUrl: 'https://launch.micronaut.io'
  };

  const mockedFetch = (fetch as jest.MockedFunction<typeof fetch>);
  const mockedResponse = new Response(Readable.from(['micronaut.zip']));

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
    type             | buildSystem | buildFileName     | buildFileContent | wrapperName
    ${'default'} | ${'MAVEN'}  | ${'pom.xml'}      | ${POM_XML}       | ${'mvnw'}
    ${'default'} | ${'GRADLE'} | ${'build.gradle'} | ${BUILD_GRADLE}  | ${'gradlew'}
    ${'cli'}     | ${'MAVEN'}  | ${'pom.xml'}      | ${POM_XML}       | ${'mvnw'}
    ${'cli'}     | ${'GRADLE'} | ${'build.gradle'} | ${BUILD_GRADLE}  | ${'gradlew'}
    ${'function'} | ${'MAVEN'}  | ${'pom.xml'}      | ${POM_XML}       | ${'mvnw'}
    ${'function'} | ${'GRADLE'} | ${'build.gradle'} | ${BUILD_GRADLE}  | ${'gradlew'}
    ${'grpc'}     | ${'MAVEN'}  | ${'pom.xml'}      | ${POM_XML}       | ${'mvnw'}
    ${'grpc'}     | ${'GRADLE'} | ${'build.gradle'} | ${BUILD_GRADLE}  | ${'gradlew'}
    ${'messaging'} | ${'MAVEN'}  | ${'pom.xml'}      | ${POM_XML}       | ${'mvnw'}
    ${'messaging'} | ${'GRADLE'} | ${'build.gradle'} | ${BUILD_GRADLE}  | ${'gradlew'}
  `(`should download a micronaut '$type' build with $buildSystem`, async ({ type, buildSystem, buildFileName, buildFileContent, wrapperName }) => {

    const rootDir = 'apps';
    const downloadUrl = `${options.micronautLaunchUrl}/create/${type}/${options.basePackage}.${options.name}?build=${buildSystem}`;

    const zipFiles = [{ filePath: `${buildFileName}`, fileContent: buildFileContent}, `${wrapperName}`, `README.md`, ];
    const micronautZip = mockZipEntries(zipFiles);
    // mock the zip content returned by the real call to Micronaut Launch
    jest.spyOn(mockedResponse.body, 'pipe').mockReturnValue(syncToAsyncIterable(micronautZip));

    await projectGenerator(tree, { ...options, type, buildSystem});

    expect(mockedFetch).toHaveBeenCalledWith(
      downloadUrl,
      expect.objectContaining({
        headers: {
          'User-Agent': expect.stringContaining('@nxrocks_nx-micronaut/')
        }
      })
    );

    expect(logger.info).toHaveBeenNthCalledWith(1, `⬇️ Downloading Micronaut project zip from : '${downloadUrl}'...`);

    expect(logger.info).toHaveBeenNthCalledWith(2, `📦 Extracting Micronaut project zip to '${workspaceRoot}/${rootDir}/${options.name}'...`);
  });

  it('should update workspace.json', async () => {
    const zipFiles = [{ filePath: `pom.xml`, fileContent: POM_XML}, `mvnw`, `README.md`, ];
    const micronautZip = mockZipEntries(zipFiles);
    // mock the zip content returned by the real call to Micronaut Launch
    jest.spyOn(mockedResponse.body, 'pipe').mockReturnValue(syncToAsyncIterable(micronautZip));

    await projectGenerator(tree, options);
    const project = readProjectConfiguration(tree, options.name);
    expect(project.root).toBe(`apps/${options.name}`);

    const commands:BuilderCommandAliasType[] = ['run', 'serve', 'dockerfile', 'test', 'clean', 'format', 'apply-format', 'check-format', 'build', 'aot-sample-config'];
    commands.forEach(cmd => {
      expect(project.targets[cmd].executor).toBe(`${NX_MICRONAUT_PKG}:${cmd}`);
      if(['build', 'install'].includes(cmd)) { 
        expect(project.targets[cmd].outputs).toEqual([`${project.root}/target`]);
      }
    });
  });

  it('should add plugin to nx.json', async () => {
    const zipFiles = [{ filePath: `pom.xml`, fileContent: POM_XML}, `mvnw`, `README.md`, ];
    const micronautZip = mockZipEntries(zipFiles);
    // mock the zip content returned by the real call to Micronaut Launch
    jest.spyOn(mockedResponse.body, 'pipe').mockReturnValue(syncToAsyncIterable(micronautZip));

    
    await projectGenerator(tree, options);
    const nxJson = readJson(tree, 'nx.json');
    expect(nxJson.plugins).toEqual([NX_MICRONAUT_PKG]);
  });

  it.each`
  skipFormat      | expectedAction
  ${true}         | ${'not add'}
  ${false}        | ${'add'}
`(`should $expectedAction code formatting features if skipFormat=$skipFormat`, async ({ skipFormat }) => {

    const zipFiles = [{ filePath: `pom.xml`, fileContent: POM_XML}, `mvnw`, `README.md`, ];
    const micronautZip = mockZipEntries(zipFiles);
    // mock the zip content returned by the real call to Micronaut Launch
    jest.spyOn(mockedResponse.body, 'pipe').mockReturnValue(syncToAsyncIterable(micronautZip));

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
        expect(project.targets[cmd].executor).toBe(`${NX_MICRONAUT_PKG}:${cmd}`);
      });
    }
    expect(hasMavenPlugin(tree, `./apps/${options.name}`, SPOTLESS_MAVEN_PLUGIN_GROUP_ID, SPOTLESS_MAVEN_PLUGIN_ARTIFACT_ID)).toEqual(!skipFormat);
  });
});

