import {
    Rule
} from '@angular-devkit/schematics';
import * as inquirer from 'inquirer';
import { AndroidLanguageType, IosLanguageType, NormalizedSchema, PlatformType } from '../schema';

type PromptResultType = { platforms: PlatformType[], androidLanguage?: AndroidLanguageType, iosLanguage?: IosLanguageType };

function createPrompt(options: NormalizedSchema): Promise<PromptResultType> {
    return inquirer.prompt([{
        when: ['app', 'plugin'].indexOf(options.template) !== -1,
        name: 'platforms',
        type: 'checkbox',
        choices: [
            {
                value: "android",
                name: "Android platform",
                checked: true,
            },
            {
                value: "ios",
                name: "iOS platform",
                checked: true,
            },
            {
                value: "linux",
                name: "Linux platform",
                checked: true,
            },
            {
                value: "windows",
                name: "Windows platform",
                checked: true,
            },
            {
                value: "macos",
                name: "MacOS platform",
                checked: true,
            },
            {
                value: "web",
                name: "Web platform",
                checked: true,
            }
        ],
        validate: (platforms) => {
            return platforms?.length ? true : 'You must select at least one platform'
        },
        message: 'Which platforms would you like to use?'
    },
    {
        when: (response: PromptResultType) => response.platforms?.indexOf('android') !== -1,
        name: 'androidLanguage',
        type: 'list',
        default: 'kotlin',
        choices: [
            {
                value: "java",
                name: "Java"
            },
            {
                value: "kotlin",
                name: "Kotlin"
            }
        ],
        message: "Which Android language would you like to use?",
    },
    {
        when: (response: PromptResultType) => response.platforms?.indexOf('ios') !== -1,
        name: 'iosLanguage',
        type: 'list',
        default: 'swift',
        choices: [
            {
                value: "objc",
                name: "Objective-C"
            },
            {
                value: "swift",
                name: "Swift"
            }
        ],
        message: "Which iOS language would you like to use?",
    }
    ]
    );
}

export function promptAdditionalOptions(options: NormalizedSchema): Rule {

    return async () => {
        const answers = await createPrompt(options);
        options.platforms = answers?.platforms;
        options.androidLanguage = answers?.androidLanguage;
        options.iosLanguage = answers?.iosLanguage;
        return;
    };
}
