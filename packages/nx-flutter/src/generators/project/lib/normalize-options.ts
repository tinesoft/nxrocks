import { Tree, names, getWorkspaceLayout } from '@nx/devkit';
import { ProjectGeneratorOptions, NormalizedSchema } from '../schema';

export function normalizeOptions(
  tree: Tree,
  options: ProjectGeneratorOptions
): NormalizedSchema {
  const { appsDir, libsDir } = getWorkspaceLayout(tree);
  const projectRootDir = options.template === 'app' ? appsDir : libsDir;
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
