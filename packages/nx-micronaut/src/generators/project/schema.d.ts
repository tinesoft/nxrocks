export interface ProjectGeneratorOptions {
  directory: string;
  projectType: 'default' | 'cli' | 'function' | 'grpc' | 'messaging';
  name?: string;
  tags?: string;

  micronautLaunchUrl: string;
  proxyUrl?: string;

  buildSystem?: 'MAVEN' | 'GRADLE' | 'GRADLE_KOTLIN';
  basePackage?: string;
  micronautVersion?: 'current' | 'snapshot' | 'previous';
  javaVersion?: 'string';
  language?: 'JAVA' | 'KOTLIN' | 'GROOVY';
  testFramework?: 'JUNIT' | 'SPOCK' | 'KOTEST';
  features?: string;
  skipFormat?: boolean;

  transformIntoMultiModule?: boolean;
  addToExistingParentModule?: boolean;
  parentModuleName?: string;
  keepProjectLevelWrapper?: boolean;
}

export interface NormalizedSchema extends ProjectGeneratorOptions {
  projectName: string;
  projectRoot: string;
  projectFeatures: string[];
  parsedTags: string[];
  fullPackage: string;
  moduleRoot?: string;
}
