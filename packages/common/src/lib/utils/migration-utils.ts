import { NxJsonConfiguration, ProjectConfiguration, Tree, getProjects, readNxJson, updateNxJson, updateProjectConfiguration } from "@nx/devkit";

export async function updateProjectConfigurationIf(tree: Tree, predicate: (project: ProjectConfiguration) => boolean, updater: (project: ProjectConfiguration) => void) {

    const projects = getProjects(tree);
    for (const [, project] of projects) {
        if (!project || !predicate(project)) {
            continue;
        }

        updater(project);
        
        if(project.name)
            updateProjectConfiguration(tree, project.name, project);
    }
}

export async function updateNxJsonIf(tree: Tree, predicate: (nxJson: NxJsonConfiguration) => boolean, updater: (project: NxJsonConfiguration) => void) {

    // update options from nx.json target defaults
    const nxJson = readNxJson(tree);
    if (!nxJson || !predicate(nxJson)) {
        return;
    }

    updater(nxJson);

    updateNxJson(tree, nxJson);
}
