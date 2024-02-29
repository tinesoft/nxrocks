import type { ProjectNameAndRootFormat } from '@nx/devkit/src/generators/project-name-and-root-utils';

export interface ProjectGeneratorOptions {
  name: string;
  projectType: ProjectType;
  tags?: string;
  directory?: string;
  projectNameAndRootFormat?: ProjectNameAndRootFormat;

  springInitializerUrl?: string;
  proxyUrl?: string;

  buildSystem?: 'maven-project' | 'gradle-project' | 'gradle-project-kotlin';
  language?: 'java' | 'kotlin' | 'groovy';
  bootVersion?: string;
  groupId?: string;
  artifactId?: string;
  packageName?: string;
  description?: string;
  javaVersion?: string;
  packaging?: 'jar' | 'war';
  dependencies?: string;
  version?: string;
  skipFormat?: boolean;

  transformIntoMultiModule?: boolean;
  addToExistingParentModule?: boolean;
  parentModuleName?: string;
  keepProjectLevelWrapper?: boolean;
}

export interface NormalizedSchema extends ProjectGeneratorOptions {
  projectName: string;
  projectRoot: string;
  projectDependencies: string[];
  parsedTags: string[];
  moduleRoot?: string;
}
