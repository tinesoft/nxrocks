import {
  logger,
  createProjectGraphAsync,
  ProjectGraph,
  Tree,
} from '@nx/devkit';
import { prompt } from 'enquirer';

import { NormalizedSchema } from '../schema';
import {
  addGradleModule,
  addMavenModule,
  initGradleParentModule,
  initMavenParentModule,
  hasMultiModuleGradleProjectInTree,
  hasMultiModuleMavenProjectInTree,
  getAdjustedProjectAndModuleRoot,
} from '@nxrocks/common-jvm';

export async function promptForMultiModuleSupport(
  tree: Tree,
  options: NormalizedSchema
) {
  const buildSystemName = options.buildSystem === 'MAVEN' ? 'Maven' : 'Gradle';
  if (
    (options.transformIntoMultiModule === undefined ||
      options.addToExistingParentModule === undefined) &&
    options.parentModuleName === undefined &&
    process.env.NX_INTERACTIVE === 'true'
  ) {
    logger.info(
      `⏳ Checking for existing multi-module projects. Please wait...`
    );

    const projectGraph: ProjectGraph = await createProjectGraphAsync();

    const multiModuleProjects = Object.values(projectGraph.nodes)
      .map((n) => n.data)
      .filter((project) =>
        options.buildSystem === 'MAVEN'
          ? hasMultiModuleMavenProjectInTree(tree, project.root)
          : hasMultiModuleGradleProjectInTree(tree, project.root)
      );

    if (multiModuleProjects.length === 0) {
      options.transformIntoMultiModule = await prompt({
        name: 'transformIntoMultiModule',
        message: `Would you like to transform the generated project into a ${buildSystemName} multi-module project?`,
        type: 'confirm',
        initial: false,
      }).then((a) => a['transformIntoMultiModule']);

      if (options.transformIntoMultiModule) {
        options.parentModuleName = (
          await prompt({
            name: 'parentModuleName',
            message: `What name would you like to use for the ${buildSystemName} multi-module project?`,
            type: 'input',
            initial: `${options.projectName}-parent`,
          }).then((a) => a['parentModuleName'])
        ).replace(/\//g, '-');
      }
      options.keepProjectLevelWrapper = !options.transformIntoMultiModule;
    } else {
      options.addToExistingParentModule = await prompt({
        name: 'addToExistingParentModule',
        message: `We found ${
          multiModuleProjects.length
        } existing ${buildSystemName} multi-module projects in your workaspace${
          multiModuleProjects.length === 1
            ? `('${multiModuleProjects[0].name}')`
            : ''
        }.\nWould you like to add this new project ${
          multiModuleProjects.length === 1 ? 'to it?' : 'into one of them?'
        }`,
        type: 'confirm',
        initial: false,
      }).then((a) => a['addToExistingParentModule']);

      if (options.addToExistingParentModule) {
        if (multiModuleProjects.length === 1) {
          options.parentModuleName = multiModuleProjects[0].name;
        } else {
          options.parentModuleName = await prompt({
            name: 'parentModuleName',
            message:
              'Which parent module would you like to add the new project into?',
            type: 'select',
            choices: multiModuleProjects.map((p) => p.name),
          }).then((a) => a['parentModuleName']);
        }
      }
      options.keepProjectLevelWrapper = !options.addToExistingParentModule;
    }
  }

  if (
    (options.transformIntoMultiModule || options.addToExistingParentModule) &&
    options.parentModuleName
  ) {
    const isMavenProject = options.buildSystem === 'MAVEN';
    const helpComment = `For more information about ${buildSystemName} multi-modules projects, go to: ${
      isMavenProject
        ? 'https://maven.apache.org/guides/mini/guide-multiple-modules-4.html'
        : 'https://docs.gradle.org/current/userguide/intro_multi_project_builds.html'
    }`;

    const opts = await getAdjustedProjectAndModuleRoot(options, isMavenProject);

    options.projectRoot = opts.projectRoot;
    options.moduleRoot = opts.moduleRoot;

    if (options.transformIntoMultiModule) {
      // add the root module
      if (isMavenProject) {
        initMavenParentModule(
          tree,
          options.moduleRoot,
          options.basePackage,
          options.parentModuleName,
          options.projectName,
          `<!-- ${helpComment} -->`
        );
      } else {
        initGradleParentModule(
          tree,
          options.moduleRoot,
          options.basePackage,
          options.parentModuleName,
          options.projectName,
          opts.offsetFromRoot,
          options.buildSystem === 'GRADLE_KOTLIN',
          `// ${helpComment}`
        );
      }
    } else if (options.addToExistingParentModule) {
      // add to the chosen root module
      if (isMavenProject) {
        addMavenModule(tree, options.moduleRoot, options.projectName);
      } else {
        addGradleModule(
          tree,
          options.moduleRoot,
          options.projectName,
          opts.offsetFromRoot,
          options.buildSystem === 'GRADLE_KOTLIN'
        );
      }
    }
  }
}
