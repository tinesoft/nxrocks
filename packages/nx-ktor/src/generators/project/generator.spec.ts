import { Tree, logger, readProjectConfiguration, readJson, workspaceRoot } from '@nrwl/devkit';

import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

import { projectGenerator } from './generator';
import { ProjectGeneratorOptions } from './schema';

import { Readable } from 'stream';

//mock 'node-fetch' to avoid making the actual call to Ktor Launch
jest.mock('node-fetch');
import fetch from 'node-fetch';
const { Response } = jest.requireActual('node-fetch');

import { BuilderCommandAliasType, hasMavenPlugin, NX_KTOR_PKG, SPOTLESS_MAVEN_PLUGIN_ARTIFACT_ID, SPOTLESS_MAVEN_PLUGIN_GROUP_ID,  } from '@nxrocks/common';
import { mockZipStream } from '@nxrocks/common/testing';
import { DEFAULT_KTOR_INITIALIZR_URL } from '../../utils/ktor-utils';

const POM_XML = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.example</groupId>
    <artifactId>com-example-ktor-sampled</artifactId>
    <version>0.0.1</version>
    <name>com.example.ktor-sampled</name>
    <description>com.example.ktor-sampled</description>
    <properties>
        <ktor_version>2.2.3</ktor_version>
        <kotlin.code.style>official</kotlin.code.style>
        <kotlin_version>1.8.10</kotlin_version>
        <logback_version>1.2.11</logback_version>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <kotlin.compiler.incremental>true</kotlin.compiler.incremental>
        <main.class>io.ktor.server.jetty.EngineMain</main.class>
    </properties>
    <repositories>
    </repositories>
    <dependencies>
        <dependency>
            <groupId>io.ktor</groupId>
            <artifactId>ktor-server-core-jvm</artifactId>
            <version>$\{ktor_version}</version>
        </dependency>
        <dependency>
            <groupId>io.ktor</groupId>
            <artifactId>ktor-server-jetty-jvm</artifactId>
            <version>$\{ktor_version}</version>
        </dependency>
        <dependency>
            <groupId>ch.qos.logback</groupId>
            <artifactId>logback-classic</artifactId>
            <version>$\{logback_version}</version>
        </dependency>
        <dependency>
            <groupId>io.ktor</groupId>
            <artifactId>ktor-server-config-yaml-jvm</artifactId>
            <version>$\{ktor_version}</version>
        </dependency>
        <dependency>
            <groupId>io.ktor</groupId>
            <artifactId>ktor-server-tests-jvm</artifactId>
            <version>$\{ktor_version}</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-test-junit</artifactId>
            <version>$\{kotlin_version}</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.jetbrains.kotlinx</groupId>
            <artifactId>kotlinx-coroutines-debug</artifactId>
            <version>1.6.4</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
    <build>
        <sourceDirectory>$\{project.basedir}/src/main/kotlin</sourceDirectory>
        <testSourceDirectory>$\{project.basedir}/src/test/kotlin</testSourceDirectory>
        <resources>
            <resource>
                <directory>$\{project.basedir}/src/main/resources</directory>
            </resource>
        </resources>

        <plugins>
            <plugin>
                <artifactId>kotlin-maven-plugin</artifactId>
                <groupId>org.jetbrains.kotlin</groupId>
                <version>$\{kotlin_version}</version>
                <configuration>
                    <jvmTarget>1.8</jvmTarget>
                </configuration>
                <executions>
                    <execution>
                        <id>compile</id>
                        <phase>compile</phase>
                        <goals>
                            <goal>compile</goal>
                        </goals>
                    </execution>
                    <execution>
                        <id>test-compile</id>
                        <phase>test-compile</phase>
                        <goals>
                            <goal>test-compile</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
            <plugin>
                <groupId>org.codehaus.mojo</groupId>
                <artifactId>exec-maven-plugin</artifactId>
                <version>1.2.1</version>
                <executions>
                    <execution>
                        <goals>
                            <goal>java</goal>
                        </goals>
                    </execution>
                </executions>
                <configuration>
                    <mainClass>$\{main.class}</mainClass>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-assembly-plugin</artifactId>
                <version>2.6</version>
                <configuration>
                    <descriptorRefs>
                        <descriptorRef>jar-with-dependencies</descriptorRef>
                    </descriptorRefs>
                    <archive>
                        <manifest>
                            <addClasspath>true</addClasspath>
                            <mainClass>$\{main.class}</mainClass>
                        </manifest>
                    </archive>
                </configuration>
                <executions>
                    <execution>
                        <id>assemble-all</id>
                        <phase>package</phase>
                        <goals>
                            <goal>single</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>
`;

const BUILD_GRADLE = `
plugins {
  id 'org.jetbrains.kotlin.jvm' version '1.8.10'
  id 'io.ktor.plugin' version '2.2.3'
}

group "com.example"
version "0.0.1"
mainClassName = "io.ktor.server.jetty.EngineMain"

def isDevelopment = project.ext.has("development")
applicationDefaultJvmArgs = ["-Dio.ktor.development=$isDevelopment"]

repositories {
  mavenCentral()
}

dependencies {
  implementation "io.ktor:ktor-server-cors-jvm:$ktor_version"
  implementation "io.ktor:ktor-server-core-jvm:$ktor_version"
  implementation "io.ktor:ktor-server-auth-jvm:$ktor_version"
  implementation "io.ktor:ktor-server-jetty-jvm:$ktor_version"
  implementation "ch.qos.logback:logback-classic:$logback_version"
  implementation "io.ktor:ktor-server-config-yaml:$ktor_version"
  testImplementation "io.ktor:ktor-server-tests-jvm:$ktor_version"
  testImplementation "org.jetbrains.kotlin:kotlin-test-junit:$kotlin_version"
}
`;
describe('project generator', () => {
  let tree: Tree;
  const options: ProjectGeneratorOptions = {
    name: 'ktapp',
    projectType: 'application',
    groupId:'com.tinesoft',
    artifactId:'ktapp', 
    buildSystem: 'MAVEN',
    engine: 'NETTY',
    configurationLocation: 'CODE',
    ktorInitializrUrl: DEFAULT_KTOR_INITIALIZR_URL
  };

  const mockedFetch = (fetch as jest.MockedFunction<typeof fetch>);
  const mockedResponse = new Response(Readable.from(['ktor.zip']));

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
  projectType    | buildSystem | buildFileName     | buildFileContent | wrapperName
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
  `(`should download a ktor '$type' build with $buildSystem`, async ({ projectType, buildSystem, buildFileName, buildFileContent, wrapperName }) => {

    const rootDir = 'apps';
    const downloadUrl = `${options.ktorInitializrUrl}/project/generate`;

    const zipFiles = [{ filePath: `${buildFileName}`, fileContent: buildFileContent}, `${wrapperName}`, `README.md`, ];
    // mock the zip content returned by the real call to Ktor Launch
    jest.spyOn(mockedResponse.body, 'pipe').mockReturnValue(mockZipStream(zipFiles));

    await projectGenerator(tree, { ...options, projectType, buildSystem});

    expect(mockedFetch).toHaveBeenCalledWith(
      downloadUrl,
      expect.objectContaining({
        headers: {
          "Content-Type": "application/json", 
          'User-Agent': expect.stringContaining('@nxrocks_nx-ktor/'),
        },
        method: "POST"

      })
    );

    expect(logger.info).toHaveBeenNthCalledWith(1, `⬇️ Downloading Ktor project zip from : '${downloadUrl}'...`);

    expect(logger.info).toHaveBeenNthCalledWith(2, `📦 Extracting Ktor project zip to '${workspaceRoot}/${rootDir}/${options.name}'...`);
  });

  it('should update workspace.json', async () => {
    const zipFiles = [{ filePath: `pom.xml`, fileContent: POM_XML}, `mvnw`, `README.md`, ];
    // mock the zip content returned by the real call to Ktor Launch
    jest.spyOn(mockedResponse.body, 'pipe').mockReturnValue(mockZipStream(zipFiles));

    await projectGenerator(tree, options);
    const project = readProjectConfiguration(tree, options.name);
    expect(project.root).toBe(`apps/${options.name}`);

    const commands:BuilderCommandAliasType[] = ['run', 'serve', 'test', 'clean','build', 'build-image', 'publish-image', 'publish-image-locally', 'run-docker'];
    commands.forEach(cmd => {
      expect(project.targets[cmd].executor).toBe(`${NX_KTOR_PKG}:${cmd}`);
      if(['build', 'build-image', 'install', 'test'].includes(cmd)) { 
        expect(project.targets[cmd].outputs).toEqual([`{workspaceRoot}/${project.root}/target`]);
      }
      if(['publish-image', 'publish-image-locally', 'run-docker'].includes(cmd)) { 
        expect(project.targets[cmd].dependsOn).toEqual([`build-image`]);
      }
    });
  });

  it('should add plugin to nx.json', async () => {
    const zipFiles = [{ filePath: `pom.xml`, fileContent: POM_XML}, `mvnw`, `README.md`, ];
    // mock the zip content returned by the real call to Ktor Launch
    jest.spyOn(mockedResponse.body, 'pipe').mockReturnValue(mockZipStream(zipFiles));

    
    await projectGenerator(tree, options);
    const nxJson = readJson(tree, 'nx.json');
    expect(nxJson.plugins).toEqual([NX_KTOR_PKG]);
  });

  it.each`
  skipFormat      | expectedAction
  ${true}         | ${'not add'}
  ${false}        | ${'add'}
`(`should $expectedAction code formatting features if skipFormat=$skipFormat`, async ({ skipFormat }) => {

    const zipFiles = [{ filePath: `pom.xml`, fileContent: POM_XML}, `mvnw`, `README.md`, ];
    // mock the zip content returned by the real call to Ktor Launch
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
        expect(project.targets[cmd].executor).toBe(`${NX_KTOR_PKG}:${cmd}`);
      });
    }
    expect(hasMavenPlugin(tree, `./apps/${options.name}`, SPOTLESS_MAVEN_PLUGIN_GROUP_ID, SPOTLESS_MAVEN_PLUGIN_ARTIFACT_ID)).toEqual(!skipFormat);
  });
});

