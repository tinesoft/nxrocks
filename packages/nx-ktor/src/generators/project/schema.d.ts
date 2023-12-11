import type { ProjectNameAndRootFormat } from '@nx/devkit/src/generators/project-name-and-root-utils';

export interface ProjectGeneratorOptions {
  name: string;
  tags?: string;
  directory?: string;
  projectNameAndRootFormat?: ProjectNameAndRootFormat;

  ktorInitializrUrl?: string;
  proxyUrl?: string;

  buildSystem?: 'MAVEN' | 'GRADLE' | 'GRADLE_KTS';
  groupId?: string;
  artifactId?: string;
  ktorVersion?: string;
  kotlinVersion?: 'string';
  engine?: 'NETTY' | 'JETTY' | 'CIO' | 'TOMCAT';
  configurationLocation?: 'YAML' | 'HOCON' | 'CODE';
  features?: string;
  skipFormat?: boolean;
  skipCodeSamples?: boolean;

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
  moduleRoot?: string;
}
