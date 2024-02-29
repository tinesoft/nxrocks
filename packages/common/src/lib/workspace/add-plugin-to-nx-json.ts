import { Tree, readNxJson, updateNxJson } from '@nx/devkit';

export function addPluginToNxJson<T = unknown>(
  pluginName: string,
  tree: Tree,
  options?: T,
  ...cacheableOperations: string[]
) {
  //
  const nxJson = readNxJson(tree);

  if (!nxJson) {
    throw new Error(
      `${pluginName} requires nx.json to be present in the workspace`
    );
  }

  nxJson.plugins ??= [];

  if (
    !nxJson.plugins.some((p) =>
      typeof p === 'string' ? p === pluginName : p.plugin === pluginName
    )
  ) {
    nxJson.plugins.push({
      plugin: pluginName,
      ...(options ? { options } : {}),
    });
  }

  nxJson.targetDefaults ??= {};
  for (const target of cacheableOperations) {
    nxJson.targetDefaults[target] ??= {};
    nxJson.targetDefaults[target].cache ??= true;
  }

  updateNxJson(tree, nxJson);
}
