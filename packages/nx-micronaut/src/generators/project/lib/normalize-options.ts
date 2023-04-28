import { Tree, names, getWorkspaceLayout } from '@nx/devkit';
import { ProjectGeneratorOptions, NormalizedSchema } from '../schema';

export function normalizeOptions(
  tree: Tree,
  options: ProjectGeneratorOptions
): NormalizedSchema {
  const { appsDir } = getWorkspaceLayout(tree);
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(/\//g, '-');
  const projectRoot = `${appsDir}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];
  const projectFeatures =
    options.features
      ?.split(',')
      .map((s) => s.trim())
      .filter((s) => !!s) || [];
  const fullPackage =
    options.basePackage + '.' + name.replace(/-_/g, '').toLowerCase();
  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    projectFeatures,
    parsedTags,
    fullPackage,
  };
}
