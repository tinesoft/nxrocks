import * as path from 'path';
import * as fs from 'fs';

import { fileExists } from '@nrwl/workspace/src/utils/fileutils';

import { XmlDocument } from 'xmldoc';

export interface PackageInfo {
  packageId: string;
  packageFile: string;
  artifactId: string;
  groupId: string;
  dependencies?: PackageInfo[];
}

function determineGroupId(xmlDocument: XmlDocument): string | undefined {
  const rootLevelGroupId = xmlDocument.valueWithPath('groupId');
  if(rootLevelGroupId) return rootLevelGroupId;
  return xmlDocument.childNamed('parent')?.valueWithPath('groupId');
}

export function inspectDeps(projectRoot: string): PackageInfo {

  if (fileExists(path.join(projectRoot, 'pom.xml'))) { //spring-boot maven project
    const packageFile = path.join(projectRoot, 'pom.xml');
    const pomXmlStr = fs.readFileSync(packageFile, 'utf8');
    const pomXmlNode = new XmlDocument(pomXmlStr);

    const groupId = determineGroupId(pomXmlNode);
    const artifactId = pomXmlNode.valueWithPath('artifactId');

    const dependencies: PackageInfo[] = [];
    const dependencyNodes = pomXmlNode.childNamed('dependencies')?.childrenNamed('dependency');

    for (const depNode of dependencyNodes) {
      const depGroupId = depNode.valueWithPath('groupId');
      const depArtifactId = depNode.valueWithPath('artifactId');
      dependencies.push({ packageId: `${depGroupId}:${depArtifactId}`, packageFile: 'pom.xml', groupId: depGroupId, artifactId: depArtifactId });
    }

    return { packageId: `${groupId}:${artifactId}`, packageFile: 'pom.xml', groupId, artifactId, dependencies };
  }

  if (fileExists(path.join(projectRoot, 'build.gradle'))//spring-boot gradle project
    || fileExists(path.join(projectRoot, 'build.gradle.kts'))) {
    const ext = fileExists(path.join(projectRoot, 'build.gradle.kts')) ? '.kts' : '';
    const packageFile = path.join(projectRoot, `build.gradle${ext}`);
    const buildGradle = fs.readFileSync(packageFile, 'utf8');
    const settingsGradle = fs.readFileSync(path.join(projectRoot, `settings.gradle${ext}`), 'utf8');

    const groupId = buildGradle.match(/group\s*=\s*['"]([^"']+)['"]/)?.[1];
    const artifactId = settingsGradle.match(/rootProject\.name\s*=\s*['"]([^"']+)['"]/)?.[1];

    const dependencies: PackageInfo[] = [];
    const dependencyIds = buildGradle.match(/\s*(api|implementation|testImplementation)\s*['"]([^"']+)['"]/) || [];

    for (const depId of dependencyIds) {
      const [depGroupId, depArtifactId] = depId.split(':');
      dependencies.push({ packageId: depId, packageFile: `build.gradle${ext}`, groupId: depGroupId, artifactId: depArtifactId });
    }

    return { packageId: `${groupId}:${artifactId}`, packageFile: `build.gradle${ext}`, groupId, artifactId, dependencies };
  }

  throw new Error(
    `Cannot inspect dependencies of Spring Boot projet at: '${projectRoot}'.\n` +
    `No 'pom.xml' nor 'build.gradle[.kts]' was found.`
  );

}
