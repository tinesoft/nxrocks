export interface ProjectGeneratorOptions {
  name: string;
  tags?: string;
  directory?: string;

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
}

export interface NormalizedSchema extends ProjectGeneratorOptions {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  projectFeatures: string[];
  parsedTags: string[];
}
