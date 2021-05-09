import * as path from 'path';
import * as fs from 'fs';

import { fileExists } from '@nrwl/workspace/src/utils/fileutils';

import { XmlDocument } from 'xmldoc';

export interface PackageInfo {
  packageId: string;
  artifactId: string;
  groupId: string;
  dependencies?: PackageInfo[];
}

export function inspectDeps(projectRoot: string): PackageInfo {

  if (fileExists(path.join(projectRoot, 'pom.xml'))) { //quarkus maven project
    const pomXmlStr = fs.readFileSync(path.join(projectRoot, 'pom.xml'), 'utf8');
    const pomXmlNode = new XmlDocument(pomXmlStr);

    const groupId = pomXmlNode.valueWithPath('groupId');
    const artifactId = pomXmlNode.valueWithPath('artifactId');

    const dependencies: PackageInfo[] = [];
    const dependencyNodes = pomXmlNode.childNamed('dependencies')?.childrenNamed('dependency');

    for (const depNode of dependencyNodes) {
      const depGroupId = depNode.valueWithPath('groupId');
      const depArtifactId = depNode.valueWithPath('artifactId');
      dependencies.push({ packageId: `${depGroupId}:${depArtifactId}`, groupId: depGroupId, artifactId: depArtifactId });
    }

    return { packageId: `${groupId}:${artifactId}`, groupId, artifactId, dependencies };
  }

  if (fileExists(path.join(projectRoot, 'build.gradle'))//quarkus gradle project
    || fileExists(path.join(projectRoot, 'build.gradle.kts'))) {
    const ext = fileExists(path.join(projectRoot, 'build.gradle.kts')) ? '.kts' : '';
    const buildGradle = fs.readFileSync(path.join(projectRoot, `build.gradle${ext}`), 'utf8');
    const settingsGradle = fs.readFileSync(path.join(projectRoot, `settings.gradle${ext}`), 'utf8');

    const groupId = buildGradle.match(/group\s*=\s*['"]([^"']+)['"]/)?.[1];
    const artifactId = settingsGradle.match(/rootProject\.name\s*=\s*['"]([^"']+)['"]/)?.[1];

    const dependencies: PackageInfo[] = [];
    const dependencyIds = buildGradle.match(/\s*(api|implementation|testImplementation)\s*['"]([^"']+)['"]/) || [];

    for (const depId of dependencyIds) {
      const [depGroupId, depArtifactId] = depId.split(':');
      dependencies.push({ packageId: depId, groupId: depGroupId, artifactId: depArtifactId });
    }

    return { packageId: `${groupId}:${artifactId}`, groupId, artifactId, dependencies };
  }

  throw new Error(
    `Cannot inspect dependencies of Quarkus project at: '${projectRoot}'.\n` +
    `No 'pom.xml' nor 'build.gradle[.kts]' was found.`
  );

}