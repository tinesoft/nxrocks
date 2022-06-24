import {
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nrwl/devkit';
import { LinkGeneratorSchema } from './schema';
import { isMicronautProject } from '../../utils/micronaut-utils';


export default async function (tree: Tree, options: LinkGeneratorSchema) {

  const sourceProject = readProjectConfiguration(tree, options.sourceProjectName);
  if(!isMicronautProject(sourceProject)) {
    throw new Error (`The source project (1st argument of this 'link' generator) must be a Micronaut project`);
  }
  const targetProject = readProjectConfiguration(tree, options.targetProjectName);

  const targetProjectImplicitDependencies = targetProject.implicitDependencies || [];

  if(!targetProjectImplicitDependencies.includes(options.sourceProjectName)) {
    targetProjectImplicitDependencies.push(options.sourceProjectName);
    targetProject.implicitDependencies = targetProjectImplicitDependencies;
    updateProjectConfiguration(tree, options.targetProjectName, targetProject);
  }

}
