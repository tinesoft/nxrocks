import { ProjectGeneratorOptions } from "../project/schema";

export interface PresetGeneratorSchema extends Omit<ProjectGeneratorOptions, 'name'>{
  prjName: string; // we cannot use "projectName" nor "name" because they have special meanings in Nx
}
