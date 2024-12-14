import { CreateWorkspaceOptions } from 'create-nx-workspace';

export interface CLIArguments extends CreateWorkspaceOptions {
  useNxWrapper?: boolean;
  verbose?: boolean;
  presetVersion?: string;
}
