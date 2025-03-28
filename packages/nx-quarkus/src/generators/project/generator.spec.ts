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

//mock 'node-fetch' to avoid making the actual call to Quarkus Initializer
jest.mock('node-fetch');
import fetch from 'node-fetch';
const { Response } = jest.requireActual('node-fetch');

import { NX_QUARKUS_PKG } from '../../index';
import {
  BuilderCommandAliasType,
  hasMavenPluginInTree,
  SPOTLESS_MAVEN_PLUGIN_ARTIFACT_ID,
  SPOTLESS_MAVEN_PLUGIN_GROUP_ID,
} from '@nxrocks/common-jvm';
import { mockZipStream } from '@nxrocks/common-jvm/testing';
import { DEFAULT_QUARKUS_INITIALIZR_URL } from '../../utils/quarkus-utils';
import { normalizeOptions } from './lib';
import { getProjectTypeAndTargetsFromOptions } from '../../utils/plugin-utils';
import { normalizePluginOptions } from '../../graph/plugin';

export const POM_XML = `<?xml version="1.0"?>
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

const defaultPluginOptions = normalizePluginOptions();
describe('project generator', () => {
  let tree: Tree;
  let options: NormalizedSchema;
  const _options: ProjectGeneratorOptions = {
    directory: 'quarkusapp',
    projectType: 'application',
    groupId: 'com.tinesoft',
    artifactId: 'demo',
    buildSystem: 'MAVEN',
    javaVersion: '17',
    quarkusInitializerUrl: DEFAULT_QUARKUS_INITIALIZR_URL,
  };

  const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;
  const mockedResponse = new Response(Readable.from(['quarkus.zip']));

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
    projectType      | buildSystem | buildFileName     | buildFileContent | wrapperName
    ${'application'} | ${'MAVEN'}  | ${'pom.xml'}      | ${POM_XML}       | ${'mvnw'}
    ${'application'} | ${'GRADLE'} | ${'build.gradle'} | ${BUILD_GRADLE}  | ${'gradlew'}
    ${'library'}     | ${'MAVEN'}  | ${'pom.xml'}      | ${POM_XML}       | ${'mvnw'}
    ${'library'}     | ${'GRADLE'} | ${'build.gradle'} | ${BUILD_GRADLE}  | ${'gradlew'}
  `(
    `should download a quarkus '$projectType' build with $buildSystem`,
    async ({
      projectType,
      buildSystem,
      buildFileName,
      buildFileContent,
      wrapperName,
    }) => {
      const rootDir = '.';
      const downloadUrl = `${options.quarkusInitializerUrl}/d?b=${buildSystem}&j=${options.javaVersion}&g=${options.groupId}&a=${options.artifactId}`;

      const zipFiles = [
        {
          filePath: `${options.artifactId}/${buildFileName}`,
          fileContent: buildFileContent,
        },
        `${options.artifactId}/${wrapperName}`,
        `${options.artifactId}/README.md`,
      ];
      // mock the zip content returned by the real call to Quarkus Initializer
      jest
        .spyOn(mockedResponse.body, 'pipe')
        .mockReturnValue(mockZipStream(zipFiles));

      await projectGenerator(tree, { ...options, projectType, buildSystem });

      expect(mockedFetch).toHaveBeenCalledWith(
        downloadUrl,
        expect.objectContaining({
          headers: {
            'User-Agent': expect.stringContaining('@nxrocks_nx-quarkus/'),
          },
        })
      );

      expect(logger.info).toHaveBeenNthCalledWith(
        2,
        `⬇️ Downloading Quarkus project zip from : ${downloadUrl}...`
      );

      expect(logger.info).toHaveBeenNthCalledWith(
        3,
        `📦 Extracting Quarkus project zip to '${joinPathFragments(
          workspaceRoot,
          rootDir,
          options.name
        )}'...`
      );
    }
  );
  it.each`
    projectType
    ${'application'}
    ${'library'}
  `(
    `should update project.json for '$projectType'`,
    async ({ projectType }) => {
      const zipFiles = [
        { filePath: `${options.artifactId}/pom.xml`, fileContent: POM_XML },
        `${options.artifactId}/mvnw`,
        `${options.artifactId}/README.md`,
      ];
      // mock the zip content returned by the real call to Quarkus Initializer
      jest
        .spyOn(mockedResponse.body, 'pipe')
        .mockReturnValue(mockZipStream(zipFiles));

      await projectGenerator(tree, { ...options, projectType });

      const project = readProjectConfiguration(tree, options.name);
      project.targets = getProjectTypeAndTargetsFromOptions(options).targets;
      expect(project.root).toBe(`${options.name}`);

      const commands: BuilderCommandAliasType[] = [
        defaultPluginOptions.installTargetName,
        defaultPluginOptions.testTargetName,
        defaultPluginOptions.cleanTargetName,
        defaultPluginOptions.buildTargetName,
        defaultPluginOptions.formatTargetName,
        defaultPluginOptions.applyFormatTargetName,
        defaultPluginOptions.checkFormatTargetName,
      ];

      const appOnlyCommands = [
        defaultPluginOptions.devTargetName,
        defaultPluginOptions.serveTargetName,
        defaultPluginOptions.remoteDevTargetName,
        defaultPluginOptions.packageTargetName,
        defaultPluginOptions.addExtensionTargetName,
        defaultPluginOptions.listExtensionsTargetName,
      ];

      if (projectType === 'application') {
        commands.push(...appOnlyCommands);
      }

      commands.forEach((cmd) => {
        expect(project.targets?.[cmd].executor).toBe(
          `${NX_QUARKUS_PKG}:${cmd}`
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
            defaultPluginOptions.devTargetName,
            defaultPluginOptions.remoteDevTargetName,
            defaultPluginOptions.serveTargetName,
          ].includes(cmd)
        ) {
          expect(project.targets?.[cmd].dependsOn).toEqual([
            `^${defaultPluginOptions.installTargetName}`,
          ]);
        }
      });
    }
  );

  it('should add plugin to nx.json', async () => {
    const zipFiles = [
      { filePath: `${options.artifactId}/pom.xml`, fileContent: POM_XML },
      `${options.artifactId}/mvnw`,
      `${options.artifactId}/README.md`,
    ];
    // mock the zip content returned by the real call to Quarkus Initializer
    jest
      .spyOn(mockedResponse.body, 'pipe')
      .mockReturnValue(mockZipStream(zipFiles));

    await projectGenerator(tree, options);
    const nxJson = readJson(tree, 'nx.json');
    expect(nxJson.plugins).toMatchInlineSnapshot(`
      [
        {
          "options": {
            "addExtensionTargetName": "add-extension",
            "applyFormatTargetName": "apply-format",
            "buildTargetName": "build",
            "checkFormatTargetName": "check-format",
            "cleanTargetName": "clean",
            "devTargetName": "dev",
            "formatTargetName": "format",
            "installTargetName": "install",
            "listExtensionsTargetName": "list-extensions",
            "packageTargetName": "package",
            "remoteDevTargetName": "remote-dev",
            "serveTargetName": "serve",
            "testTargetName": "test",
          },
          "plugin": "@nxrocks/nx-quarkus",
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
        { filePath: `${options.artifactId}/pom.xml`, fileContent: POM_XML },
        `${options.artifactId}/mvnw`,
        `${options.artifactId}/README.md`,
      ];
      // mock the zip content returned by the real call to Quarkus Initializer
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
            `${NX_QUARKUS_PKG}:${cmd}`
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
