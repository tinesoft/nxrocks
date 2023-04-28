import {
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nx/devkit';
import { LinkGeneratorSchema } from './schema';
import { isKtorProject } from '../../utils/ktor-utils';

export default async function (tree: Tree, options: LinkGeneratorSchema) {
  const sourceProject = readProjectConfiguration(
    tree,
    options.sourceProjectName
  );
  if (!isKtorProject(sourceProject)) {
    throw new Error(
      `The source project (1st argument of this 'link' generator) must be a Ktor project`
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
