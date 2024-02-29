export interface NxMicronautPluginOptions {
  buildTargetName?: string;
  installTargetName?: string;
  testTargetName?: string;
  cleanTargetName?: string;
  formatTargetName?: string;
  applyFormatTargetName?: string;
  checkFormatTargetName?: string;
  runTargetName?: string;
  serveTargetName?: string;
  dockerfileTargetName?: string;
  aotSampleConfigTargetName?: string;
}

export function normalizePluginOptions(
  opts?: NxMicronautPluginOptions
): NxMicronautPluginOptions {
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
    dockerfileTargetName: options.dockerfileTargetName ?? 'dockerfile',
    aotSampleConfigTargetName:
      options.aotSampleConfigTargetName ?? 'aot-sample-config',
  };
}
