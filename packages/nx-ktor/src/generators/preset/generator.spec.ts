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
import { DEFAULT_KTOR_INITIALIZR_URL } from '../../utils/ktor-utils';
import { POM_XML } from '../project/generator.spec';

describe('preset generator', () => {
  let tree: Tree;
  const options: PresetGeneratorSchema = {
    directory: 'ktapp',
    groupId: 'com.tinesoft',
    artifactId: 'ktapp',
    buildSystem: 'MAVEN',
    engine: 'NETTY',
    configurationLocation: 'CODE',
    ktorInitializrUrl: DEFAULT_KTOR_INITIALIZR_URL,
  };

  const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;
  const mockedResponse = new Response(Readable.from(['ktor.zip']));

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
    const config = readProjectConfiguration(tree, 'ktapp');
    expect(config).toBeDefined();
  });
});
