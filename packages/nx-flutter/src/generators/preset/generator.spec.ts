import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { presetGenerator } from './generator';
import { PresetGeneratorSchema } from './schema';

jest.mock('child_process'); // we need to mock 'execSync' so that it doesn't really run 'flutter' (reserved to e2e testing) (see __mocks__/child_process.js)

//jest.mock('enquirer'); // we mock 'enquirer' to bypass the interactive prompt
import * as enquirer from 'enquirer';

process.env['NX_INTERACTIVE'] = 'true'; // simulate normal cli interactive mode (the prompt is mocked anyway)

describe('preset generator', () => {
  let tree: Tree;
  const options: PresetGeneratorSchema = {
    prjName: 'testapp',
    template: 'app',
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    jest.spyOn(enquirer,'prompt').mockResolvedValue(
      {
        androidLanguage: 'kotlin',
        iosLanguage: 'swift',
        platforms: ['android', 'ios', 'web', 'linux', 'windows', 'macos'],
      }
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should run successfully', async () => {
    await presetGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'testapp');
    expect(config).toBeDefined();
  });
});
