import {
  Tree,
  names,
  getWorkspaceLayout,
} from '@nrwl/devkit';
import { ProjectGeneratorOptions, NormalizedSchema } from '../schema';

/**
 * Depending on your needs, you can change this to either `Library` or `Application`
 */
const projectType = 'application';

export function normalizeOptions(tree: Tree,
  options: ProjectGeneratorOptions
): NormalizedSchema {
  const { appsDir, libsDir } = getWorkspaceLayout(tree);
  const projectRootDir = projectType === 'application' ? appsDir : libsDir;
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${projectRootDir}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
  };
}
