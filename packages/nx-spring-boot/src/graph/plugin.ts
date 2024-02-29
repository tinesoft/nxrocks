export interface NxSpringBootPluginOptions {
  buildTargetName?: string;
  installTargetName?: string;
  testTargetName?: string;
  cleanTargetName?: string;
  formatTargetName?: string;
  applyFormatTargetName?: string;
  checkFormatTargetName?: string;
  runTargetName?: string;
  serveTargetName?: string;
  buildImageTargetName?: string;
  buildInfoTargetName?: string;
}

export function normalizePluginOptions(
  opts?: NxSpringBootPluginOptions
): NxSpringBootPluginOptions {
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
    runTargetName: options.runTargetName ?? 'run',
    serveTargetName: options.serveTargetName ?? 'serve',
    buildImageTargetName: options.buildImageTargetName ?? 'build-image',
    buildInfoTargetName: options.buildInfoTargetName ?? 'build-info',
  };
}
