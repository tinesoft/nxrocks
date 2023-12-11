import { Tree, generateFiles, joinPathFragments, logger } from "@nx/devkit";
import { NormalizedSchema } from "../schema";


export function createLibraryFiles(tree: Tree, options: NormalizedSchema) {
    if (options.projectType === 'library') {
        logger.debug(
            `Generating sample files for library project...`
          );
        const substitutions = {
            language: options.language,
            projectName: options.projectName,
            packageName: options.packageName,
            ext: options.language === 'kotlin' ? 'kt' : options.language === 'groovy' ? 'groovy' : 'java',
            lineEnding: options.language === 'java' ? ';': '',
            dot: '.',
            tpl: ''
        };

        const basePath = options.packageName?.replaceAll('.', '/');
        const mainPath = `${options.projectRoot}/src/main/${options.language}/${basePath}`;
        const testPath = `${options.projectRoot}/src/test/${options.language}/${basePath}`;


        generateFiles(tree, joinPathFragments(__dirname, '../files/library/main'), mainPath, substitutions);
        generateFiles(tree, joinPathFragments(__dirname, '../files/library/test'), testPath, substitutions)
    }
}