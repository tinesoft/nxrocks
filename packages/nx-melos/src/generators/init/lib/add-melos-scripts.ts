import { readJson, Tree, writeJson } from "@nrwl/devkit";
import { InitGeneratorOptions } from "../schema";

export function  addMelosScriptsToPackageJson(tree: Tree, options: InitGeneratorOptions){

    const melosExec = `node nx-melos.mjs`;
    const sep = options.scriptNameSeparator;
    const rootPackageJson = readJson(tree, 'package.json');

    rootPackageJson.scripts = rootPackageJson.scripts || {};
    rootPackageJson.scripts = {
        ...rootPackageJson.scripts,
        [`melos${sep}bootstrap`]: `${melosExec} bootstrap`,
        [`melos${sep}clean`]: `${melosExec} clean`,
        [`melos${sep}exec`]: `${melosExec} exec`,
        [`melos${sep}list`]: `${melosExec} list`,
        [`melos${sep}publish`]: `${melosExec} publish`,
        [`melos${sep}run`]: `${melosExec} run`,
        [`melos${sep}version`]: `${melosExec} version`,
    };
  
    rootPackageJson.nx = rootPackageJson.nx || {};
    rootPackageJson.nx.targets = rootPackageJson.nx.targets || {};
    rootPackageJson.nx.targets = {
        ...rootPackageJson.nx.targets,
        [`melos${sep}bootstrap`]: {
            outputs: [`{workspaceRoot}/.packages`]
        }
    };

    writeJson(tree, 'package.json', rootPackageJson);
}