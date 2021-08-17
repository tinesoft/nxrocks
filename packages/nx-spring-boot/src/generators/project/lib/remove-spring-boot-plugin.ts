import {
    logger,
    Tree
} from '@nrwl/devkit';
import { NormalizedSchema } from '../schema';

export function removeBootMavenPlugin(tree: Tree, options: NormalizedSchema) {
    if (options.projectType === 'library' && options.buildSystem === 'maven-project') {
        logger.debug(`Removing 'spring-boot' maven plugin on a library project...`);

        const mvnPlugin = `
<build>
    <plugins>
        <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
    </plugins>
</build>
`;
        const pomXmlPath = `${options.projectRoot}/pom.xml`;
        let content = tree.read(pomXmlPath).toString();

        content = content.replace(mvnPlugin, '');
        tree.write(pomXmlPath, content);
    }
}
