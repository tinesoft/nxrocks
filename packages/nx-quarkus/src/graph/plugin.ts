export interface NxQuarkusPluginOptions {
  buildTargetName?: string;
  installTargetName?: string;
  testTargetName?: string;
  cleanTargetName?: string;
  formatTargetName?: string;
  applyFormatTargetName?: string;
  checkFormatTargetName?: string;
  devTargetName?: string;
  serveTargetName?: string;
  remoteDevTargetName?: string;
  packageTargetName?: string;
  addExtensionTargetName?: string;
  listExtensionsTargetName?: string;
}

export function normalizePluginOptions(
  opts?: NxQuarkusPluginOptions
): NxQuarkusPluginOptions {
  const options = opts ?? {};
  return {
    ...options,
    buildTargetName: options.buildTargetName ?? 'build',
    installTargetName: options.installTargetName ?? 'install',
    testTargetName: options.testTargetName ?? 'test',
    cleanTargetName: options.cleanTargetName ?? 'clean',
    formatTargetName: options.formatTargetName ?? 'format',
    applyFormatTargetName: options.applyFormatTargetName ?? 'apply-format',
    checkFormatTargetName: options.checkFormatTargetName ?? 'check-format',
    devTargetName: options.devTargetName ?? 'dev',
    serveTargetName: options.serveTargetName ?? 'serve',
    remoteDevTargetName: options.remoteDevTargetName ?? 'remote-dev',
    packageTargetName: options.packageTargetName ?? 'package',
    addExtensionTargetName: options.addExtensionTargetName ?? 'add-extension',
    listExtensionsTargetName:
      options.listExtensionsTargetName ?? 'list-extensions',
  };
}
