import { Tree, names } from '@nx/devkit';
import { ProjectGeneratorOptions, NormalizedSchema } from '../schema';
import { getProjectRootDir } from '@nxrocks/common';

export function normalizeOptions(
  tree: Tree,
  options: ProjectGeneratorOptions
): NormalizedSchema {
  const projectRootDir = getProjectRootDir(tree, 'application');
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(/\//g, '-');
  const projectRoot = `${projectRootDir}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];
  const projectFeatures =
    options.features
      ?.split(',')
      .map((s) => s.trim())
      .filter((s) => !!s) || [];
  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    projectFeatures,
    parsedTags,
  };
}
