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
    projectType      | buildSystem         | buildFile         | wrapperName
    ${'application'} | ${'MAVEN'}  | ${'pom.xml'}      | ${'mvnw'}
    ${'application'} | ${'GRADLE'} | ${'build.gradle'} | ${'gradlew'}
    ${'library'}     | ${'MAVEN'}  | ${'pom.xml'}      | ${'mvnw'}
    ${'library'}     | ${'GRADLE'} | ${'build.gradle'} | ${'gradlew'}
  `(`should download a quarkus '$projectType' build with $buildSystem`, async ({ projectType, buildSystem, buildFile, wrapperName }) => {

    const rootDir = projectType === 'application' ? 'apps': 'libs';
    const downloadUrl = `${options.quarkusInitializerUrl}/d?b=${buildSystem}&g=${options.groupId}&a=${options.artifactId}`;

    const zipFiles = [`${options.artifactId}/${buildFile}`, `${options.artifactId}/${wrapperName}`, `${options.artifactId}/README.md`, ];
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
    await projectGenerator(tree, options);
    const project = readProjectConfiguration(tree, options.name);
    expect(project.root).toBe(`apps/${options.name}`);

    const commands:BuilderCommandAliasType[] = ['dev', 'remoteDev', 'test', 'clean', 'build', 'package', 'addExtension', 'listExtensions'];
    commands.forEach(cmd => {
      expect(project.targets[cmd].executor).toBe(`${NX_QUARKUS_PKG}:${cmd}`);
    });
  });

  it('should add plugin to nx.json', async () => {
    await projectGenerator(tree, options);
    const nxJson = readJson(tree, 'nx.json');
    expect(nxJson.plugins).toEqual([NX_QUARKUS_PKG]);

  });

});

