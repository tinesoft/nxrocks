import {
  NxJsonConfiguration,
  ProjectConfiguration,
  TargetConfiguration,
  Tree,
  formatFiles,
  getProjects,
  readNxJson,
  updateNxJson,
  updateProjectConfiguration,
} from '@nx/devkit';

export async function updateProjectConfigurationIf(
  tree: Tree,
  predicate: (project: ProjectConfiguration) => boolean,
  updater: (project: ProjectConfiguration) => void
) {
  const projects = getProjects(tree);
  for (const [, project] of projects) {
    if (!project || !predicate(project)) {
      continue;
    }

    updater(project);

    if (project.name) updateProjectConfiguration(tree, project.name, project);
  }
}

export async function updateNxJsonIf(
  tree: Tree,
  predicate: (nxJson: NxJsonConfiguration) => boolean,
  updater: (project: NxJsonConfiguration) => void
) {
  // update options from nx.json target defaults
  const nxJson = readNxJson(tree);
  if (!nxJson || !predicate(nxJson)) {
    return;
  }

  updater(nxJson);

  updateNxJson(tree, nxJson);
}

/**
 * Ensures every application target (and matching `nx.json` target default) whose
 * executor is one of `targetExecutors` depends on `^install`.
 *
 * Shared by the `make-serve-target-depends-on-dependency-install` migrations of
 * the JVM plugins (which differ only in the set of executors they target).
 */
export async function makeServeTargetsDependOnInstall(
  tree: Tree,
  targetExecutors: string[]
) {
  const executors = new Set(targetExecutors);

  const addInstallDependency = (
    target: Pick<TargetConfiguration, 'dependsOn'>
  ) => {
    target.dependsOn ??= [];
    if (!target.dependsOn.includes('^install')) {
      target.dependsOn.push('^install');
    }
  };

  await updateProjectConfigurationIf(
    tree,
    (project) => project.projectType === 'application',
    (project) => {
      for (const target of Object.values<TargetConfiguration>(
        project.targets ?? {}
      )) {
        if (target.executor && executors.has(target.executor)) {
          addInstallDependency(target);
        }
      }
    }
  );

  // update options from nx.json target defaults
  await updateNxJsonIf(
    tree,
    (nxJson) => !!nxJson.targetDefaults,
    (nxJson) => {
      for (const [
        targetOrExecutor,
        targetConfig,
      ] of Object.entries<TargetConfiguration>(nxJson.targetDefaults ?? {})) {
        if (executors.has(targetOrExecutor)) {
          addInstallDependency(targetConfig);
        }
      }
    }
  );

  await formatFiles(tree);
}
