import { isFlutterInstalled } from '../utils/flutter-utils';

export interface NxFlutterPluginOptions {
  useFvm?: boolean;
  analyzeTargetName?: string;
  cleanTargetName?: string;
  formatTargetName?: string;
  testTargetName?: string;
  assembleTargetName?: string;
  attachTargetName?: string;
  driveTargetName?: string;
  genL10nTargetName?: string;
  installTargetName?: string;
  runTargetName?: string;
  buildAarTargetName?: string;
  buildApkTargetName?: string;
  buildAppbundleTargetName?: string;
  buildBundleTargetName?: string;
  buildIosTargetName?: string;
  buildIosFrameworkTargetName?: string;
  buildIpaTargetName?: string;

  // pub related sub-commands
  pubGetTargetName?: string;
  pubUpgradeTargetName?: string;
  pubDowngradeTargetName?: string;
  pubOutdatedTargetName?: string;
  pubAddTargetName?: string;
  pubRemoveTargetName?: string;
  pubRunTargetName?: string;
  //pubCacheTargetName?: string;
  //pubGlobalTargetName?: string;
  pubPublishTargetName?: string;
  pubDepsTargetName?: string;
  pubVersionTargetName?: string;
}

export function normalizePluginOptions(
  opts?: NxFlutterPluginOptions
): NxFlutterPluginOptions {
  const options = opts ?? {};
  const isFvmInstalled = isFlutterInstalled(true);

  return {
    ...options,
    useFvm: options.useFvm && isFvmInstalled,
    analyzeTargetName: options.analyzeTargetName ?? 'analyze',
    cleanTargetName: options.cleanTargetName ?? 'clean',
    formatTargetName: options.formatTargetName ?? 'format',
    testTargetName: options.testTargetName ?? 'test',
    assembleTargetName: options.assembleTargetName ?? 'assemble',
    attachTargetName: options.attachTargetName ?? 'attach',
    driveTargetName: options.driveTargetName ?? 'drive',
    genL10nTargetName: options.genL10nTargetName ?? 'gen-l10n',
    installTargetName: options.installTargetName ?? 'install',
    runTargetName: options.runTargetName ?? 'run',
    buildAarTargetName: options.buildAarTargetName ?? 'build-aar',
    buildApkTargetName: options.buildApkTargetName ?? 'build-apk',
    buildAppbundleTargetName:
      options.buildAppbundleTargetName ?? 'build-appbundle',
    buildBundleTargetName: options.buildBundleTargetName ?? 'build-bundle',
    buildIosTargetName: options.buildIosTargetName ?? 'build-ios',
    buildIosFrameworkTargetName:
      options.buildIosFrameworkTargetName ?? 'build-ios-framework',
    buildIpaTargetName: options.buildIpaTargetName ?? 'build-ipa',

    // pub related sub-commands
    pubGetTargetName: options.pubGetTargetName ?? 'pub-get',
    pubUpgradeTargetName: options.pubUpgradeTargetName ?? 'pub-upgrade',
    pubDowngradeTargetName: options.pubDowngradeTargetName ?? 'pub-downgrade',
    pubOutdatedTargetName: options.pubOutdatedTargetName ?? 'pub-outdated',
    pubAddTargetName: options.pubAddTargetName ?? 'pub-add',
    pubRemoveTargetName: options.pubRemoveTargetName ?? 'pub-remove',
    pubRunTargetName: options.pubRunTargetName ?? 'pub-run',
    //pubCacheTargetName: options.pubCacheTargetName ?? 'pub-cache',
    //pubGlobalTargetName: options.pubGlobalTargetName ?? 'pub-global',
    pubPublishTargetName: options.pubPublishTargetName ?? 'pub-publish',
    pubDepsTargetName: options.pubDepsTargetName ?? 'pub-deps',
    pubVersionTargetName: options.pubVersionTargetName ?? 'pub-version',
  };
}
