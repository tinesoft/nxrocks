import { Tree } from '@nx/devkit';
import { ProjectGeneratorOptions, NormalizedSchema } from '../schema';
import { determineProjectNameAndRootOptions } from '@nx/devkit/src/generators/project-name-and-root-utils';

export async function normalizeOptions(
  tree: Tree,
  options: ProjectGeneratorOptions
): Promise<NormalizedSchema> {
  const {
    projectName,
    projectRoot,
    projectNameAndRootFormat,
  } = await determineProjectNameAndRootOptions(tree, {
    name: options.name,
    projectType: options.projectType,
    directory: options.directory,
    projectNameAndRootFormat: options.projectNameAndRootFormat,
    //rootProject: options.rootProject,
    callingGenerator: '@nxrocks/nx-spring-boot:project',
  });
  options.projectNameAndRootFormat = projectNameAndRootFormat;

  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];
  const projectDependencies =
    options.dependencies
      ?.split(',')
      .map((s) => s.trim())
      .filter((s) => !!s) || [];
  return {
    ...options,
    projectName,
    projectRoot,
    projectDependencies,
    parsedTags,
  };
}
