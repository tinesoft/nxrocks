import { NxJsonConfiguration, Tree, readJson, writeJson } from '@nx/devkit';

export function addPluginToNxJson(pluginName: string, tree: Tree, ...cacheableOperations: string[]) {
  const nxJson = readJson<NxJsonConfiguration>(tree, 'nx.json');
  nxJson.plugins = nxJson.plugins || [];
  if (!nxJson.plugins.includes(pluginName)) {
    nxJson.plugins.push(pluginName);
  }

  nxJson.targetDefaults ??= {};
  for (const target of cacheableOperations) {
    nxJson.targetDefaults[target] ??= {};
    nxJson.targetDefaults[target].cache ??= true;
  }

  writeJson(tree, 'nx.json', nxJson);
}
