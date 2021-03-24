import { ExecutorContext } from "@nrwl/devkit";

export function mockExecutorContext(executorName: string, workspaceVersion = 2): ExecutorContext {
    return {
        root: '/root',
        cwd: 'root',
        projectName: 'proj',
        workspace: {
            version: workspaceVersion,
            projects: {
                proj: {
                    root: 'proj',
                    targets: {
                        test: {
                            executor: `@nxrocks/nx-spring-boot:${executorName}`,
                        },
                    },
                },
            },
        },
        target: {
            executor: `@nxrocks/nx-spring-boot:${executorName}`,
        },
        isVerbose: false,
    };
}