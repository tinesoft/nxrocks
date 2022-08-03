
export type AndroidLanguageType = 'java' | 'kotlin';

export type IosLanguageType = 'objc' | 'swift';

export type TemplateType = 'app' | 'module' | 'package' | 'plugin';

export type PlatformType = 'android' | 'ios' | 'linux' | 'macos' | 'windows' | 'web';
export interface ProjectGeneratorOptions {
  name: string;
  org?: string;
  description?: string;
  androidLanguage?: AndroidLanguageType;
  iosLanguage?: IosLanguageType;
  template?: TemplateType;
  sample?:string;
  platforms?: PlatformType[];

  pub?: boolean;
  offline?:boolean;
  tags?: string;
  directory?: string;

  skipAdditionalPrompts?: boolean; //`interactive` is a reserved option for `nx generate` command, that gets deleted once Nx has interpreted it, so we need our own
}

export interface NormalizedSchema extends ProjectGeneratorOptions {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}
