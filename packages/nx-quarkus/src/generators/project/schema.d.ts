export interface ProjectGeneratorOptions {
  name: string;
  projectType: 'application' | 'library';
  tags?: string;
  directory?: string;

  quarkusInitializerUrl?: string;

  buildSystem?: 'MAVEN' | 'GRADLE' | 'GRADLE_KOTLIN_DSL';
  groupId?: string;
  artifactId?: string;
  skipCodeSamples?: boolean;
  extensions?: string;
  version?: string;
}

export interface NormalizedSchema extends ProjectGeneratorOptions {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  projectExtensions: string[];
  parsedTags: string[];
}
