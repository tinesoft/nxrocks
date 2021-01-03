export interface ApplicationSchematicSchema {
  name: string;
  org?: string;
  description?: string;
  androidLanguage?: 'java' | 'kotlin';
  iOSLanguage?: 'objc' | 'swift';
  template?:string;
  sample?:string;
  platforms?: string[];

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
