export interface ApplicationGeneratorOptions {
  name: string;
  projectType: 'application' | 'library';
  tags?: string;
  directory?: string;

  springInitializerUrl?: string;

  buildSystem?: 'maven-project' | 'gradle-project';
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
}

export interface NormalizedSchema extends ApplicationGeneratorOptions {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  projectDependencies: string;
  parsedTags: string[];
}
