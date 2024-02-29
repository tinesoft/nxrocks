import { ProjectType, joinPathFragments } from '@nx/devkit';
import {
  getNameAndRoot,
  hasMavenProject,
  hasMavenWrapper,
  hasGradleWrapper,
  hasMavenPlugin,
  SPOTLESS_MAVEN_PLUGIN_GROUP_ID,
  SPOTLESS_MAVEN_PLUGIN_ARTIFACT_ID,
  getProjectFileContent,
  getGradleBuildFilesExtension,
  hasGradlePlugin,
  SPOTLESS_GRADLE_PLUGIN_ID,
  getGradlePlugin,
  BuilderCommandAliasType,
} from '@nxrocks/common-jvm';
import { NX_SPRING_BOOT_PKG } from '..';
import { NormalizedSchema } from '../generators/project/schema';
import {
  NxSpringBootPluginOptions,
  normalizePluginOptions,
} from '../graph/plugin';

export function getProjectTypeAndTargetsFromFile(
  projectRootFile: string,
  pluginOptions: NxSpringBootPluginOptions
) {
  const { root, name } = getNameAndRoot(projectRootFile);
  const buildSystem = hasMavenProject(root)
    ? 'maven-project'
    : name.endsWith('.kts')
    ? 'gradle-project-kotlin'
    : 'gradle-project';

  const runFromParentModule = !hasMavenWrapper(root) && !hasGradleWrapper(root);
  let skipFormat = true;
  let projectType: ProjectType = 'library';

  if (buildSystem === 'maven-project') {
    skipFormat = hasMavenPlugin(
      root,
      SPOTLESS_MAVEN_PLUGIN_GROUP_ID,
      SPOTLESS_MAVEN_PLUGIN_ARTIFACT_ID
    );
    projectType = hasMavenPlugin(
      root,
      'org.springframework.boot',
      'spring-boot-maven-plugin'
    )
      ? 'application'
      : 'library';
  } else {
    const projectContent = getProjectFileContent(
      { root },
      `build${getGradleBuildFilesExtension({ root })}`
    );
    skipFormat = hasGradlePlugin(projectContent, SPOTLESS_GRADLE_PLUGIN_ID);
    projectType =
      getGradlePlugin(projectContent, 'org.springframework.boot').applied ===
      false
        ? 'library'
        : 'application';
  }

  return getProjectTypeAndTargets(
    root,
    projectType,
    buildSystem,
    runFromParentModule,
    skipFormat,
    normalizePluginOptions(pluginOptions)
  );
}

export function getProjectTypeAndTargetsFromOptions(options: NormalizedSchema) {
  return getProjectTypeAndTargets(
    options.projectRoot,
    options.projectType,
    options.buildSystem,
    !options.keepProjectLevelWrapper,
    options.skipFormat,
    normalizePluginOptions()
  );
}

function getProjectTypeAndTargets(
  projectRoot: string,
  projectType: ProjectType,
  buildSystem: 'maven-project' | 'gradle-project' | 'gradle-project-kotlin',
  runFromParentModule: boolean,
  skipFormat: boolean,
  pluginOptions
) {
  const commands: BuilderCommandAliasType[] = [
    pluginOptions.buildTargetName,
    pluginOptions.installTargetName,
    pluginOptions.testTargetName,
    pluginOptions.cleanTargetName,
  ];

  if (!skipFormat) {
    commands.push(
      pluginOptions.formatTargetName,
      pluginOptions.applyFormatTargetName,
      pluginOptions.checkFormatTargetName
    );
  }

  const appOnlyCommands = [
    pluginOptions.runTargetName,
    pluginOptions.serveTargetName,
    pluginOptions.buildImageTargetName,
    pluginOptions.buildInfoTargetName,
  ];
  if (projectType === 'application') {
    //only 'application' projects should have 'boot' related commands
    commands.push(...appOnlyCommands);
  }

  const targets = {};
  for (const command of commands) {
    targets[command] = {
      executor: `${NX_SPRING_BOOT_PKG}:${command}`,
      options: {
        root: projectRoot,
        runFromParentModule,
      },
      ...([
        pluginOptions.buildTargetName,
        pluginOptions.installTargetName,
        pluginOptions.serveTargetName,
        pluginOptions.runTargetName,
      ].includes(command)
        ? { dependsOn: [`^${pluginOptions.installTargetName}`] }
        : {}),
      ...([
        pluginOptions.buildTargetName,
        pluginOptions.buildImageTargetName,
        pluginOptions.installTargetName,
        pluginOptions.testTargetName,
      ].includes(command)
        ? {
            outputs: [
              joinPathFragments(
                '{workspaceRoot}',
                projectRoot,
                buildSystem === 'maven-project' ? 'target' : 'build'
              ),
            ],
          }
        : {}),
    };
  }
  return { projectType, targets };
}
