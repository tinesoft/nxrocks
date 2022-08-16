import { execSync } from 'child_process';
import { HttpsProxyAgent, HttpProxyAgent } from 'hpagent';

export function getPackageLatestNpmVersion(pkg: string): string {
  try {
    return execSync(`npm show ${pkg} version`, {
      stdio: 'ignore',
    }).toString().trim() || 'latest';
  } catch (e) {
    return 'latest';
  }
}

export function getHttpProxyAgent(proxyUrl?: string): HttpProxyAgent | HttpsProxyAgent | undefined {
  const proxyAgentOpts = {
    keepAlive: true,
    keepAliveMsecs: 1000,
    maxSockets: 256,
    maxFreeSockets: 256,
    //scheduling: 'lifo',
    proxy: proxyUrl
  };

  const {
    http_proxy: httpProxy,
    https_proxy: httpsProxy,
    HTTP_PROXY,
    HTTPS_PROXY
  } = process.env;

  const proxy =  (proxyUrl || httpsProxy || HTTPS_PROXY || httpProxy || HTTP_PROXY)?.trim();

  if(proxy){
    console.log(`The proxy server at '${proxy}' will be used.`);
  }
  
  if (proxy?.startsWith('https')) {
    return new HttpsProxyAgent(proxyAgentOpts);
  } else if(proxy?.startsWith('http')){
    return new HttpProxyAgent(proxyAgentOpts);
  } else {
    return undefined
  }

}