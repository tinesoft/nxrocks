export interface AppGeneratorSchema {
  name: string;
  template?: 'blank' | 'tabs' | 'sidemenu' | 'list';
  directory?: string;
  type?: 'angular' | 'angular-standalone' | 'react' | 'vue';
  capacitor?: boolean;
  cordova?: boolean;
  id?: string;
  projectId?: string;
  packageId?: string;
  noDeps?: boolean;
  noGit?: boolean;
  link?: boolean;
  tags?: string;
}
