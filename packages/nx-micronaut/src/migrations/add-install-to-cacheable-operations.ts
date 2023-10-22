import { NxJsonConfiguration, Tree, formatFiles, readJson, writeJson } from '@nx/devkit';

export default async function update(host: Tree) {
  const nxJson = readJson<NxJsonConfiguration>(host, 'nx.json');

  let cacheableOperationsPreNx17 = nxJson.tasksRunnerOptions?.['default']?.options?.cacheableOperations;

  if (cacheableOperationsPreNx17?.includes['install'] === false) {
    cacheableOperationsPreNx17 = [...cacheableOperationsPreNx17, 'install'];

    writeJson(host, 'nx.json', nxJson);
  }
  else {
    nxJson.targetDefaults ??= {};
    nxJson.targetDefaults['install'] ??= {};
    nxJson.targetDefaults['install'].cache ??= true;

    writeJson(host, 'nx.json', nxJson);
  }

  await formatFiles(host);
}
