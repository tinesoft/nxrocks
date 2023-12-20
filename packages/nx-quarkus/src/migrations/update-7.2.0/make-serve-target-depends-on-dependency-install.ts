import { Tree, formatFiles } from '@nx/devkit';
import { NX_QUARKUS_PKG } from '../../index';
import { updateNxJsonIf, updateProjectConfigurationIf } from '@nxrocks/common-jvm';

export default async function update(tree: Tree) {

  const targetExecutors = [`${NX_QUARKUS_PKG}:run`, `${NX_QUARKUS_PKG}:serve`, `${NX_QUARKUS_PKG}:dev`, `${NX_QUARKUS_PKG}:remote-dev`];

  updateProjectConfigurationIf(tree, (project) => project.projectType === 'application', (project) => {

    for (const target of Object.values(project.targets ?? {})) {
      if (target.executor && targetExecutors.includes(target.executor)) {
        target.dependsOn ??= [];
        if (!target.dependsOn.includes('^install')) {
          target.dependsOn.push('^install');
        }
      }
    }
  });

  // update options from nx.json target defaults
  updateNxJsonIf(tree, (nxJson) => !!nxJson.targetDefaults, (nxJson) => {
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
  })

  await formatFiles(tree);
}
