import { Tree, SchematicContext} from '@angular-devkit/schematics';
import { execSync } from 'child_process'
import { NormalizedSchema } from '../schematics/application/schema';

export function isFlutterInstalled(): boolean {
    try {
        execSync('flutter --version', {  stdio: [0, 1, 2] });
        return true;
    } catch (e) {
        return false;
    } 
}

export function quote(text: string){
    if(!text || (text.startsWith('"') && text.endsWith('"'))){
        return text;
    } else {
        return `"${text.replace('"','\\"')}"`;
    }
}

export function  buildFlutterCreateOptions(options: NormalizedSchema) {
    const keyValueParams = [
        {key: 'project-name', value: options.projectName.replace(new RegExp('-', 'g'), '_')},
        {key: 'org', value: options.org},
        {key: 'description', value: quote(options.description)},
        {key: 'android-language', value: options.androidLanguage},
        {key: 'ios-language', value: options.iosLanguage},
        {key: 'template', value: options.template},
        {key: 'sample', value: options.sample},
        {key: 'platforms', value: options.platforms? quote(options.platforms.join(',')):null}
    ].filter(e => !!e.value);

    let opts = keyValueParams.map(e => `--${e.key}=${e.value}`).join(' ');

    const boolParams = [
        {key: 'pub', value: options.pub},
        {key: 'offline', value: options.offline},
        
    ].filter(e => !!e.value);

    opts += ' ' + boolParams.map(e => {
        if(e.value === true)
            return `--${e.key}`;
        else if(e.value === false)
            return `--no-${e.key}`;
        return '';
    }).join(' ');

    return opts;

}

export async function generateFlutterProject(options: NormalizedSchema, tree: Tree, context: SchematicContext): Promise<void> {
    const opts = this.buildFlutterCreateOptions(options);
    
    context.logger.info(`Generating Flutter project with following options : ${opts}...`);

    // Create the command to execute
    const execute = `flutter create ${opts} ${options.projectRoot}`;
    try {
        context.logger.info(`Executing command: ${execute}`);
        execSync(execute, {  stdio: [0, 1, 2] });
        return ;
    } catch (e) {
        context.logger.error(`Failed to execute command: ${execute}`, e);
        return ;
    } 
}

