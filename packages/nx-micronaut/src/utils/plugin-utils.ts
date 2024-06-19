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
import { NX_MICRONAUT_PKG } from '..';
import { NormalizedSchema } from '../generators/project/schema';
import {
  NxMicronautPluginOptions,
  normalizePluginOptions,
} from '../graph/plugin';

export function getProjectTypeAndTargetsFromFile(
  projectRootFile: string,
  pluginOptions: NxMicronautPluginOptions
) {
  const { root, name } = getNameAndRoot(projectRootFile);
  const buildSystem = hasMavenProject(root)
    ? 'MAVEN'
    : name.endsWith('.kts')
    ? 'GRADLE_KOTLIN'
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
  buildSystem: 'MAVEN' | 'GRADLE' | 'GRADLE_KOTLIN',
  runFromParentModule: boolean,
  skipFormat: boolean,
  pluginOptions: NxMicronautPluginOptions
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

  const mnOnlyCommands = [
    pluginOptions.runTargetName,
    pluginOptions.serveTargetName,
    pluginOptions.dockerfileTargetName,
    pluginOptions.aotSampleConfigTargetName,
  ];
  commands.push(...mnOnlyCommands);

  const targets = {};
  for (const command of commands) {
    targets[command] = {
      executor: `${NX_MICRONAUT_PKG}:${command}`,
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
        pluginOptions.runTargetName,
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
