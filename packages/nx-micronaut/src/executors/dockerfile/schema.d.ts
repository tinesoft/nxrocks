
export interface DockerfileExecutorOptions {
    root: string;
    ignoreWrapper?: boolean;
    runFromParentModule?: boolean;
    args?: string[];
}