import { Tree, formatFiles, getProjects, readNxJson, updateNxJson, updateProjectConfiguration } from '@nx/devkit';
import { NX_QUARKUS_PKG } from '../../index';

export default async function update(tree: Tree) {

  const targetExecutors = [`${NX_QUARKUS_PKG}:run`, `${NX_QUARKUS_PKG}:serve`, `${NX_QUARKUS_PKG}:dev`, `${NX_QUARKUS_PKG}:remote-dev`];
  const projects = getProjects(tree);
  for (const [, project] of projects) {
    if (project.projectType !== 'application') {
      continue;
    }

    for (const target of Object.values(project.targets ?? {})) {
      if (targetExecutors.includes(target.executor)) {
        target.dependsOn ??= [];
        if (!target.dependsOn.includes('^install')) {
          target.dependsOn.push('^install');
        }
      }
    }

    updateProjectConfiguration(tree, project.name, project);
  }

  // update options from nx.json target defaults
  const nxJson = readNxJson(tree);
  if (!nxJson.targetDefaults) {
    return;
  }

  for (const [targetOrExecutor, targetConfig] of Object.entries(
    nxJson.targetDefaults
  )) {
    if (targetExecutors.includes(targetOrExecutor)) {

      targetConfig.dependsOn ??= [];
      if (!targetConfig.dependsOn.includes('^install')) {
        targetConfig.dependsOn.push('^install');
      }
    }
  }

  updateNxJson(tree, nxJson);

  await formatFiles(tree);
}
