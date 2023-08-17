import { Tree } from '@nx/devkit';
import {
  getGradlePlugins,
  hasGradlePlugin,
  addGradlePlugin,
  applySpotlessGradlePlugin,
  addSpotlessGradlePlugin,
  disableGradlePlugin,
  getGradlePlugin,
  isMultiModuleGradleProject,
  hasGradleModule,
  addGradleModule,
} from './gradle-utils';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { stripIndent } from '../utils';
import { SPOTLESS_GRADLE_PLUGIN_ID } from '.';

const BUILD_GRADLE_FILE = `plugins {
	id 'org.springframework.boot' version '2.6.2'
	id 'io.spring.dependency-management' version '1.0.11.RELEASE'
	id 'groovy'
}

group = 'com.example'
version = '0.0.1-SNAPSHOT'
sourceCompatibility = '11'

repositories {
	mavenCentral()
}

dependencies {
	implementation 'org.springframework.boot:spring-boot-starter'
	implementation 'org.codehaus.groovy:groovy'
	testImplementation 'org.springframework.boot:spring-boot-starter-test'
}

test {
	useJUnitPlatform()
}`;

const BUILD_GRADLE_KOTLIN_FILE = `import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
	id("org.springframework.boot") version "2.6.2"
	id("io.spring.dependency-management") version "1.0.11.RELEASE"
	kotlin("jvm") version "1.6.10"
	kotlin("plugin.spring") version "1.6.10"
}

group = "com.example"
version = "0.0.1-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_11

repositories {
	mavenCentral()
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter")
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
}

tasks.withType<KotlinCompile> {
	kotlinOptions {
		freeCompilerArgs = listOf("-Xjsr305=strict")
		jvmTarget = "11"
	}
}

tasks.withType<Test> {
	useJUnitPlatform()
}`;

const SETTINGS_FILE = `
rootProject.name = 'demo'
`;
const SETTINGS_KTS_FILE = `
rootProject.name = "demo"
`;

const MULTI_MODULE_SETTINGS_FILE = `
rootProject.name = 'demo'

include 'library1'
include 'library2'
`;

const MULTI_MODULE_SETTINGS_KTS_FILE = `
rootProject.name = "demo"

include("library1")
include("library2")
`;

describe('gradle-utils', () => {
  describe('getGradlePlugins', () => {
    it('should get gradle plugins from build.gradle file', () => {
      const plugins = getGradlePlugins(BUILD_GRADLE_FILE);
      //should return 3 plugins from BUILD_GRADLE_FILE
      expect(plugins.length).toBe(3);
      expect(plugins).toEqual(
        expect.arrayContaining([
          {
            id: 'org.springframework.boot',
            version: '2.6.2',
            kotlin: false,
            java: false,
            applied: true,
          },
          {
            id: 'io.spring.dependency-management',
            version: '1.0.11.RELEASE',
            kotlin: false,
            java: false,
            applied: true,
          },
          {
            id: 'groovy',
            kotlin: false,
            java: false,
            applied: true,
          },
        ])
      );
    });

    it('should get gradle plugins from build.gradle kotlin file', () => {
      const plugins = getGradlePlugins(BUILD_GRADLE_KOTLIN_FILE);
      //should return 4 plugins from BUILD_GRADLE_KOTLIN_FILE
      expect(plugins.length).toBe(4);
      expect(plugins).toEqual(
        expect.arrayContaining([
          {
            id: 'org.springframework.boot',
            version: '2.6.2',
            kotlin: false,
            java: false,
            applied: true,
          },
          {
            id: 'io.spring.dependency-management',
            version: '1.0.11.RELEASE',
            kotlin: false,
            java: false,
            applied: true,
          },
          {
            id: 'jvm',
            version: '1.6.10',
            kotlin: true,
            java: false,
            applied: true,
          },
          {
            id: 'plugin.spring',
            version: '1.6.10',
            kotlin: true,
            java: false,
            applied: true,
          },
        ])
      );
    });
  });

  describe('hasGradlePlugin', () => {
    it.each`
      pluginId                             | pluginVersion       | buildGradle                 | kotlin   | expected
      ${'org.springframework.boot'}        | ${'2.6.2'}          | ${BUILD_GRADLE_FILE}        | ${false} | ${true}
      ${'io.spring.dependency-management'} | ${'1.0.11.RELEASE'} | ${BUILD_GRADLE_FILE}        | ${false} | ${true}
      ${'groovy'}                          | ${undefined}        | ${BUILD_GRADLE_FILE}        | ${false} | ${true}
      ${'groovy'}                          | ${'x.y.z'}          | ${BUILD_GRADLE_FILE}        | ${false} | ${false}
      ${'org.springframework.boot'}        | ${'2.6.2'}          | ${BUILD_GRADLE_KOTLIN_FILE} | ${true}  | ${true}
      ${'io.spring.dependency-management'} | ${'1.0.11.RELEASE'} | ${BUILD_GRADLE_KOTLIN_FILE} | ${true}  | ${true}
      ${'jvm'}                             | ${'1.6.10'}         | ${BUILD_GRADLE_KOTLIN_FILE} | ${true}  | ${true}
      ${'jvm'}                             | ${'x.y.z'}          | ${BUILD_GRADLE_KOTLIN_FILE} | ${true}  | ${false}
    `(
      `should return $expected when searching plugin '$pluginId' with version: '$pluginVersion' in build.gradle (kotlin: $kotlin) file`,
      ({ pluginId, pluginVersion, buildGradle, expected }) => {
        expect(hasGradlePlugin(buildGradle, pluginId, pluginVersion)).toBe(
          expected
        );
      }
    );
  });

  describe('addGradlePlugin', () => {
    let tree: Tree;
    beforeEach(() => {
      tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    });

    it('should add plugin to build.gradle file with no prexisting plugins section', () => {
      tree.write('./build.gradle', '');
      const added = addGradlePlugin(
        tree,
        '.',
        'java',
        'org.springframework.boot',
        '2.6.2'
      );
      expect(added).toBe(true);

      const buildGradle = tree.read('./build.gradle', 'utf-8');
      console.log(buildGradle);
      expect(buildGradle).toContain(
        stripIndent`
            plugins {
            	id 'org.springframework.boot' version '2.6.2'
            }
            `
      );
    });

    it('should append gradle plugin to build.gradle file with existing plugins section', () => {
      tree.write(
        './build.gradle',
        stripIndent`
            plugins {
            	id 'org.springframework.boot' version '2.6.2'
            }
            `
      );
      const added = addGradlePlugin(
        tree,
        '.',
        'java',
        'com.diffplug.spotless',
        '6.1.2'
      );
      expect(added).toBe(true);

      const buildGradle = tree.read('./build.gradle', 'utf-8');
      expect(buildGradle).toEqual(
        stripIndent`
            plugins {
            	id 'org.springframework.boot' version '2.6.2'
            	id 'com.diffplug.spotless' version '6.1.2'
            }
            `
      );
    });

    it('should still add plugin to build.gradle file when version is not specified', () => {
      tree.write('./build.gradle', '');
      const added = addGradlePlugin(tree, '.', 'java', 'java-library');
      expect(added).toBe(true);

      const buildGradle = tree.read('./build.gradle', 'utf-8');
      console.log(buildGradle);
      expect(buildGradle).toContain(
        stripIndent`
            plugins {
            	id 'java-library'
            }
            `
      );
    });
  });

  describe('disableGradlePlugin', () => {
    let tree: Tree;
    beforeEach(() => {
      tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    });

    it.each`
      pluginId                             | language    | buildGradle                 | expected
      ${'org.springframework.boot'}        | ${'java'}   | ${BUILD_GRADLE_FILE}        | ${true}
      ${'org.springframework.fake'}        | ${'java'}   | ${BUILD_GRADLE_FILE}        | ${false}
      ${'io.spring.dependency-management'} | ${'java'}   | ${BUILD_GRADLE_FILE}        | ${true}
      ${'groovy'}                          | ${'groovy'} | ${BUILD_GRADLE_FILE}        | ${true}
      ${'org.springframework.boot'}        | ${'kotlin'} | ${BUILD_GRADLE_KOTLIN_FILE} | ${true}
      ${'org.springframework.fake'}        | ${'kotlin'} | ${BUILD_GRADLE_KOTLIN_FILE} | ${false}
      ${'io.spring.dependency-management'} | ${'kotlin'} | ${BUILD_GRADLE_KOTLIN_FILE} | ${true}
      ${'jvm'}                             | ${'kotlin'} | ${BUILD_GRADLE_KOTLIN_FILE} | ${true}
    `(
      `should disable:$expected plugin '$pluginId' in '$language' build file`,
      ({ pluginId, language, buildGradle, expected }) => {
        const withKotlinDSL = language === 'kotlin';
        const ext = withKotlinDSL ? '.gradle.kts' : '.gradle';
        tree.write(`./build${ext}`, buildGradle);
        const disabled = disableGradlePlugin(tree, '.', language, pluginId);
        expect(disabled).toBe(expected);

        const newBuildGradle = tree.read(`./build${ext}`, 'utf-8');
        if (expected) {
          expect(getGradlePlugin(newBuildGradle, pluginId).applied).toBe(false);
        }
      }
    );
  });

  describe('applySpotlessGradlePlugin', () => {
    let tree: Tree;
    beforeEach(() => {
      tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    });

    it.each`
      language    | jdkVersion   | baseGitBranch | formatter               | expected
      ${'java'}   | ${'11'}      | ${'master'}   | ${'googleJavaFormat()'} | ${true}
      ${'java'}   | ${undefined} | ${undefined}  | ${'googleJavaFormat()'} | ${true}
      ${'kotlin'} | ${'11'}      | ${'develop'}  | ${'ktfmt()'}            | ${true}
      ${'kotlin'} | ${'8'}       | ${'develop'}  | ${'ktlint()'}           | ${true}
      ${'kotlin'} | ${undefined} | ${undefined}  | ${'ktlint()'}           | ${true}
      ${'groovy'} | ${'11'}      | ${'master'}   | ${'greclipse()'}        | ${true}
      ${'groovy'} | ${undefined} | ${undefined}  | ${'greclipse()'}        | ${true}
    `(
      `should return $expected when applying spotless gradle plugin to project with language: '$language', jdkVersion: '$jdkVersion', baseGitBranch: '$baseGitBranch'`,
      ({ language, jdkVersion, baseGitBranch, formatter, expected }) => {
        const withKotlinDSL = language === 'kotlin';
        const ext = withKotlinDSL ? '.gradle.kts' : '.gradle';
        tree.write(`./build${ext}`, '');
        const applied = applySpotlessGradlePlugin(
          tree,
          '.',
          language,
          jdkVersion,
          baseGitBranch
        );
        const buildGradle = tree.read(`./build${ext}`, 'utf-8');
        expect(applied).toBe(expected);
        expect(buildGradle).toContain(formatter);

        const ratchetFrom = withKotlinDSL
          ? `ratchetFrom("${baseGitBranch}")`
          : `ratchetFrom '${baseGitBranch}'`;
        if (baseGitBranch) {
          expect(buildGradle).toContain(ratchetFrom);
        } else {
          expect(buildGradle).not.toContain(ratchetFrom);
        }
      }
    );
  });

  describe('addSpotlessGradlePlugin', () => {
    let tree: Tree;
    beforeEach(() => {
      tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    });

    it.each`
      language    | jdkVersion   | baseGitBranch | pluginId                                | expected
      ${'java'}   | ${'11'}      | ${'master'}   | ${`id '${SPOTLESS_GRADLE_PLUGIN_ID}'`}  | ${true}
      ${'java'}   | ${undefined} | ${undefined}  | ${`id '${SPOTLESS_GRADLE_PLUGIN_ID}'`}  | ${true}
      ${'kotlin'} | ${'11'}      | ${'develop'}  | ${`id("${SPOTLESS_GRADLE_PLUGIN_ID}")`} | ${true}
      ${'kotlin'} | ${'8'}       | ${'develop'}  | ${`id("${SPOTLESS_GRADLE_PLUGIN_ID}")`} | ${true}
      ${'kotlin'} | ${undefined} | ${undefined}  | ${`id("${SPOTLESS_GRADLE_PLUGIN_ID}")`} | ${true}
      ${'groovy'} | ${'11'}      | ${'master'}   | ${`id '${SPOTLESS_GRADLE_PLUGIN_ID}'`}  | ${true}
      ${'groovy'} | ${undefined} | ${undefined}  | ${`id '${SPOTLESS_GRADLE_PLUGIN_ID}'`}  | ${true}
    `(
      `should return $expected when applying spotless gradle plugin to project with language: '$language', jdkVersion: '$jdkVersion', baseGitBranch: '$baseGitBranch'`,
      ({ language, jdkVersion, baseGitBranch, pluginId, expected }) => {
        const withKotlinDSL = language === 'kotlin';
        const ext = withKotlinDSL ? '.gradle.kts' : '.gradle';
        tree.write(`./build${ext}`, '');
        const added = addSpotlessGradlePlugin(
          tree,
          '.',
          language,
          jdkVersion,
          baseGitBranch
        );
        const buildGradle = tree.read(`./build${ext}`, 'utf-8');
        expect(added).toBe(expected);
        expect(buildGradle).toContain(pluginId);
      }
    );
  });

  describe('isMultiModuleGradleProject', ()=>{
    let tree: Tree;
    const rootFolder = 'apps/gradleapp';
    beforeEach(async () => {
      tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    });

    it('should return true on a multi-module gradle project', ()=>{
      tree.write(`./${rootFolder}/build.gradle`, BUILD_GRADLE_FILE);
      tree.write(`./${rootFolder}/settings.gradle`, MULTI_MODULE_SETTINGS_FILE);

      expect(isMultiModuleGradleProject(tree, rootFolder)).toBe(true);
    });

    it('should return true on a multi-module gradle kotlin project', ()=>{
      tree.write(`./${rootFolder}/build.gradle.kts`, BUILD_GRADLE_KOTLIN_FILE);
      tree.write(`./${rootFolder}/settings.gradle.kts`, MULTI_MODULE_SETTINGS_KTS_FILE);

      expect(isMultiModuleGradleProject(tree, rootFolder)).toBe(true);
    });

    it('should return false on non multi-module gradle project', ()=>{
      tree.write(`./${rootFolder}/build.gradle`, BUILD_GRADLE_FILE);
      tree.write(`./${rootFolder}/settings.gradle`, SETTINGS_FILE);

    expect(isMultiModuleGradleProject(tree, rootFolder)).toBe(false);
    });

    it('should return false on non multi-module gradle kotlin project', ()=>{
      tree.write(`./${rootFolder}/build.gradle.kts`, BUILD_GRADLE_KOTLIN_FILE);
      tree.write(`./${rootFolder}/settings.gradle.kts`, SETTINGS_KTS_FILE);

      expect(isMultiModuleGradleProject(tree, rootFolder)).toBe(false);
    });


    it('should return false if no build|settings.gradle[.kts] nor settings.gradle[.kts] is found', ()=>{
      expect(isMultiModuleGradleProject(tree, rootFolder)).toBe(false);
    });

    it('should found the gradle module if present', ()=>{
      tree.write(`./${rootFolder}/build.gradle.kts`, BUILD_GRADLE_FILE);
      tree.write(`./${rootFolder}/settings.gradle.kts`, MULTI_MODULE_SETTINGS_FILE);

      expect(hasGradleModule(tree, rootFolder, 'library1')).toBe(true);
      expect(hasGradleModule(tree, rootFolder, 'libraryx')).toBe(false);
    });

    it('should found the kotlin gradle module if present', ()=>{
      tree.write(`./${rootFolder}/build.gradle.kts`, BUILD_GRADLE_KOTLIN_FILE);
      tree.write(`./${rootFolder}/settings.gradle.kts`, MULTI_MODULE_SETTINGS_KTS_FILE);

      expect(hasGradleModule(tree, rootFolder, 'library1')).toBe(true);
      expect(hasGradleModule(tree, rootFolder, 'libraryx')).toBe(false);
    });
  });

  describe('addGradleModule', ()=>{
    let tree: Tree;
    const rootFolder = 'apps/gradleapp';
    beforeEach(async () => {
      tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    });

    it('should add gradle module when not already present', ()=>{
      tree.write(`./${rootFolder}/build.gradle`, BUILD_GRADLE_FILE);
      tree.write(`./${rootFolder}/settings.gradle`, MULTI_MODULE_SETTINGS_FILE);

      expect(hasGradleModule(tree, rootFolder, 'libraryX')).toBe(false);
      expect(addGradleModule(tree, rootFolder, 'libraryX', false)).toBe(true);
      expect(hasGradleModule(tree, rootFolder, 'libraryX')).toBe(true);
    });

    it('should not add gradle module when already present', ()=>{
      tree.write(`./${rootFolder}/build.gradle`, BUILD_GRADLE_FILE);
      tree.write(`./${rootFolder}/settings.gradle`, MULTI_MODULE_SETTINGS_FILE);

      expect(addGradleModule(tree, rootFolder, 'library1', false)).toBe(false);
    });

    it('should add kotlin gradle module when not already present', ()=>{
      tree.write(`./${rootFolder}/build.gradle.kts`, BUILD_GRADLE_KOTLIN_FILE);
      tree.write(`./${rootFolder}/settings.gradle.kts`, MULTI_MODULE_SETTINGS_KTS_FILE);

      expect(hasGradleModule(tree, rootFolder, 'libraryX')).toBe(false);
      expect(addGradleModule(tree, rootFolder, 'libraryX', true)).toBe(true);
      expect(hasGradleModule(tree, rootFolder, 'libraryX')).toBe(true);
    });

    it('should not add kotlin gradle module when already present', ()=>{
      tree.write(`./${rootFolder}/build.gradle.kts`, BUILD_GRADLE_KOTLIN_FILE);
      tree.write(`./${rootFolder}/settings.gradle.kts`, MULTI_MODULE_SETTINGS_KTS_FILE);

      expect(addGradleModule(tree, rootFolder, 'library1', true)).toBe(false);
    });
  });
});

