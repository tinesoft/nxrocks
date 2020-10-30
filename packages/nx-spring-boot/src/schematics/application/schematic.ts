import {
  chain,
  Rule} from '@angular-devkit/schematics';
import {
  addProjectToNxJsonInTree,
  ProjectType,
  updateWorkspace,
} from '@nrwl/workspace';
import { ApplicationSchematicSchema } from './schema';
import { normalizeOptions,  generateSpringBootProject, restoreExecutePermission, addBuilInfoTask} from './lib';

/**
 * Depending on your needs, you can change this to either `Library` or `Application`
 */
const projectType = ProjectType.Application;


export default function (options: ApplicationSchematicSchema): Rule {
  const normalizedOptions = normalizeOptions(options);
  return chain([
    updateWorkspace((workspace) => {
      const project = workspace.projects
        .add({
          name: normalizedOptions.projectName,
          root: normalizedOptions.projectRoot,
          sourceRoot: `${normalizedOptions.projectRoot}/src`,
          projectType,
        });

        const commands = ['run', 'serve', 'buildJar', 'buildWar', 'buildImage', 'buildInfo'];
        for(const command of commands){
          project.targets.add({
            name: `${command}`,
            builder: `@nxrocks/nx-spring-boot:${command}`,
            options:{ 
              root: normalizedOptions.projectRoot
            }
          });
        }
    }),
    addProjectToNxJsonInTree(normalizedOptions.projectName, {
      tags: normalizedOptions.parsedTags,
    }),
    generateSpringBootProject(normalizedOptions),
    restoreExecutePermission(normalizedOptions),
    addBuilInfoTask(normalizedOptions)
  ]);
}
