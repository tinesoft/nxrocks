import { Tree, readJson, writeJson} from '@nrwl/devkit';

export function addPluginToNxJson(tree:Tree){
    const nxJson = readJson(tree, 'nx.json');
    nxJson.plugins = (nxJson.plugins || []);
    if (!nxJson.plugins.includes('@nxrocks/nx-spring-boot')) {
        nxJson.plugins.push('@nxrocks/nx-spring-boot');
    }

    writeJson(tree,'nx.json', nxJson);
}