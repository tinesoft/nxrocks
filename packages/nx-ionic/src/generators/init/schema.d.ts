export interface InitGeneratorSchema {
  skipPackageJson?: boolean;
  keepExistingVersions?: boolean;
  updatePackageScripts?: boolean;
  addPlugin?: boolean;
  skipFormat?: boolean;
}
