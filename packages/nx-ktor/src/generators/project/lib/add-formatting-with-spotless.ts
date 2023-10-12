import { Tree } from '@nx/devkit';
import {
  addSpotlessGradlePlugin,
  addSpotlessMavenPlugin,
} from '@nxrocks/common-jvm';
import { NormalizedSchema } from '../schema';

export function addFormattingWithSpotless(
  tree: Tree,
  options: NormalizedSchema
) {
  if (options.buildSystem === 'MAVEN') {
    addSpotlessMavenPlugin(tree, options.projectRoot, 'kotlin', 11);
  } else {
    addSpotlessGradlePlugin(
      tree,
      options.projectRoot,
      'kotlin',
      11,
      null,
      options.buildSystem === 'GRADLE_KTS'
    );
  }
}
