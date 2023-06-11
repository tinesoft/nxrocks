import { execSync } from 'child_process';
import { HttpsProxyAgent, HttpProxyAgent } from 'hpagent';

export function getPackageLatestNpmVersion(pkg: string): string {
  try {
    return (
      execSync(`npm show ${pkg} version`, {
        stdio: 'ignore',
      })
        .toString()
        .trim() || 'latest'
    );
  } catch (e) {
    return 'latest';
  }
}

export function getHttpProxyAgent(
  targetUrl: string,
  proxyUrl?: string
): HttpProxyAgent | HttpsProxyAgent | undefined {

  const {
    http_proxy: httpProxy,
    https_proxy: httpsProxy,
    HTTP_PROXY,
    HTTPS_PROXY,
  } = process.env;

  const proxy = (
    proxyUrl ||
    httpsProxy ||
    HTTPS_PROXY ||
    httpProxy ||
    HTTP_PROXY
  )?.trim();

  if (!proxy) {
    return undefined;
  }

  console.log(`The proxy server at '${proxy}' will be used.`);

  const proxyAgentOpts = {
    keepAlive: true,
    keepAliveMsecs: 1000,
    maxSockets: 256,
    maxFreeSockets: 256,
    //scheduling: 'lifo',
    proxy: proxy,
  };

  if (targetUrl?.startsWith('https')) {
    return new HttpsProxyAgent(proxyAgentOpts);
  } else if (targetUrl?.startsWith('http')) {
    return new HttpProxyAgent(proxyAgentOpts);
  } else {
    return undefined;
  }
}

export function getCommonHttpHeaders(
  pkgName: string,
  targetUrl: string,
  proxyUrl?: string
) {
  const pkgVersion = getPackageLatestNpmVersion(pkgName);
  const userAgent = `${pkgName.replace('/', '_')}/${pkgVersion}`;
  const proxyAgent = getHttpProxyAgent(targetUrl, proxyUrl);
  return {
    headers: {
      'User-Agent': userAgent,
    },
    ...(proxyAgent ? { agent: proxyAgent } : {}),
  };
}
