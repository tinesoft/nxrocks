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
  BuilderCommandAliasType,
} from '@nxrocks/common-jvm';
import { NX_KTOR_PKG } from '..';
import { NormalizedSchema } from '../generators/project/schema';
import { NxKtorPluginOptions, normalizePluginOptions } from '../graph/plugin';

export function getProjectTypeAndTargetsFromFile(
  projectRootFile: string,
  pluginOptions: NxKtorPluginOptions
) {
  const { root, name } = getNameAndRoot(projectRootFile);
  const buildSystem = hasMavenProject(root)
    ? 'MAVEN'
    : name.endsWith('.kts')
    ? 'GRADLE_KTS'
    : 'GRADLE';

  const runFromParentModule = !hasMavenWrapper(root) && !hasGradleWrapper(root);
  let skipFormat = true;
  const projectType: ProjectType = 'application';

  if (buildSystem === 'MAVEN') {
    skipFormat = hasMavenPlugin(
      root,
      SPOTLESS_MAVEN_PLUGIN_GROUP_ID,
      SPOTLESS_MAVEN_PLUGIN_ARTIFACT_ID
    );
  } else {
    const projectContent = getProjectFileContent(
      { root },
      `build${getGradleBuildFilesExtension({ root })}`
    );
    skipFormat = hasGradlePlugin(projectContent, SPOTLESS_GRADLE_PLUGIN_ID);
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
    'application',
    options.buildSystem,
    !options.keepProjectLevelWrapper,
    options.skipFormat,
    normalizePluginOptions()
  );
}

function getProjectTypeAndTargets(
  projectRoot: string,
  projectType: ProjectType,
  buildSystem: 'MAVEN' | 'GRADLE' | 'GRADLE_KTS',
  runFromParentModule: boolean,
  skipFormat: boolean,
  pluginOptions: NxKtorPluginOptions
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

  const ktorOnlyCommands = [
    pluginOptions.runTargetName,
    pluginOptions.serveTargetName,
    pluginOptions.buildImageTargetName,
    pluginOptions.publishImageTargetName,
    pluginOptions.publishImageLocallyTargetName,
    pluginOptions.runDockerTargetName,
  ];
  commands.push(...ktorOnlyCommands);

  const targets = {};
  for (const command of commands) {
    targets[command] = {
      executor: `${NX_KTOR_PKG}:${command}`,
      options: {
        root: projectRoot,
        runFromParentModule,
      },
      ...([
        pluginOptions.buildTargetName,
        pluginOptions.installTargetName,
        pluginOptions.runTargetName,
        pluginOptions.serveTargetName,
      ].includes(command)
        ? { dependsOn: [`^${pluginOptions.installTargetName}`] }
        : {}),
      ...([
        pluginOptions.publishImageTargetName,
        pluginOptions.publishImageLocallyTargetName,
        pluginOptions.runDockerTargetName,
      ].includes(command)
        ? { dependsOn: [pluginOptions.buildImageTargetName] }
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
                buildSystem === 'MAVEN' ? 'target' : 'build'
              ),
            ],
          }
        : {}),
    };
  }
  return { projectType, targets };
}
