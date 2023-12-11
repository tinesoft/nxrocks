import type { ProjectNameAndRootFormat } from '@nx/devkit/src/generators/project-name-and-root-utils';

export interface ProjectGeneratorOptions {
  name: string;
  projectType: 'default' | 'cli' | 'function' | 'grpc' | 'messaging';
  tags?: string;
  directory?: string;
  projectNameAndRootFormat?: ProjectNameAndRootFormat;

  micronautLaunchUrl?: string;
  proxyUrl?: string;

  buildSystem?: 'MAVEN' | 'GRADLE' | 'GRADLE_KOTLIN';
  basePackage?: string;
  micronautVersion?:  'current' | 'snapshot' | 'previous';
  javaVersion?: 'string';
  language?: 'JAVA' | 'KOTLIN' | 'GROOVY';
  testFramework?: 'JUNIT' | 'SPOCK' | 'KOTEST';
  features?: string;
  skipFormat?: boolean;

  transformIntoMultiModule?: boolean;
  addToExistingParentModule?: boolean;
  parentModuleName?: string;
  keepProjectLevelWrapper?: boolean
}

export interface NormalizedSchema extends ProjectGeneratorOptions {
  projectName: string;
  projectRoot: string;
  projectFeatures: string[];
  parsedTags: string[];
  fullPackage: string;
  moduleRoot?: string;
}
