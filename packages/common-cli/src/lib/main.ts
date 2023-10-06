import { intro, text, confirm, spinner, note, outro } from '@clack/prompts';
import { createWorkspace } from 'create-nx-workspace';
import * as yargs from 'yargs';
import * as terminalLink from 'terminal-link';

import { CLIArguments } from './models';
import { createWorkspaceWithNxWrapper, getNxCommand } from './utils';

export async function mainCLI(pkgName: string, stackName: string) {

  const pkgFolderName = pkgName.replace('@nxrocks/', '')
  const createPkgName = `create-${pkgFolderName}`;

  intro(createPkgName);

  const options = (yargs
    .parserConfiguration({
      'strip-dashed': true,
    })
    .command(
      '$0 [name]',
      `Create a new Nx workspace with ${stackName} support`,
      (yargs) => yargs.option('name',
        {
          describe: 'Workspace name (e.g. org name)',
          type: 'string',
        }).
        option('useNxWrapper',
          {
            describe: 'Let Nx manages its own installation and updates',
            type: 'boolean',
          }).
        option('useNxCloud',
          {
            describe: "Enable distributed caching to make your CI faster",
            type: 'boolean',
          }).
        option('verbose',
          {
            describe: "Enable more logging information",
            type: 'boolean',
            default: process.env['NX_VERBOSE_LOGGING'] === 'true',
          })
    )
    .help('help', 'Show help') as yargs.Argv<CLIArguments>).parseSync();

  let { name, useNxWrapper, useNxCloud } = options;
  const { _, $0, name: ignoredName, verbose, ...restArgs } = options;

  name ||= await text({
    message: 'What is the name of your workspace (e.g. org name)?',
    initialValue: 'myorg',
    validate: (value) => (value?.length === 0) ? 'You need to provide one' : void 0,
  }) as string;

  useNxWrapper ??= await confirm({
    message: `Would you like to use Nx Wrapper? [ ${linkify('Nx Wrapper', 'https://nx.dev/concepts/more-concepts/nx-and-the-wrapper#and-the-nx-wrapper')} ]`,
    initialValue: true
  }) as boolean;

  useNxCloud ??= await confirm({
    message: `Would you like to use Nx Cloud? [ ${linkify('Nx Cloud', 'https://nx.app/?utm_source=' + createPkgName)} ]`,
    initialValue: false
  }) as boolean;

  const presetVersion = 'latest';

  let directory: string;

  const notes = [
    `- Go to [ ${linkify(pkgName, 'https://github.com/tinesoft/nxrocks/tree/develop/packages/' + pkgFolderName)} ] to get started with Nx and ${stackName} plugin.`,
    `- Run   [ ${getNxCommand(useNxWrapper)} g ${pkgName}:project ] to add more projects.`
  ];

  if (useNxWrapper) {
    notes.push(`- Go to [ ${linkify('Nx Wrapper', 'https://nx.dev/concepts/more-concepts/nx-and-the-wrapper#and-the-nx-wrapper')} ] to get started with Nx Wrapper.`);

    const allArgs = Object.entries(restArgs).map(([key, value]) => `--${key}=${value}`).join(' ');

    const s = spinner();
    s.start('Initializing your workspace');

    directory = createWorkspaceWithNxWrapper(name, pkgName, allArgs, useNxCloud, presetVersion, !verbose);

    s.stop(`Successfully created the workspace: ${name}`);
  }
  else {
    directory = (await createWorkspace(
      `${pkgName}@${presetVersion}`,
      {
        ...restArgs,
        name: name,
        nxCloud: useNxCloud,
        packageManager: 'npm'
      }
    ))?.directory;
  }

  notes.push(`- Go to [ ${linkify('Nx.dev', 'https://nx.dev')} ] to get started with Nx.`);

  note(notes.join('\n'), "Next steps");

  outro(`Your workspace in ${directory} is all set 🎉. Let's goooooo! 🚀`);
}

function linkify(text: string, url: string, fallback = (text: string, url: string) => url) {
  return terminalLink(text, url, { fallback });
}