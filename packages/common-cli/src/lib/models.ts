import { CreateWorkspaceOptions } from 'create-nx-workspace';


export interface CLIArguments extends CreateWorkspaceOptions {
    name: string;
    useNxWrapper?: boolean;
    useNxCloud?: boolean;
    interactive: boolean;
    verbose: boolean;
    $0?: string;
    _?: string[]
  }
  