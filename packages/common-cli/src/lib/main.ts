import {
  intro,
  text,
  confirm,
  spinner,
  note,
  outro,
  select,
} from '@clack/prompts';
import { createWorkspace } from 'create-nx-workspace';
import * as yargs from 'yargs';
import * as terminalLink from 'terminal-link';

import { CLIArguments } from './models';
import {
  createNxWorkspaceVersion,
  createWorkspaceWithNxWrapper,
  getNxCommand,
} from './utils';
import { NxCloud } from 'create-nx-workspace/src/utils/nx/nx-cloud';
import { unparse } from 'create-nx-workspace/src/utils/unparse';

export async function mainCLI(pkgName: string, stackName: string) {
  const pkgFolderName = pkgName.replace('@nxrocks/', '');
  const createPkgName = `create-${pkgFolderName}`;

  intro(createPkgName);

  const options = (
    yargs
      .parserConfiguration({
        'strip-dashed': true,
        'dot-notation': true,
      })
      .command(
        '$0 [name] [options]',
        `Create a new Nx workspace with ${stackName} support`,
        (yargs) =>
          yargs
            .option('name', {
              describe: 'Workspace Location (e.g. org name)',
              type: 'string',
            })
            .option('useNxWrapper', {
              describe: 'Let Nx manages its own installation and updates',
              type: 'boolean',
            })
            .option('nxCloud', {
              describe: 'Do you want Nx Cloud to make your CI fast?',
              choices: ['yes', 'github', 'circleci', 'skip'] as const,
            })
            .option('useGitHub', {
              describe:
                'Will you be using GitHub as your git hosting provider?',
              boolean: true,
            })
            .option('presetVersion', {
              describe: `Version of the ${pkgFolderName} package to be used. Latest by default.`,
              type: 'string',
              default: 'latest',
            })
            .option('verbose', {
              describe: 'Enable more logging information',
              type: 'boolean',
              default: process.env['NX_VERBOSE_LOGGING'] === 'true',
            })
      )
      .help('help', 'Show help') as yargs.Argv<CLIArguments>
  ).parseSync();
  /*eslint prefer-const: ["error", {"destructuring": "all"}]*/
  let {
    _,
    $0,
    name,
    useNxWrapper,
    nxCloud,
    useGitHub,
    presetVersion,
    verbose,
    ...restArgs
  } = options;

  name ||= (await text({
    message: 'Where would you like to create your workspace?',
    initialValue: 'myorg',
    validate: (value) =>
      value?.length === 0 ? 'You need to provide one' : void 0,
  })) as string;

  useNxWrapper ??= (await confirm({
    message: `Would you like to use Nx Wrapper? [ ${linkify(
      'Nx Wrapper',
      'https://nx.dev/concepts/more-concepts/nx-and-the-wrapper#and-the-nx-wrapper'
    )} ]`,
    initialValue: true,
  })) as boolean;

  nxCloud ??= (await select({
    message: `Would you like Nx Cloud to make your CI faster? [ ${linkify(
      'Nx Cloud',
      'https://nx.app/?utm_source=' + createPkgName
    )} ]`,
    options: [
      { value: 'github', label: 'GitHub Actions' },
      { value: 'gitlab', label: 'Gitlab' },
      { value: 'azure', label: 'Azure DevOps' },
      { value: 'bitbucket-pipelines', label: 'BitBucket Pipelines' },
      { value: 'circleci', label: 'Circle CI' },
      { value: 'skip', label: '\nDo it later' },
    ],
    initialValue: 'skip' as NxCloud,
  })) as NxCloud;

  useGitHub ??=
    nxCloud === 'yes' ||
    nxCloud === 'github' ||
    ((await confirm({
      message: `Will you be using GitHub as your git hosting provider?`,
      initialValue: false,
    })) as boolean);

  presetVersion ??= 'latest';

  let directory: string;

  const notes = [
    `- Go to [ ${linkify(
      pkgName,
      'https://github.com/tinesoft/nxrocks/tree/develop/packages/' +
        pkgFolderName
    )} ] to get started with Nx and ${stackName} plugin.`,
    `- Run   [ ${getNxCommand(
      useNxWrapper
    )} g ${pkgName}:project ] to add more projects.`,
  ];

  if (useNxWrapper) {
    notes.push(
      `- Go to [ ${linkify(
        'Nx Wrapper',
        'https://nx.dev/concepts/more-concepts/nx-and-the-wrapper#and-the-nx-wrapper'
      )} ] to get started with Nx Wrapper.`
    );

    const allArgs = unparse(restArgs).join(' ');

    const s = spinner();
    s.start('Initializing your workspace');

    directory = createWorkspaceWithNxWrapper(
      name,
      pkgName,
      allArgs,
      nxCloud,
      useGitHub,
      presetVersion,
      createNxWorkspaceVersion,
      !verbose
    );

    s.stop(`Successfully created the workspace: ${name}`);
  } else {
    directory = (
      await createWorkspace(`${pkgName}@${presetVersion}`, {
        ...restArgs,
        name,
        nxCloud,
        useGitHub,
        packageManager: 'npm',
        verbose,
      })
    )?.directory;
  }

  notes.push(
    `- Go to [ ${linkify('Nx.dev', 'https://nx.dev')} ] to get started with Nx.`
  );

  note(notes.join('\n'), 'Next steps');

  outro(`Your workspace in ${directory} is all set 🎉. Let's goooooo! 🚀`);
}

function linkify(
  text: string,
  url: string,
  fallback = (text: string, url: string) => url
) {
  return terminalLink(text, url, { fallback });
}
