import {
  Tree,
  logger,
  readProjectConfiguration,
  readJson,
  workspaceRoot,
  joinPathFragments,
} from '@nx/devkit';

import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { projectGenerator } from './generator';
import { NormalizedSchema, ProjectGeneratorOptions } from './schema';

import { Readable } from 'stream';

//mock 'node-fetch' to avoid making the actual call to Micronaut Launch
jest.mock('node-fetch');
import fetch from 'node-fetch';
const { Response } = jest.requireActual('node-fetch');

import { NX_MICRONAUT_PKG } from '../../index';
import {
  BuilderCommandAliasType,
  hasMavenPluginInTree,
  SPOTLESS_MAVEN_PLUGIN_ARTIFACT_ID,
  SPOTLESS_MAVEN_PLUGIN_GROUP_ID,
} from '@nxrocks/common-jvm';
import { mockZipStream } from '@nxrocks/common-jvm/testing';
import { DEFAULT_MICRONAUT_LAUNCH_URL } from '../../utils/micronaut-utils';
import { normalizeOptions } from './lib';
import { getProjectTypeAndTargetsFromOptions } from '../../utils/plugin-utils';
import { normalizePluginOptions } from '../../graph/plugin';

export const POM_XML = `<?xml version="1.0" encoding="UTF-8"?>
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
const defaultPluginOptions = normalizePluginOptions();
describe('project generator', () => {
  let tree: Tree;
  let options: NormalizedSchema;
  const _options: ProjectGeneratorOptions = {
    directory: 'mnapp',
    projectType: 'default',
    basePackage: 'com.tinesoft',
    buildSystem: 'MAVEN',
    micronautLaunchUrl: DEFAULT_MICRONAUT_LAUNCH_URL,
  };

  const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;
  const mockedResponse = new Response(Readable.from(['micronaut.zip']));

  beforeEach(async () => {
    tree = createTreeWithEmptyWorkspace();
    options = await normalizeOptions(tree, _options);
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
    ${'default'}   | ${'MAVEN'}  | ${'pom.xml'}      | ${POM_XML}       | ${'mvnw'}
    ${'default'}   | ${'GRADLE'} | ${'build.gradle'} | ${BUILD_GRADLE}  | ${'gradlew'}
    ${'cli'}       | ${'MAVEN'}  | ${'pom.xml'}      | ${POM_XML}       | ${'mvnw'}
    ${'cli'}       | ${'GRADLE'} | ${'build.gradle'} | ${BUILD_GRADLE}  | ${'gradlew'}
    ${'function'}  | ${'MAVEN'}  | ${'pom.xml'}      | ${POM_XML}       | ${'mvnw'}
    ${'function'}  | ${'GRADLE'} | ${'build.gradle'} | ${BUILD_GRADLE}  | ${'gradlew'}
    ${'grpc'}      | ${'MAVEN'}  | ${'pom.xml'}      | ${POM_XML}       | ${'mvnw'}
    ${'grpc'}      | ${'GRADLE'} | ${'build.gradle'} | ${BUILD_GRADLE}  | ${'gradlew'}
    ${'messaging'} | ${'MAVEN'}  | ${'pom.xml'}      | ${POM_XML}       | ${'mvnw'}
    ${'messaging'} | ${'GRADLE'} | ${'build.gradle'} | ${BUILD_GRADLE}  | ${'gradlew'}
  `(
    `should download a micronaut '$type' build with $buildSystem`,
    async ({
      projectType,
      buildSystem,
      buildFileName,
      buildFileContent,
      wrapperName,
    }) => {
      const rootDir = '.';
      const downloadUrl = `${options.micronautLaunchUrl}/create/${projectType}/${options.basePackage}.${options.name}?build=${buildSystem}`;

      const zipFiles = [
        { filePath: `${buildFileName}`, fileContent: buildFileContent },
        `${wrapperName}`,
        `README.md`,
      ];
      // mock the zip content returned by the real call to Micronaut Launch
      jest
        .spyOn(mockedResponse.body, 'pipe')
        .mockReturnValue(mockZipStream(zipFiles));

      await projectGenerator(tree, { ...options, projectType, buildSystem });

      expect(mockedFetch).toHaveBeenCalledWith(
        downloadUrl,
        expect.objectContaining({
          headers: {
            'User-Agent': expect.stringContaining('@nxrocks_nx-micronaut/'),
          },
        })
      );

      expect(logger.info).toHaveBeenNthCalledWith(
        2,
        `⬇️ Downloading Micronaut project zip from : '${downloadUrl}'...`
      );

      expect(logger.info).toHaveBeenNthCalledWith(
        3,
        `📦 Extracting Micronaut project zip to '${joinPathFragments(
          workspaceRoot,
          rootDir,
          options.name
        )}'...`
      );
    }
  );

  it('should update project.json', async () => {
    const zipFiles = [
      { filePath: `pom.xml`, fileContent: POM_XML },
      `mvnw`,
      `README.md`,
    ];
    // mock the zip content returned by the real call to Micronaut Launch
    jest
      .spyOn(mockedResponse.body, 'pipe')
      .mockReturnValue(mockZipStream(zipFiles));

    await projectGenerator(tree, options);
    const project = readProjectConfiguration(tree, options.name);
    project.targets = getProjectTypeAndTargetsFromOptions(options).targets;
    expect(project.root).toBe(`${options.name}`);

    const commands: BuilderCommandAliasType[] = [
      defaultPluginOptions.installTargetName,
      defaultPluginOptions.runTargetName,
      defaultPluginOptions.serveTargetName,
      defaultPluginOptions.dockerfileTargetName,
      defaultPluginOptions.testTargetName,
      defaultPluginOptions.cleanTargetName,
      defaultPluginOptions.formatTargetName,
      defaultPluginOptions.applyFormatTargetName,
      defaultPluginOptions.checkFormatTargetName,
      defaultPluginOptions.buildTargetName,
      defaultPluginOptions.aotSampleConfigTargetName,
    ];
    commands.forEach((cmd) => {
      expect(project.targets?.[cmd].executor).toBe(
        `${NX_MICRONAUT_PKG}:${cmd}`
      );
      if (
        [
          defaultPluginOptions.buildTargetName,
          defaultPluginOptions.installTargetName,
          defaultPluginOptions.testTargetName,
        ].includes(cmd)
      ) {
        expect(project.targets?.[cmd].outputs).toEqual([
          `{workspaceRoot}/${project.root}/target`,
        ]);
      }

      if (
        [
          defaultPluginOptions.buildTargetName,
          defaultPluginOptions.installTargetName,
          defaultPluginOptions.runTargetName,
          defaultPluginOptions.serveTargetName,
        ].includes(cmd)
      ) {
        expect(project.targets?.[cmd].dependsOn).toEqual([
          `^${defaultPluginOptions.installTargetName}`,
        ]);
      }
    });
  });

  it('should add plugin to nx.json', async () => {
    const zipFiles = [
      { filePath: `pom.xml`, fileContent: POM_XML },
      `mvnw`,
      `README.md`,
    ];
    // mock the zip content returned by the real call to Micronaut Launch
    jest
      .spyOn(mockedResponse.body, 'pipe')
      .mockReturnValue(mockZipStream(zipFiles));

    await projectGenerator(tree, options);
    const nxJson = readJson(tree, 'nx.json');
    expect(nxJson.plugins).toMatchInlineSnapshot(`
      [
        {
          "options": {
            "aotSampleConfigTargetName": "aot-sample-config",
            "applyFormatTargetName": "apply-format",
            "buildTargetName": "build",
            "checkFormatTargetName": "check-format",
            "cleanTargetName": "clean",
            "dockerfileTargetName": "dockerfile",
            "formatTargetName": "format",
            "installTargetName": "install",
            "runTargetName": "run",
            "serveTargetName": "serve",
            "testTargetName": "test",
          },
          "plugin": "@nxrocks/nx-micronaut",
        },
      ]
    `);
  });

  it.each`
    skipFormat | expectedAction
    ${true}    | ${'not add'}
    ${false}   | ${'add'}
  `(
    `should $expectedAction code formatting features if skipFormat=$skipFormat`,
    async ({ skipFormat }) => {
      const zipFiles = [
        { filePath: `pom.xml`, fileContent: POM_XML },
        `mvnw`,
        `README.md`,
      ];
      // mock the zip content returned by the real call to Micronaut Launch
      jest
        .spyOn(mockedResponse.body, 'pipe')
        .mockReturnValue(mockZipStream(zipFiles));

      await projectGenerator(tree, { ...options, skipFormat });

      const project = readProjectConfiguration(tree, options.name);
      if (!skipFormat)
        project.targets = getProjectTypeAndTargetsFromOptions(options).targets;
      const formatCommands = [
        defaultPluginOptions.formatTargetName,
        defaultPluginOptions.applyFormatTargetName,
        defaultPluginOptions.checkFormatTargetName,
      ];

      if (skipFormat) {
        // expect project.targets not to have the format commands
        formatCommands.forEach((cmd) => {
          expect(project.targets?.[cmd]).toBeUndefined();
        });
      } else {
        // expect project.targets to have the format commands
        formatCommands.forEach((cmd) => {
          expect(project.targets?.[cmd].executor).toBe(
            `${NX_MICRONAUT_PKG}:${cmd}`
          );
        });
      }
      expect(
        hasMavenPluginInTree(
          tree,
          `./${options.name}`,
          SPOTLESS_MAVEN_PLUGIN_GROUP_ID,
          SPOTLESS_MAVEN_PLUGIN_ARTIFACT_ID
        )
      ).toEqual(!skipFormat);
    }
  );
});
