import { Tree, logger, readProjectConfiguration, readJson } from '@nrwl/devkit';
import { appRootPath } from '@nrwl/workspace/src/utils/app-root';

import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

import { projectGenerator } from './generator';
import { ProjectGeneratorOptions } from './schema';

import { Readable } from 'stream';

import * as path from 'path';

//mock 'node-fetch' to avoid making the actual call to Spring Initializer
jest.mock('node-fetch');
import fetch from 'node-fetch';
const { Response } = jest.requireActual('node-fetch');

//mock fs.chmodSync
jest.mock('fs');
import * as fs from 'fs';
import { mockZipEntries, syncToAsyncIterable } from '../../utils/test-utils';

describe('project generator', () => {
  let tree: Tree;
  const options: ProjectGeneratorOptions = {
    name: 'bootapp',
    projectType: 'application',
    springInitializerUrl: 'https://start.spring.io'
  };

  const mockedFetch = (fetch as jest.MockedFunction<typeof fetch>);
  const mockedResponse = new Response(Readable.from(['starter.zip']));

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    jest.spyOn(fs, 'chmodSync');
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
    ${'application'} | ${'maven-project'}  | ${'pom.xml'}      | ${'mvnw'}
    ${'application'} | ${'gradle-project'} | ${'build.gradle'} | ${'gradlew'}
    ${'library'}     | ${'maven-project'}  | ${'pom.xml'}      | ${'mvnw'}
    ${'library'}     | ${'gradle-project'} | ${'build.gradle'} | ${'gradlew'}
  `(`should download a spring boot '$projectType' build with $buildSystem`, async ({ projectType, buildSystem, buildFile, wrapperName }) => {

    const rootDir = projectType === 'application' ? 'apps': 'libs';
    const downloadUrl = `${options.springInitializerUrl}/starter.zip?type=${buildSystem}&name=${options.name}`;

    tree.write(`/${rootDir}/${options.name}/${buildFile}`, '');

    const zipFiles = [`${buildFile}`, `${wrapperName}`, 'README.md', ];
    const starterZip = mockZipEntries(zipFiles);
    // mock the zip content returned by the real call to Spring Initializer
    jest.spyOn(mockedResponse.body, 'pipe').mockReturnValue(syncToAsyncIterable(starterZip));

    await projectGenerator(tree, { ...options, projectType, buildSystem});

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

    expect(fs.chmodSync).toHaveBeenCalledWith(expect.stringContaining(path.normalize(`${rootDir}/${options.name}/${wrapperName}`)), 0o755);

    if (buildSystem === 'gradle-project') {
      expect(logger.debug).toHaveBeenCalledWith(`Adding 'buildInfo' task to the build.gradle file...`);
    }
  });

  it('should update workspace.json', async () => {
    await projectGenerator(tree, options);
    const project = readProjectConfiguration(tree, options.name);
    expect(project.root).toBe(`apps/${options.name}`);

    const commands = ['run', 'serve', 'test', 'clean', 'buildJar', 'buildWar', 'buildImage', 'buildInfo'];
    commands.forEach(cmd => {
      expect(project.targets[cmd].executor).toBe(`@nxrocks/nx-spring-boot:${cmd}`);
    });
  });

  it('should add plugin to nx.json', async () => {
    await projectGenerator(tree, options);
    const nxJson = readJson(tree, 'nx.json');
    expect(nxJson.plugins).toEqual(['@nxrocks/nx-spring-boot']);

  });

});

