import {
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nrwl/devkit';
import { LinkGeneratorSchema } from './schema';


export default async function (tree: Tree, options: LinkGeneratorSchema) {

  readProjectConfiguration(tree, options.sourceProjectName);
  const targetProject = readProjectConfiguration(tree, options.targetProjectName);

  const targetProjectImplicitDependencies = targetProject.implicitDependencies || [];

  if(!targetProjectImplicitDependencies.includes(options.sourceProjectName)) {
    targetProjectImplicitDependencies.push(options.sourceProjectName);
    targetProject.implicitDependencies = targetProjectImplicitDependencies;
    updateProjectConfiguration(tree, options.targetProjectName, targetProject);
  }

}
