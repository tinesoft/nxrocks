import { Tree, readJson, writeJson} from '@nrwl/devkit';

export function addPluginToNxJson(tree:Tree){
    const nxJson = readJson(tree, 'nx.json');
    nxJson.plugins = (nxJson.plugins || []);
    nxJson.plugins.push('@nxrocks/nx-spring-boot');

    writeJson(tree,'nx.json', nxJson);
}