export interface ProjectGeneratorOptions {
  name: string;
  projectType: 'default' | 'cli' | 'function' | 'grpc' | 'messaging';
  tags?: string;
  directory?: string;

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
}

export interface NormalizedSchema extends ProjectGeneratorOptions {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  projectFeatures: string[];
  parsedTags: string[];
  fullPackage: string;
}
