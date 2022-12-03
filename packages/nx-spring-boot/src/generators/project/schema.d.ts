export interface ProjectGeneratorOptions {
  name: string;
  projectType: 'application' | 'library';
  tags?: string;
  directory?: string;

  springInitializerUrl?: string;
  proxyUrl?: string;

  buildSystem: 'maven-project' | 'gradle-project' | 'gradle-project-kotlin';
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
}

export interface NormalizedSchema extends ProjectGeneratorOptions {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  projectDependencies: string;
  parsedTags: string[];
}
