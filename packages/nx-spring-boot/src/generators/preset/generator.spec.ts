import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { presetGenerator } from './generator';
import { PresetGeneratorSchema } from './schema';

import { Readable } from 'stream';

//mock 'node-fetch' to avoid making the actual call to Spring Initializer
jest.mock('node-fetch');
import fetch from 'node-fetch';
const { Response } = jest.requireActual('node-fetch');

import { mockZipStream } from '@nxrocks/common-jvm/testing';
import { DEFAULT_SPRING_INITIALIZR_URL } from '../../utils/boot-utils';
import { POM_XML } from '../project/generator.spec';

describe('preset generator', () => {
  let tree: Tree;
  const options: PresetGeneratorSchema = {
    directory: 'bootapp',
    projectType: 'application',
    springInitializerUrl: DEFAULT_SPRING_INITIALIZR_URL,
    language: 'java',
    buildSystem: 'maven-project',
  };

  const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;
  const mockedResponse = new Response(Readable.from(['starter.zip']));

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    jest.spyOn(mockedResponse.body, 'pipe').mockReturnValue(mockZipStream([]));
    mockedFetch.mockResolvedValue(mockedResponse);

    const zipFiles = [
      { filePath: 'pom.xml', fileContent: POM_XML },
      'mvnw',
      'README.md',
    ];
    // mock the zip content returned by the real call to Spring Initializer
    jest
      .spyOn(mockedResponse.body, 'pipe')
      .mockReturnValue(mockZipStream(zipFiles));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should run successfully', async () => {
    await presetGenerator(tree, options);
    const config = readProjectConfiguration(tree, options.name);
    expect(config).toBeDefined();
  });
});
