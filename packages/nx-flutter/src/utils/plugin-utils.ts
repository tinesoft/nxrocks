import { joinPathFragments } from '@nx/devkit';
import {
  getNameAndRoot,
  hasProjectFile,
  getProjectFileContent,
} from '@nxrocks/common';
import {
  PlatformType,
  TemplateType,
  NormalizedSchema,
} from '../generators/project/schema';
import {
  NxFlutterPluginOptions,
  normalizePluginOptions,
} from '../graph/plugin';

export function getProjectTypeAndTargetsFromFile(
  projectRootFile: string,
  pluginOptions: NxFlutterPluginOptions
) {
  const { root } = getNameAndRoot(projectRootFile);

  const platforms: PlatformType[] = [];
  let template: TemplateType = 'app';

  if (hasProjectFile({ root }, 'android')) platforms.push('android');
  if (hasProjectFile({ root }, 'ios')) platforms.push('ios');
  if (hasProjectFile({ root }, 'linux')) platforms.push('linux');
  if (hasProjectFile({ root }, 'macos')) platforms.push('macos');
  if (hasProjectFile({ root }, 'web')) platforms.push('web');
  if (hasProjectFile({ root }, 'windows')) platforms.push('windows');

  if (hasProjectFile({ root }, '.metadata')) {
    const projectMetadata = getProjectFileContent({ root }, '.metadata');
    template =
      (/project_type: (\w+)/.exec(projectMetadata)?.[1] as TemplateType) ||
      'app';
  }

  return getProjectTypeAndTargets(
    root,
    template,
    platforms,
    normalizePluginOptions(pluginOptions)
  );
}

export function getProjectTypeAndTargetsFromOptions(options: NormalizedSchema) {
  return getProjectTypeAndTargets(
    options.projectRoot,
    options.template,
    options.platforms,
    normalizePluginOptions({ useFvm: options.useFvm })
  );
}

function getProjectTypeAndTargets(
  projectRoot: string,
  template: TemplateType,
  platforms: PlatformType[],
  pluginOptions: NxFlutterPluginOptions
) {
  const targets = {};
  const commands = [
    { key: pluginOptions.analyzeTargetName, value: 'analyze' },
    { key: pluginOptions.assembleTargetName, value: 'assemble' },
    { key: pluginOptions.cleanTargetName, value: 'clean' },
    {
      key: pluginOptions.formatTargetName,
      value: `format ${joinPathFragments(projectRoot, '*')}`,
    },
    { key: pluginOptions.testTargetName, value: 'test' },
    { key: pluginOptions.genL10nTargetName, value: 'gen-l10n' },

    { key: pluginOptions.pubGetTargetName, value: 'pub get' },
    { key: pluginOptions.pubUpgradeTargetName, value: 'pub upgrade' },
    { key: pluginOptions.pubDowngradeTargetName, value: 'pub downgrade' },
    { key: pluginOptions.pubOutdatedTargetName, value: 'pub outdated' },
    { key: pluginOptions.pubAddTargetName, value: 'pub add {args.package}' },
    {
      key: pluginOptions.pubRemoveTargetName,
      value: 'pub remove {args.package}',
    },
    { key: pluginOptions.pubRunTargetName, value: 'pub run {args.executable}' },
    //{ key: pluginOptions.pubCacheTargetName, value: 'pub cache' },
    //{ key: pluginOptions.pubGlobalTargetName, value: 'pub global' },
    { key: pluginOptions.pubPublishTargetName, value: 'pub publish' },
    { key: pluginOptions.pubDepsTargetName, value: 'pub deps' },
    { key: pluginOptions.pubVersionTargetName, value: 'pub version' },
  ];

  if (template === 'app') {
    commands.push(
      { key: pluginOptions.attachTargetName, value: 'attach' },
      { key: pluginOptions.driveTargetName, value: 'drive' },
      { key: pluginOptions.installTargetName, value: 'install' },
      { key: pluginOptions.runTargetName, value: 'run' }
    );
  }

  if (platforms?.indexOf('android') != -1) {
    commands.push(
      { key: pluginOptions.buildAarTargetName, value: 'build aar' },
      { key: pluginOptions.buildApkTargetName, value: 'build apk' },
      { key: pluginOptions.buildAppbundleTargetName, value: 'build appbundle' },
      { key: pluginOptions.buildBundleTargetName, value: 'build bundle' }
    );
  }

  if (platforms?.indexOf('ios') != -1) {
    commands.push(
      { key: pluginOptions.buildIosTargetName, value: 'build ios' },
      {
        key: pluginOptions.buildIosFrameworkTargetName,
        value: 'build ios-framework',
      },
      { key: pluginOptions.buildIpaTargetName, value: 'build ipa' }
    );
  }

  for (const command of commands) {
    targets[command.key] = {
      executor: `nx:run-commands`,
      options: {
        command: `${
          command.key === pluginOptions.formatTargetName
            ? 'dart'
            : `${pluginOptions.useFvm === true ? 'fvm ' : ''}flutter`
        } ${command.value}`,
        cwd: projectRoot,
      },
      ...([
        pluginOptions.buildAarTargetName,
        pluginOptions.buildApkTargetName,
        pluginOptions.buildAppbundleTargetName,
        pluginOptions.buildBundleTargetName,
        pluginOptions.buildIosTargetName,
        pluginOptions.buildIosFrameworkTargetName,
        pluginOptions.buildIpaTargetName,
      ].includes(command.key)
        ? {
            outputs: [
              joinPathFragments('{workspaceRoot}', projectRoot, 'build'),
            ],
          }
        : {}),
    };
  }
  return {
    projectType:
      template === 'app' ? ('application' as const) : ('library' as const),
    targets,
  };
}
