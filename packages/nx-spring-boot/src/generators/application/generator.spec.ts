import { Tree, logger, readProjectConfiguration } from '@nrwl/devkit';
import { appRootPath } from '@nrwl/workspace/src/utils/app-root';

import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import each from 'jest-each';

import { applicationGenerator } from './generator';
import { ApplicationGeneratorOptions } from './schema';

import { Readable } from 'stream';

//mock 'node-fetch' to avoid making the actual call to Spring Initializer
jest.mock('node-fetch');
import fetch from 'node-fetch';
const { Response } = jest.requireActual('node-fetch');

//mock fs.chmodSync
jest.mock('fs');
import * as fs from 'fs';

describe('application generator', () => {
  let tree: Tree;
  const options: ApplicationGeneratorOptions = {
    name: 'bootapp',
    springInitializerUrl: 'https://start.spring.io'
  };

  const mockedFetch = (fetch as jest.MockedFunction<typeof fetch>);
  const mockedResponse = new Response(Readable.from(['starter.zip']));

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    jest.spyOn(fs, 'chmodSync').mockReset();
    jest.spyOn(logger, 'info');
    jest.spyOn(logger, 'debug');
    jest.spyOn(mockedResponse.body, 'pipe').mockReturnValue({ promise: () => jest.fn() });
    mockedFetch.mockResolvedValue(mockedResponse);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  each`
    type                | buildFile      | wrapperName
    ${'maven-project'}  | ${'pom.xml'}   | ${'mvnw'}
    ${'gradle-project'} | ${'build.gradle'} | ${'gradlew'}
  `.it('should download a spring boot projet of type=$type', async ({ type, buildFile, wrapperName }) => {

    tree.write(`/apps/${options.name}/${buildFile}`, '');

    await applicationGenerator(tree, { ...options, type});

    expect(mockedFetch).toHaveBeenCalledWith(
      `${options.springInitializerUrl}/starter.zip?type=${type}&name=${options.name}`,
      expect.objectContaining({
        headers: {
          'User-Agent': expect.stringContaining('@nxrocks_nx-spring-boot/')
        }
      })
    );

    expect(logger.info).toHaveBeenNthCalledWith(1, `Downloading Spring Boot project zip from : ${options.springInitializerUrl}/starter.zip?type=${type}&name=${options.name}...`);

    expect(logger.info).toHaveBeenNthCalledWith(2, `Extracting Spring Boot project zip to '${appRootPath}/apps/${options.name}'...`);

    expect(logger.debug).toHaveBeenNthCalledWith(1, `Restoring write permission on wrapper executable at '${appRootPath}/apps/${options.name}/${wrapperName}'...`);

    expect(fs.chmodSync).toHaveBeenCalledWith(expect.stringContaining(`/apps/${options.name}/${wrapperName}`), 0o755);

    if (type === 'gradle-project') {
      expect(logger.debug).toHaveBeenNthCalledWith(2, `Adding 'buildInfo' task to the build.gradle file...`);
    }
  });

  it('should update workspace.json', async () => {
    await applicationGenerator(tree, options);
    const project = readProjectConfiguration(tree, options.name);
    expect(project.root).toBe(`apps/${options.name}`);

    const commands = ['run', 'serve', 'test', 'clean', 'buildJar', 'buildWar', 'buildImage', 'buildInfo'];
    commands.forEach(cmd => {
      expect(project.targets[cmd].executor).toBe(`@nxrocks/nx-spring-boot:${cmd}`);
    });
  });

});

