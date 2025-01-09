import { Tree } from '@nx/devkit';
import { ProjectGeneratorOptions, NormalizedSchema } from '../schema';
import {
  determineProjectNameAndRootOptions,
  ensureProjectName,
} from '@nx/devkit/src/generators/project-name-and-root-utils';

export async function normalizeOptions(
  tree: Tree,
  options: ProjectGeneratorOptions
): Promise<NormalizedSchema> {
  const projectType = options.template === 'app' ? 'application' : 'library';
  await ensureProjectName(
    tree,
    options as ProjectGeneratorOptions,
    projectType
  );
  const { projectName, projectRoot } = await determineProjectNameAndRootOptions(
    tree,
    {
      name: options.name,
      projectType,
      directory: options.directory,
      //rootProject: options.rootProject,
    }
  );
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  return {
    ...options,
    projectName,
    projectRoot,
    parsedTags,
  };
}
