import {
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nx/devkit';
import { LinkGeneratorSchema } from './schema';
import { isBootProject } from '../../utils/boot-utils';

export default async function (tree: Tree, options: LinkGeneratorSchema) {
  const sourceProject = readProjectConfiguration(
    tree,
    options.sourceProjectName
  );
  if (!isBootProject(sourceProject)) {
    throw new Error(
      `The source project (1st argument of this 'link' generator) must be a Spring-Boot project`
    );
  }
  const targetProject = readProjectConfiguration(
    tree,
    options.targetProjectName
  );

  const targetProjectImplicitDependencies =
    targetProject.implicitDependencies || [];

  if (!targetProjectImplicitDependencies.includes(options.sourceProjectName)) {
    targetProjectImplicitDependencies.push(options.sourceProjectName);
    targetProject.implicitDependencies = targetProjectImplicitDependencies;
    updateProjectConfiguration(tree, options.targetProjectName, targetProject);
  }
}
