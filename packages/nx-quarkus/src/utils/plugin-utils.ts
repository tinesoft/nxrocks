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
import { NX_QUARKUS_PKG } from '..';
import { NormalizedSchema } from '../generators/project/schema';
import {
  NxQuarkusPluginOptions,
  normalizePluginOptions,
} from '../graph/plugin';

export function getProjectTypeAndTargetsFromFile(
  projectRootFile: string,
  options: NxQuarkusPluginOptions
) {
  const { root, name } = getNameAndRoot(projectRootFile);
  const buildSystem = hasMavenProject(root)
    ? 'MAVEN'
    : name.endsWith('.kts')
    ? 'GRADLE_KOTLIN_DSL'
    : 'GRADLE';

  const runFromParentModule = !hasMavenWrapper(root) && !hasGradleWrapper(root);
  let skipFormat = true;
  let projectType: ProjectType = 'library';

  if (buildSystem === 'MAVEN') {
    skipFormat = hasMavenPlugin(
      root,
      SPOTLESS_MAVEN_PLUGIN_GROUP_ID,
      SPOTLESS_MAVEN_PLUGIN_ARTIFACT_ID
    );
    projectType = hasMavenPlugin(
      root,
      '${quarkus.platform.group-id}',
      'quarkus-maven-plugin'
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
      getGradlePlugin(projectContent, 'io.quarkus')?.applied === false
        ? 'library'
        : 'application';
  }

  return getProjectTypeAndTargets(
    root,
    projectType,
    buildSystem,
    runFromParentModule,
    skipFormat,
    normalizePluginOptions(options)
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
  buildSystem: 'MAVEN' | 'GRADLE' | 'GRADLE_KOTLIN_DSL',
  runFromParentModule: boolean,
  skipFormat: boolean,
  pluginOptions: NxQuarkusPluginOptions
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
    pluginOptions.devTargetName,
    pluginOptions.serveTargetName,
    pluginOptions.remoteDevTargetName,
    pluginOptions.packageTargetName,
    pluginOptions.addExtensionTargetName,
    pluginOptions.listExtensionsTargetName,
  ];
  if (projectType === 'application') {
    //only 'application' projects should have 'quarkus' related commands
    commands.push(...appOnlyCommands);
  }

  const targets = {};
  for (const command of commands) {
    targets[command] = {
      executor: `${NX_QUARKUS_PKG}:${command}`,
      options: {
        root: projectRoot,
        runFromParentModule,
      },
      ...([
        pluginOptions.buildTargetName,
        pluginOptions.installTargetName,
      ].includes(command)
        ? { cache: true}
        : {}),
      ...([
        pluginOptions.buildTargetName,
        pluginOptions.installTargetName,
        pluginOptions.devTargetName,
        pluginOptions.remoteDevTargetName,
        pluginOptions.serveTargetName,
      ].includes(command)
        ? { dependsOn: [`^${pluginOptions.installTargetName}`] }
        : {}),
      ...([
        pluginOptions.buildTargetName,
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
