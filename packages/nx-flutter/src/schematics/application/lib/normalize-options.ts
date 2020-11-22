  import {
    projectRootDir,
    ProjectType,
    toFileName,
  } from '@nrwl/workspace';
  import { ApplicationSchematicSchema, NormalizedSchema } from '../schema';

  /**
   * Depending on your needs, you can change this to either `Library` or `Application`
   */
  const projectType = ProjectType.Application;
  
  export function normalizeOptions(
    options: ApplicationSchematicSchema
  ): NormalizedSchema {
    const name = toFileName(options.name);
    const projectDirectory = options.directory
      ? `${toFileName(options.directory)}/${name}`
      : name;
    const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
    const projectRoot = `${projectRootDir(projectType)}/${projectDirectory}`;
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
  