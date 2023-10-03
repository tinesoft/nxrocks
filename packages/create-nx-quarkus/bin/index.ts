#!/usr/bin/env node

import { intro, text, confirm, spinner, note, outro } from '@clack/prompts';
import { CreateWorkspaceOptions, createWorkspace } from 'create-nx-workspace';
import * as yargs from 'yargs';
import { createWorkspaceWithNxWrapper, getNxCommand } from '@nxrocks/common';

interface CLIArguments extends CreateWorkspaceOptions {
  name: string;
  useNxWrapper: boolean;
  useNxCloud: boolean;
  interactive: boolean,
  verbose: boolean
}

async function main() {

  intro('create-nx-quarkus');

  const options = (yargs
    .parserConfiguration({
      'strip-dashed': true,
    })
    .command(
      '$0 [name]',
      'Create a new Nx workspace with Quarkus support',
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
            default: process.env.NX_VERBOSE_LOGGING === 'true',
          })
    )
    .help('help', 'Show help') as yargs.Argv<CLIArguments>).parseSync();

  let { name, useNxWrapper, useNxCloud } = options;
  const { _, $0, name: ignoredName, verbose, ...restArgs } = options;


  name ||= await text({
    message: 'What is the name of your workspace (e.g. org name)?',
    initialValue: 'myorg',
    validate(value) {
      if (value?.length === 0) return 'You need to provide one';
    }
  }) as string;

  useNxWrapper ??= await confirm({
    message: 'Would you like to use Nx Wrapper? [ https://nx.dev/concepts/more-concepts/nx-and-the-wrapper#and-the-nx-wrapper ]',
    initialValue: true
  }) as boolean;

  useNxCloud ??= await confirm({
    message: 'Would you like to use Nx Cloud? [ https://nx.app/?utm_source=create-nx-quarkus ]',
    initialValue: false
  }) as boolean;

  const presetVersion = 'latest';

  let directory: string;

  const notes = [
    '- Go to [ https://github.com/tinesoft/nxrocks/tree/develop/packages/nx-quarkus ] to get started with Nx and Quarkus plugin.',
    `- Run '${getNxCommand(useNxWrapper)} g @nxrocks/nx-quarkus:project' to later add additional projects into this workspace.`
  ];

  if (useNxWrapper) {
    notes.push('- Go to [ https://nx.dev/concepts/more-concepts/nx-and-the-wrapper#and-the-nx-wrapper ] to get started with Nx Wrapper.');

    const allArgs = Object.entries(restArgs).map(([key, value]) => `--${key}=${value}`).join(' ');

    const s = spinner();
    s.start('Initializing your workspace');

    directory = createWorkspaceWithNxWrapper(name, '@nxrocks/nx-quarkus', allArgs, useNxCloud, presetVersion, !verbose);

    s.stop(`Successfully created the workspace: ${name}`);
  }
  else {
    directory = (await createWorkspace(
      `@nxrocks/nx-quarkus@${presetVersion}`,
      {
        name: name,
        nxCloud: useNxCloud,
        packageManager: 'npm',
        ...restArgs
      }
    ))?.directory;
  }

  notes.push('- Go to [ https://nx.dev ] to get started with Nx.');

  note(notes.join('\n'), "Next steps");

  outro(`Your workspace in ${directory} is all set 🎉. Let's goooooo! 🚀`);
}

main();
