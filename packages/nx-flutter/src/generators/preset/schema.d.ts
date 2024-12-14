import { ProjectGeneratorOptions } from '../project/schema';

export interface PresetGeneratorSchema extends ProjectGeneratorOptions {
  prjName?: string; //replacement for 'name' & 'directory' which can't be used as-is, because they have a special meaning in `create-nx-workspace`
}
