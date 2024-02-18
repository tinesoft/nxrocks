/**
 * Interface representing a package dependency
 */
export interface PackageInfo {
  packageId: string;
  packageFile: string;
  dependencies?: PackageInfo[];
  modules?: string[]
}

/**
 * Interface representing a workspace, with each project associated to its packages
 */
export interface WorkspacePackageInfoConfiguration {
  projects: {
    [projectRoot: string]: PackageInfo;
  };

  packages: {
    [packageId: string]: string;
  };
}
