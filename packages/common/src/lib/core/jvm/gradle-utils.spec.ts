
import { Tree } from '@nrwl/devkit';
import { getGradlePlugins, hasGradlePlugin, addGradlePlugin, applySpotlessGradlePlugin, addSpotlessGradlePlugin } from './gradle-utils';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { stripIndent } from '../utils';
import { SPOTLESS_GRADLE_PLUGIN_ID } from '.';

const BUILD_GRADLE_FILE =
`plugins {
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

const BUILD_GRADLE_KOTLIN_FILE =
    `import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

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
                        java: false
                    },
                    {
                        id: 'io.spring.dependency-management',
                        version: '1.0.11.RELEASE',
                        kotlin: false,
                        java: false
                    },
                    {
                        id: 'groovy',
                        kotlin: false,
                        java: false
                    }
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
                        java: false
                    },
                    {
                        id: 'io.spring.dependency-management',
                        version: '1.0.11.RELEASE',
                        kotlin: false,
                        java: false
                    },
                    {
                        id: 'jvm',
                        version: '1.6.10',
                        kotlin: true,
                        java: false
                    },
                    {
                        id: 'plugin.spring',
                        version: '1.6.10',
                        kotlin: true,
                        java: false
                    }
                ])
            );

        });
    });

    describe('hasGradlePlugin', () => {
        it.each`
            pluginId                                | pluginVersion         | buildGradle                   | kotlin    | expected
            ${'org.springframework.boot'}           | ${'2.6.2'}            | ${BUILD_GRADLE_FILE}          | ${false}  | ${true}
            ${'io.spring.dependency-management'}    | ${'1.0.11.RELEASE'}   | ${BUILD_GRADLE_FILE}          | ${false}  | ${true}
            ${'groovy'}                             | ${undefined}          | ${BUILD_GRADLE_FILE}          | ${false}  | ${true}
            ${'groovy'}                             | ${'x.y.z'}            | ${BUILD_GRADLE_FILE}          | ${false}  | ${false}
            ${'org.springframework.boot'}           | ${'2.6.2'}            | ${BUILD_GRADLE_KOTLIN_FILE}   | ${true}   | ${true}
            ${'io.spring.dependency-management'}    | ${'1.0.11.RELEASE'}   | ${BUILD_GRADLE_KOTLIN_FILE}   | ${true}   | ${true}
            ${'jvm'}                                | ${'1.6.10'}           | ${BUILD_GRADLE_KOTLIN_FILE}   | ${true}   | ${true}
            ${'jvm'}                                | ${'x.y.z'}            | ${BUILD_GRADLE_KOTLIN_FILE}   | ${true}   | ${false}
        `(`should return $expected when searching plugin '$pluginId' with version: '$pluginVersion' in build.gradle (kotlin: $kotlin) file`,
            ({ pluginId, pluginVersion, buildGradle, expected }) => {
                expect(hasGradlePlugin(buildGradle, pluginId, pluginVersion)).toBe(expected);
            }
        );

    });

    describe('addGradlePlugin', () => {
        let tree: Tree;
        beforeEach(() => {
            tree = createTreeWithEmptyWorkspace();
        });
        
        it('should add plugin to build.gradle file with no prexisting plugins section', () => {
            tree.write('./build.gradle', '');
            const added = addGradlePlugin(tree, '.', 'java', 'org.springframework.boot', '2.6.2');
            expect(added).toBe(true);

            const buildGradle = tree.read('./build.gradle', 'utf-8');
            console.log(buildGradle);
            expect(buildGradle).toContain(
            stripIndent`
            plugins {
            	id 'org.springframework.boot' version '2.6.2'
            }
            `);
        });

        it('should append gradle plugin to build.gradle file with existing plugins section', () => {
            tree.write('./build.gradle',
            stripIndent`
            plugins {
            	id 'org.springframework.boot' version '2.6.2'
            }
            `);
            const added = addGradlePlugin(tree, '.','java', 'com.diffplug.spotless', '6.1.2');
            expect(added).toBe(true);

            const buildGradle = tree.read('./build.gradle', 'utf-8');
            expect(buildGradle).toEqual(
            stripIndent`
            plugins {
            	id 'org.springframework.boot' version '2.6.2'
            	id 'com.diffplug.spotless' version '6.1.2'
            }
            `);
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
            `);
        });

    });

   describe('applySpotlessGradlePlugin', () => {
        let tree: Tree;
        beforeEach(() => {
            tree = createTreeWithEmptyWorkspace();
        });

        it.each`
            language    | jdkVersion    | baseGitBranch | formatter                 | expected
            ${'java'}   | ${'11'}       | ${'master'}   | ${'googleJavaFormat()'}   | ${true}
            ${'java'}   | ${undefined}  | ${undefined}  | ${'googleJavaFormat()'}   | ${true}
            ${'kotlin'} | ${'11'}       | ${'develop'}  | ${'ktfmt()'}              | ${true}
            ${'kotlin'} | ${'8'}        | ${'develop'}  | ${'ktlint()'}             | ${true}
            ${'kotlin'} | ${undefined}  | ${undefined}  | ${'ktlint()'}             | ${true}
            ${'groovy'} | ${'11'}       | ${'master'}   | ${'greclipse()'}          | ${true}
            ${'groovy'} | ${undefined}  | ${undefined}  | ${'greclipse()'}          | ${true}
        `(`should return $expected when applying spotless gradle plugin to project with language: '$language', jdkVersion: '$jdkVersion', baseGitBranch: '$baseGitBranch'`,
            ({ language, jdkVersion, baseGitBranch, formatter, expected }) => {
                const withKotlinDSL = language === 'kotlin';
                const ext = withKotlinDSL ? '.gradle.kts' : '.gradle';
                tree.write(`./build${ext}`, '');
                const applied = applySpotlessGradlePlugin(tree, '.', language, jdkVersion, baseGitBranch);
                const buildGradle = tree.read(`./build${ext}`, 'utf-8');
                expect(applied).toBe(expected);
                expect(buildGradle).toContain(formatter);

                const ratchetFrom = withKotlinDSL ? `ratchetFrom("${baseGitBranch}")` : `ratchetFrom '${baseGitBranch}'`;
                if(baseGitBranch) {
                    expect(buildGradle).toContain(ratchetFrom);
                }   else {
                    expect(buildGradle).not.toContain(ratchetFrom);
                }
                
            }
        );

    });

    describe('addSpotlessGradlePlugin', () => {
        let tree: Tree;
        beforeEach(() => {
            tree = createTreeWithEmptyWorkspace();
        });

        it.each`
            language    | jdkVersion    | baseGitBranch | pluginId                                  | expected
            ${'java'}   | ${'11'}       | ${'master'}   | ${`id '${SPOTLESS_GRADLE_PLUGIN_ID}'`}    | ${true}
            ${'java'}   | ${undefined}  | ${undefined}  | ${`id '${SPOTLESS_GRADLE_PLUGIN_ID}'`}    | ${true}
            ${'kotlin'} | ${'11'}       | ${'develop'}  | ${`id("${SPOTLESS_GRADLE_PLUGIN_ID}")`}   | ${true}
            ${'kotlin'} | ${'8'}        | ${'develop'}  | ${`id("${SPOTLESS_GRADLE_PLUGIN_ID}")`}   | ${true}
            ${'kotlin'} | ${undefined}  | ${undefined}  | ${`id("${SPOTLESS_GRADLE_PLUGIN_ID}")`}   | ${true}
            ${'groovy'} | ${'11'}       | ${'master'}   | ${`id '${SPOTLESS_GRADLE_PLUGIN_ID}'`}    | ${true}
            ${'groovy'} | ${undefined}  | ${undefined}  | ${`id '${SPOTLESS_GRADLE_PLUGIN_ID}'`}    | ${true}
        `(`should return $expected when applying spotless gradle plugin to project with language: '$language', jdkVersion: '$jdkVersion', baseGitBranch: '$baseGitBranch'`,
            ({ language, jdkVersion, baseGitBranch, pluginId, expected }) => {
                const withKotlinDSL = language === 'kotlin';
                const ext = withKotlinDSL ? '.gradle.kts' : '.gradle';
                tree.write(`./build${ext}`, '');
                const added = addSpotlessGradlePlugin(tree, '.', language, jdkVersion, baseGitBranch);
                const buildGradle = tree.read(`./build${ext}`, 'utf-8');
                expect(added).toBe(expected);
                expect(buildGradle).toContain(pluginId);
            }
        );

    });
});