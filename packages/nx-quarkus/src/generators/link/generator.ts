import {
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nrwl/devkit';
import { LinkGeneratorSchema } from './schema';
import { isQuarkusProject } from '../../utils/quarkus-utils';


export default async function (tree: Tree, options: LinkGeneratorSchema) {

  const sourceProject = readProjectConfiguration(tree, options.sourceProjectName);
  if(!isQuarkusProject(sourceProject)) {
    throw new Error (`The source project (1st argument of this 'link' generator) must be a Quarkus project`);
  }
  const targetProject = readProjectConfiguration(tree, options.targetProjectName);

  const targetProjectImplicitDependencies = targetProject.implicitDependencies || [];

  if(!targetProjectImplicitDependencies.includes(options.sourceProjectName)) {
    targetProjectImplicitDependencies.push(options.sourceProjectName);
    targetProject.implicitDependencies = targetProjectImplicitDependencies;
    updateProjectConfiguration(tree, options.targetProjectName, targetProject);
  }

}
