import { Tree, readJson, writeJson } from '@nrwl/devkit';

export function addPluginToNxJson(pluginName: string, tree: Tree) {
  const nxJson = readJson(tree, 'nx.json');
  nxJson.plugins = nxJson.plugins || [];
  if (!nxJson.plugins.includes(pluginName)) {
    nxJson.plugins.push(pluginName);
  }

  writeJson(tree, 'nx.json', nxJson);
}
