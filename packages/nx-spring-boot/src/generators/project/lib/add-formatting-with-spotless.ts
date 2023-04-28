import { Tree } from '@nx/devkit';
import {
  addSpotlessGradlePlugin,
  addSpotlessMavenPlugin,
} from '@nxrocks/common';
import { NormalizedSchema } from '../schema';

export function addFormattingWithSpotless(
  tree: Tree,
  options: NormalizedSchema
) {
  if (options.buildSystem === 'maven-project') {
    addSpotlessMavenPlugin(
      tree,
      options.projectRoot,
      options.language,
      +options.javaVersion
    );
  } else {
    addSpotlessGradlePlugin(
      tree,
      options.projectRoot,
      options.language,
      +options.javaVersion,
      null,
      options.buildSystem === 'gradle-project-kotlin'
    );
  }
}
