import { readNxJson, Tree } from '@nx/devkit';

export function hasIonicPlugin(tree: Tree): boolean {
  const nxJson = readNxJson(tree);
  return (
    nxJson?.plugins?.some((plugin) => {
      if (typeof plugin === 'string') {
        return plugin === '@nxrocks/nx-ionic/plugin';
      }
      return plugin.plugin === '@nxrocks/nx-ionic/plugin';
    }) ?? false
  );
}

export function findIonicConfigFile(
  tree: Tree,
  projectRoot = ''
): string | null {
  const configPath = projectRoot
    ? `${projectRoot}/ionic.config.json`
    : 'ionic.config.json';
  return tree.exists(configPath) ? configPath : null;
}
