import { Tree } from '@nrwl/devkit';
import { prompt } from 'enquirer';
import { AndroidLanguageType, IosLanguageType, NormalizedSchema, PlatformType } from '../schema';

type PromptResultType = { platforms: PlatformType[], androidLanguage?: AndroidLanguageType, iosLanguage?: IosLanguageType };

export async function promptAdditionalOptions(tree: Tree, options: NormalizedSchema) {
    if (process.env.NX_INTERACTIVE === 'true') {

        await prompt([{
            skip: ['app', 'plugin'].indexOf(options.template) === -1,
            name: 'platforms',
            type: 'multiselect',
            choices: [
                {
                    name: "android",
                    value: "Android platform",
                },
                {
                    name: "ios",
                    value: "iOS platform",
                },
                {
                    name: "linux",
                    value: "Linux platform",
                },
                {
                    name: "windows",
                    value: "Windows platform",
                },
                {
                    name: "macos",
                    value: "MacOS platform",
                },
                {
                    name: "web",
                    value: "Web platform",
                }
            ],
            validate: (platforms) => {
                return platforms?.length ? true : 'You must select at least one platform'
            },
            message: 'Which platforms would you like to use?'
        }]).then(async (result: Partial<PromptResultType>) => {

            const languages: Partial<PromptResultType> = await prompt([
                {
                    skip: () => result.platforms?.indexOf('android') === -1,
                    name: 'androidLanguage',
                    type: 'select',
                    initial: 1,
                    choices: [
                        {
                            name: "java",
                            value: "Java"
                        },
                        {
                            name: "kotlin",
                            value: "Kotlin"
                        }
                    ],
                    message: "Which Android language would you like to use?",
                },
                {
                    skip: () => result.platforms?.indexOf('ios') === -1,
                    name: 'iosLanguage',
                    type: 'select',
                    initial: 1,
                    choices: [
                        {
                            name: "objc",
                            value: "Objective-C"
                        },
                        {
                            name: "swift",
                            value: "Swift"
                        }
                    ],
                    message: "Which iOS language would you like to use?",
                }
            ]);
            options.platforms = result?.platforms;
            options.androidLanguage = languages?.androidLanguage;
            options.iosLanguage = languages?.iosLanguage;
        });
    }
}
