export type AndroidLanguageType = 'java' | 'kotlin';

export type IosLanguageType = 'objc' | 'swift';

export type TemplateType = 'app' | 'module' | 'package' | 'plugin';

export type PlatformType =
  | 'android'
  | 'ios'
  | 'linux'
  | 'macos'
  | 'windows'
  | 'web';
export interface ProjectGeneratorOptions {
  directory: string;
  name?: string;
  org?: string;
  description?: string;
  androidLanguage?: AndroidLanguageType;
  iosLanguage?: IosLanguageType;
  template?: TemplateType;
  sample?: string;
  platforms?: PlatformType[];

  useFvm?: boolean;
  pub?: boolean;
  offline?: boolean;
  tags?: string;
}

export interface NormalizedSchema extends ProjectGeneratorOptions {
  projectName: string;
  projectRoot: string;
  parsedTags: string[];
}
