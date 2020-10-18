export interface ApplicationSchematicSchema {
  name: string;
  tags?: string;
  directory?: string;

  springInitializerUrl?: string;

  type?: 'maven-project' | 'gradle-project';
  language?: string;
  bootVersion?: string;
  groupId?: string;
  artifactId?: string;
  packageName?: string;
  description?: string;
  javaVersion?: string;
  packaging?: 'jar' | 'war';
  dependencies?: string;
}

export interface NormalizedSchema extends ApplicationSchematicSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  projectDependencies: string;
  parsedTags: string[];
}
