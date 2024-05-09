import type { ProjectNameAndRootFormat } from '@nx/devkit/src/generators/project-name-and-root-utils';

export interface ProjectGeneratorOptions {
  name: string;
  projectType: ProjectType;
  tags?: string;
  directory?: string;
  projectNameAndRootFormat?: ProjectNameAndRootFormat;

  quarkusInitializerUrl: string;
  proxyUrl?: string;

  buildSystem: 'MAVEN' | 'GRADLE' | 'GRADLE_KOTLIN_DSL';
  javaVersion?: string;
  groupId?: string;
  artifactId?: string;
  skipCodeSamples?: boolean;
  extensions?: string;
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
  projectExtensions: string[];
  parsedTags: string[];
  moduleRoot?: string;
}
