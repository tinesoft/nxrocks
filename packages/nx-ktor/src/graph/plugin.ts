export interface NxKtorPluginOptions {
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
  publishImageTargetName?: string;
  publishImageLocallyTargetName?: string;
  runDockerTargetName?: string;
}

export function normalizePluginOptions(
  opts?: NxKtorPluginOptions
): NxKtorPluginOptions {
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
    publishImageTargetName: options.publishImageTargetName ?? 'publish-image',
    publishImageLocallyTargetName:
      options.publishImageLocallyTargetName ?? 'publish-image-locally',
    runDockerTargetName: options.runDockerTargetName ?? 'run-docker',
  };
}
