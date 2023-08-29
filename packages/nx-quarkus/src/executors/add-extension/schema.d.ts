
export interface AddExtensionExecutorOptions {
    root: string;
    ignoreWrapper?: boolean;
    runFromParentModule?: boolean;
    extensions?: string;
    args?: string[];
}