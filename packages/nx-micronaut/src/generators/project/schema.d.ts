export interface ProjectGeneratorOptions {
  name: string;
  tags?: string;
  directory?: string;

  micronautLaunchUrl?: string;

  type: 'default' | 'cli' | 'function' | 'grpc' | 'messaging';
  buildSystem?: 'MAVEN' | 'GRADLE' | 'GRADLE_KOTLIN';
  basePackage: string;
  micronautVersion?:  'current' | 'snapshot' | 'previous';
  javaVersion?: 'string';
  language?: 'JAVA' | 'KOTLIN' | 'GROOVY';
  testFramework?: 'JUNIT' | 'SPOCK' | 'KOTEST';
  features?: string;
}

export interface NormalizedSchema extends ProjectGeneratorOptions {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  projectFeatures: string[];
  parsedTags: string[];
  fullPackage: string;
}
