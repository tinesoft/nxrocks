import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { addMavenPlugin } from '.';
import { stripIndent } from '@nxrocks/common';
import {
  addSpotlessMavenPlugin,
  SPOTLESS_MAVEN_PLUGIN_GROUP_ID,
  SPOTLESS_MAVEN_PLUGIN_ARTIFACT_ID,
  SPOTLESS_MAVEN_PLUGIN_VERSION,
  removeMavenPlugin,
  addMavenProperty,
  addMavenModule,
  hasMavenModuleInTree,
  hasMultiModuleMavenProjectInTree,
} from './maven-utils';


const getPomXmlFile = (
  hasBuildNode = true,
  hasPluginsNode = true,
  hasPropertiesNode = true
) => {
  const pluginsNode = hasPluginsNode
    ? stripIndent`
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
    </plugins>`
    : '';
  const buildNode = hasBuildNode
    ? stripIndent`
    <build>
        ${pluginsNode}
    </build>`
    : '';

  const propertiesNode = hasPropertiesNode
    ? stripIndent`
    <properties>
        <java.version>11</java.version>
    </properties>`
    : '';

  return stripIndent`
    <?xml version="1.0" encoding="UTF-8"?>
    <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
        <modelVersion>4.0.0</modelVersion>
        <parent>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-parent</artifactId>
            <version>2.6.2</version>
            <relativePath/> <!-- lookup parent from repository -->
        </parent>
        <groupId>com.example</groupId>
        <artifactId>demo</artifactId>
        <version>0.0.1-SNAPSHOT</version>
        <name>demo</name>
        <description>Demo project for Spring Boot</description>
        ${propertiesNode}
        <dependencies>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter</artifactId>
            </dependency>

            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-test</artifactId>
                <scope>test</scope>
            </dependency>
        </dependencies>
        ${buildNode}
    </project>`;
};

const MULTI_MODULE_POM_XML = `
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>org.springframework</groupId>
    <artifactId>gs-multi-module</artifactId>
    <version>0.1.0</version>
    <packaging>pom</packaging>

    <modules>
        <module>library</module>
        <module>application</module>
    </modules>

</project>`

describe('maven-utils', () => {
  describe('addMavenProperty', () => {
    let tree: Tree;
    beforeEach(() => {
      tree = createTreeWithEmptyWorkspace();
    });

    it('should not add the property if already exists', () => {
      tree.write(`./pom.xml`, getPomXmlFile());
      const added = addMavenProperty(tree, '.', 'java.version', '11');
      expect(added).toEqual(false);
    });

    it.each`
      hasPropertiesNode
      ${true}
      ${false}
    `(
      'should add the property even when hasPropertiesNode: $hasPropertiesNode',
      ({ hasPropertiesNode }) => {
        tree.write(`./pom.xml`, getPomXmlFile(true, true, hasPropertiesNode));
        const previousProperties = hasPropertiesNode
          ? stripIndent`
            <java.version>11</java.version>
            `
          : '';

        const added = addMavenProperty(
          tree,
          '.',
          'docker.buildArg.ARG_FILE',
          'artifact.jar'
        );
        const pomXml = tree.read(`./pom.xml`, 'utf-8');
        expect(added).toEqual(true);
        expect(pomXml?.replace(/\s+/g, '')).toContain(
          `
            <properties>
                ${previousProperties}
                <docker.buildArg.ARG_FILE>artifact.jar</docker.buildArg.ARG_FILE>
            </properties>
            `.replace(/\s+/g, '')
        );
      }
    );
  });

  describe('addMavenPlugin', () => {
    let tree: Tree;
    beforeEach(() => {
      tree = createTreeWithEmptyWorkspace();
    });

    it('should not add the plugin if already exists', () => {
      tree.write(`./pom.xml`, getPomXmlFile());
      const added = addMavenPlugin(
        tree,
        '.',
        'org.springframework.boot',
        'spring-boot-maven-plugin'
      );
      expect(added).toEqual(false);
    });

    it.each`
      hasBuildNode | hasPluginsNode
      ${true}      | ${true}
      ${true}      | ${false}
      ${false}     | ${true}
      ${false}     | ${false}
    `(
      'should add the plugin even when hasBuildNode: $hasBuildNode and hasPluginsNode: $hasPluginsNode',
      ({ hasBuildNode, hasPluginsNode }) => {
        tree.write(`./pom.xml`, getPomXmlFile(hasBuildNode, hasPluginsNode));
        const previousPlugins =
          hasBuildNode && hasPluginsNode
            ? stripIndent`
            <plugin>
            	<groupId>org.springframework.boot</groupId>
            	<artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>`
            : '';

        const added = addMavenPlugin(
          tree,
          '.',
          SPOTLESS_MAVEN_PLUGIN_GROUP_ID,
          SPOTLESS_MAVEN_PLUGIN_ARTIFACT_ID,
          SPOTLESS_MAVEN_PLUGIN_VERSION
        );
        
        const pomXml = tree.read(`./pom.xml`, 'utf-8');
        expect(added).toEqual(true);
        expect(pomXml?.replace(/\s+/g, '')).toContain(
          `
            <build>
            	<plugins>
            		${previousPlugins}
            		<plugin>
            			<groupId>${SPOTLESS_MAVEN_PLUGIN_GROUP_ID}</groupId>
            			<artifactId>${SPOTLESS_MAVEN_PLUGIN_ARTIFACT_ID}</artifactId>
            			<version>${SPOTLESS_MAVEN_PLUGIN_VERSION}</version>
            		</plugin>
            	</plugins>
            </build>
            `.replace(/\s+/g, '')
        );
      }
    );
  });

  describe('removeMavenPlugin', () => {
    let tree: Tree;
    beforeEach(() => {
      tree = createTreeWithEmptyWorkspace();
    });

    it('should not remove the plugin if does not exist', () => {
      tree.write(`./pom.xml`, getPomXmlFile());
      const removed = removeMavenPlugin(
        tree,
        '.',
        'org.springframework.boot.fake',
        'spring-boot-maven-plugin-fake'
      );
      expect(removed).toEqual(false);
    });

    it(`should remove the plugin node if found along with its ancestors 'plugins' and 'build' node if empty afterwards`, () => {
      tree.write(`./pom.xml`, getPomXmlFile());

      const removed = removeMavenPlugin(
        tree,
        '.',
        'org.springframework.boot',
        'spring-boot-maven-plugin'
      );
      
      const pomXml = tree.read(`./pom.xml`, 'utf-8');
      expect(removed).toEqual(true);
      expect(pomXml?.replace(/\s+/g, '')).not.toContain(
        `
            <build>
            	<plugins>
            		<plugin>
            			<groupId>org.springframework.boot</groupId>
            			<artifactId>spring-boot-maven-plugin</artifactId>
            		</plugin>
            	</plugins>
            </build>
            `.replace(/\s+/g, '')
      );
    });

    it("should remove the plugin node if found along with its ancestors 'plugins' and 'build' node if empty afterwards", () => {
      tree.write(`./pom.xml`, `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>3.2.0</version>
		<relativePath/> <!-- lookup parent from repository -->
	</parent>
	<groupId>com.example</groupId>
	<artifactId>demo</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<name>demo</name>
	<description>Demo project for Spring Boot</description>
	<properties>
		<java.version>17</java.version>
	</properties>
	<dependencies>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter</artifactId>
		</dependency>
		<dependency>
			<groupId>org.apache.groovy</groupId>
			<artifactId>groovy</artifactId>
		</dependency>

		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-test</artifactId>
			<scope>test</scope>
		</dependency>
	</dependencies>

	<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
			</plugin>
			<plugin>
				<groupId>org.codehaus.gmavenplus</groupId>
				<artifactId>gmavenplus-plugin</artifactId>
				<version>1.13.1</version>
				<executions>
					<execution>
						<goals>
							<goal>addSources</goal>
							<goal>addTestSources</goal>
							<goal>generateStubs</goal>
							<goal>compile</goal>
							<goal>generateTestStubs</goal>
							<goal>compileTests</goal>
							<goal>removeStubs</goal>
							<goal>removeTestStubs</goal>
						</goals>
					</execution>
				</executions>
			</plugin>
		</plugins>
	</build>

</project>`);

      const removed = removeMavenPlugin(
        tree,
        '.',
        'org.springframework.boot',
        'spring-boot-maven-plugin'
      );
      
      const pomXml = tree.read(`./pom.xml`, 'utf-8');
      expect(removed).toEqual(true);
      expect(pomXml?.replace(/\s+/g, '')).not.toContain(
        `
            <build>
            	<plugins>
            		<plugin>
            			<groupId>org.springframework.boot</groupId>
            			<artifactId>spring-boot-maven-plugin</artifactId>
            		</plugin>
            	</plugins>
            </build>
            `.replace(/\s+/g, '')
      );
    });
  });

  describe('addSpotlessMavenPlugin', () => {
    let tree: Tree;
    beforeEach(() => {
      tree = createTreeWithEmptyWorkspace();
    });

    it.each`
      language    | jdkVersion   | baseGitBranch | formatter                | expected
      ${'java'}   | ${'11'}      | ${'master'}   | ${'<googleJavaFormat/>'} | ${true}
      ${'java'}   | ${undefined} | ${undefined}  | ${'<googleJavaFormat/>'} | ${true}
      ${'kotlin'} | ${'11'}      | ${'develop'}  | ${'<ktfmt/>'}            | ${true}
      ${'kotlin'} | ${'8'}       | ${'develop'}  | ${'<ktlint/>'}           | ${true}
      ${'kotlin'} | ${undefined} | ${undefined}  | ${'<ktlint/>'}           | ${true}
      ${'groovy'} | ${'11'}      | ${'master'}   | ${'<greclipse/>'}        | ${true}
      ${'groovy'} | ${undefined} | ${undefined}  | ${'<greclipse/>'}        | ${true}
    `(
      `should return $expected when applying spotless gradle plugin to project with language: '$language', jdkVersion: '$jdkVersion', baseGitBranch: '$baseGitBranch'`,
      ({ language, jdkVersion, baseGitBranch, formatter, expected }) => {
        tree.write(`./pom.xml`, getPomXmlFile());
        const added = addSpotlessMavenPlugin(
          tree,
          '.',
          language,
          jdkVersion,
          baseGitBranch
        );
        const pomXml = tree.read(`./pom.xml`, 'utf-8');
        expect(added).toBe(expected);
        expect(pomXml).toContain(formatter);

        if (baseGitBranch) {
          expect(pomXml).toContain(
            `<ratchetFrom>${baseGitBranch}</ratchetFrom>`
          );
        } else {
          expect(pomXml).not.toContain(
            `<ratchetFrom>${baseGitBranch}</ratchetFrom>`
          );
        }
      }
    );
  });

  describe('isMultiModuleMavenProject', ()=>{
    let tree: Tree;
    const rootFolder = 'mvnapp';
    beforeEach(async () => {
      tree = createTreeWithEmptyWorkspace();
    });

    it('should return true on a multi-module maven project', ()=>{
      tree.write(`./${rootFolder}/pom.xml`, MULTI_MODULE_POM_XML)
      expect(hasMultiModuleMavenProjectInTree(tree,rootFolder)).toBe(true);
    });

    it('should return false on non multi-module maven project', ()=>{
      tree.write(`./${rootFolder}/pom.xml`, getPomXmlFile())
      expect(hasMultiModuleMavenProjectInTree(tree, rootFolder)).toBe(false);
    });


    it('should return false if no pom.xml is found', ()=>{
      expect(hasMultiModuleMavenProjectInTree(tree, rootFolder)).toBe(false);
    });

    it('should found the maven module if present', ()=>{
      tree.write(`./${rootFolder}/pom.xml`, MULTI_MODULE_POM_XML)
      expect(hasMavenModuleInTree(tree, rootFolder, 'library')).toBe(true);
      expect(hasMavenModuleInTree(tree, rootFolder, 'libraryx')).toBe(false);
    });
  });

  describe('addMavenModule', ()=>{
    let tree: Tree;
    const rootFolder = 'mvnapp';
    beforeEach(async () => {
      tree = createTreeWithEmptyWorkspace();
    });

    it('should add maven module when not already present', ()=>{
      tree.write(`./${rootFolder}/pom.xml`, MULTI_MODULE_POM_XML);

      expect(hasMavenModuleInTree(tree, rootFolder, 'libraryX')).toBe(false);
      expect(addMavenModule(tree, rootFolder, 'libraryX')).toBe(true);
      expect(hasMavenModuleInTree(tree, rootFolder, 'libraryX')).toBe(true);
    });

    it('should not add maven module when already present', ()=>{
      tree.write(`./${rootFolder}/pom.xml`, MULTI_MODULE_POM_XML);

      expect(addMavenModule(tree, rootFolder, 'library')).toBe(false);
    });
  });
});
