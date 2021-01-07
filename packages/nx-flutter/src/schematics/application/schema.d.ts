export interface ApplicationSchematicSchema {
  name: string;
  org?: string;
  description?: string;
  androidLanguage?: 'java' | 'kotlin';
  iOSLanguage?: 'objc' | 'swift';
  template?: 'app' | 'module' | 'package' | 'plugin';
  sample?:string;
  platforms?: ('android' | 'ios' | 'linux' | 'macos' | 'windows' | 'web')[];

  pub?: boolean;
  offline?:boolean;
  tags?: string;
  directory?: string;
}

export interface NormalizedSchema extends ApplicationSchematicSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}
