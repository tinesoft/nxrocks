import {
  CreateNodes,
  CreateNodesContext,
  CreateNodesResult,
  CreateNodesV2,
  createNodesFromFiles,
  detectPackageManager,
  getPackageManagerCommand,
  logger,
  NxJsonConfiguration,
  readJsonFile,
  TargetConfiguration,
  writeJsonFile,
} from '@nx/devkit';
import { calculateHashForCreateNodes } from '@nx/devkit/src/utils/calculate-hash-for-create-nodes';
import { getNamedInputs } from '@nx/devkit/src/utils/get-named-inputs';
import { getLockFileName } from '@nx/js';
import { existsSync, readdirSync } from 'fs';
import { hashObject } from 'nx/src/devkit-internals';
import { workspaceDataDirectory } from 'nx/src/utils/cache-directory';
import { dirname, join } from 'path';

export interface IonicPluginOptions {
  buildTargetName?: string;
  serveTargetName?: string;
  generateTargetName?: string;
  capAddTargetName?: string;
  capBuildTargetName?: string;
  capCopyTargetName?: string;
  capOpenTargetName?: string;
  capRunTargetName?: string;
  capSyncTargetName?: string;
  capUpdateTargetName?: string;
  cdvBuildTargetName?: string;
  cdvCompileTargetName?: string;
  cdvEmulateTargetName?: string;
  cdvPlatformTargetName?: string;
  cdvPluginTargetName?: string;
  cdvPrepareTargetName?: string;
  cdvRequirementsTargetName?: string;
  cdvResourcesTargetName?: string;
  cdvRunTargetName?: string;
  repairTargetName?: string;
}

function readTargetsCache(
  cachePath: string
): Record<string, Record<string, TargetConfiguration<IonicPluginOptions>>> {
  return existsSync(cachePath) ? readJsonFile(cachePath) : {};
}

function writeTargetsToCache(
  cachePath: string,
  targetsCache: Record<
    string,
    Record<string, TargetConfiguration<IonicPluginOptions>>
  >
) {
  const oldCache = readTargetsCache(cachePath);
  writeJsonFile(cachePath, {
    ...oldCache,
    targetsCache,
  });
}

const ionicConfigGlob = '**/ionic.config.json';

function buildIonicTargets(
  projectRoot: string,
  options: IonicPluginOptions,
  context: CreateNodesContext
): Record<string, TargetConfiguration> {
  const namedInputs = getNamedInputs(projectRoot, context);
  const pmc = getPackageManagerCommand();
  const ionicCmd = `${pmc.exec} ionic`;

  const targets: Record<string, TargetConfiguration> = {
    [options.buildTargetName]: {
      executor: 'nx:run-commands',
      options: { command: `${ionicCmd} build`, cwd: projectRoot },
      outputs: [getOutputs(projectRoot, 'www')],
      cache: true,
      dependsOn: [`^${options.buildTargetName}`],
      inputs: getInputs(namedInputs),
      metadata: {
        technologies: ['ionic'],
        description: 'Build the Ionic app',
        help: {
          command: `${ionicCmd} build --help`,
          example: {
            options: {
              prod: true,
            },
          },
        },
      },
    },
    [options.serveTargetName]: {
      executor: 'nx:run-commands',
      options: { command: `${ionicCmd} serve`, cwd: projectRoot },
      continuous: true,
      metadata: {
        technologies: ['ionic'],
        description: 'Serve the Ionic app in development',
        help: {
          command: `${ionicCmd} serve --help`,
          example: {
            options: {
              port: 4200,
            },
          },
        },
      },
    },
    [options.generateTargetName]: {
      executor: 'nx:run-commands',
      options: { command: `${ionicCmd} generate`, cwd: projectRoot },
      metadata: {
        technologies: ['ionic'],
        description: 'Generate Ionic components/pages/services',
        help: {
          command: `${ionicCmd} generate --help`,
          example: {
            options: {},
          },
        },
      },
    },
    [options.capAddTargetName]: {
      executor: 'nx:run-commands',
      options: { command: `${ionicCmd} capacitor add`, cwd: projectRoot },
      metadata: {
        technologies: ['ionic', 'capacitor'],
        description: 'Add a native platform with Capacitor',
        help: {
          command: `${ionicCmd} capacitor add --help`,
          example: {
            options: {},
          },
        },
      },
    },
    [options.capBuildTargetName]: {
      executor: 'nx:run-commands',
      options: { command: `${ionicCmd} capacitor build`, cwd: projectRoot },
      cache: true,
      dependsOn: [`^${options.capBuildTargetName}`],
      inputs: getInputs(namedInputs),
      metadata: {
        technologies: ['ionic', 'capacitor'],
        description: 'Build the native app with Capacitor',
        help: {
          command: `${ionicCmd} capacitor build --help`,
          example: {
            options: {},
          },
        },
      },
    },
    [options.capCopyTargetName]: {
      executor: 'nx:run-commands',
      options: { command: `${ionicCmd} capacitor copy`, cwd: projectRoot },
      metadata: {
        technologies: ['ionic', 'capacitor'],
        description: 'Copy web assets to native platform',
        help: {
          command: `${ionicCmd} capacitor copy --help`,
          example: {
            options: {},
          },
        },
      },
    },
    [options.capOpenTargetName]: {
      executor: 'nx:run-commands',
      options: { command: `${ionicCmd} capacitor open`, cwd: projectRoot },
      metadata: {
        technologies: ['ionic', 'capacitor'],
        description: 'Open the native IDE',
        help: {
          command: `${ionicCmd} capacitor open --help`,
          example: {
            options: {},
          },
        },
      },
    },
    [options.capRunTargetName]: {
      executor: 'nx:run-commands',
      options: { command: `${ionicCmd} capacitor run`, cwd: projectRoot },
      continuous: true,
      metadata: {
        technologies: ['ionic', 'capacitor'],
        description: 'Run the native app on device/emulator',
        help: {
          command: `${ionicCmd} capacitor run --help`,
          example: {
            options: {},
          },
        },
      },
    },
    [options.capSyncTargetName]: {
      executor: 'nx:run-commands',
      options: { command: `${ionicCmd} capacitor sync`, cwd: projectRoot },
      metadata: {
        technologies: ['ionic', 'capacitor'],
        description: 'Sync web assets and native plugins',
        help: {
          command: `${ionicCmd} capacitor sync --help`,
          example: {
            options: {},
          },
        },
      },
    },
    [options.capUpdateTargetName]: {
      executor: 'nx:run-commands',
      options: { command: `${ionicCmd} capacitor update`, cwd: projectRoot },
      metadata: {
        technologies: ['ionic', 'capacitor'],
        description: 'Update Capacitor dependencies',
        help: {
          command: `${ionicCmd} capacitor update --help`,
          example: {
            options: {},
          },
        },
      },
    },
    [options.cdvBuildTargetName]: {
      executor: 'nx:run-commands',
      options: { command: `${ionicCmd} cordova build`, cwd: projectRoot },
      cache: true,
      dependsOn: [`^${options.cdvBuildTargetName}`],
      inputs: getInputs(namedInputs),
      metadata: {
        technologies: ['ionic', 'cordova'],
        description:
          'Use Cordova to build for Android and iOS platform targets',
        help: {
          command: `${ionicCmd} cordova build --help`,
          example: {
            options: {},
          },
        },
      },
    },
    [options.cdvCompileTargetName]: {
      executor: 'nx:run-commands',
      options: { command: `${ionicCmd} cordova compile`, cwd: projectRoot },
      metadata: {
        technologies: ['ionic', 'cordova'],
        description: 'Compile native platform code',
        help: {
          command: `${ionicCmd} cordova compile --help`,
          example: {
            options: {},
          },
        },
      },
    },
    [options.cdvEmulateTargetName]: {
      executor: 'nx:run-commands',
      options: { command: `${ionicCmd} cordova emulate`, cwd: projectRoot },
      continuous: true,
      metadata: {
        technologies: ['ionic', 'cordova'],
        description: 'Emulate an Ionic project on a simulator/emulator',
        help: {
          command: `${ionicCmd} cordova emulate --help`,
          example: {
            options: {},
          },
        },
      },
    },
    [options.cdvPlatformTargetName]: {
      executor: 'nx:run-commands',
      options: { command: `${ionicCmd} cordova platform`, cwd: projectRoot },
      metadata: {
        technologies: ['ionic', 'cordova'],
        description: 'Manage Cordova platform targets',
        help: {
          command: `${ionicCmd} cordova platform --help`,
          example: {
            options: {},
          },
        },
      },
    },
    [options.cdvPluginTargetName]: {
      executor: 'nx:run-commands',
      options: { command: `${ionicCmd} cordova plugin`, cwd: projectRoot },
      metadata: {
        technologies: ['ionic', 'cordova'],
        description: 'Manage Cordova plugins',
        help: {
          command: `${ionicCmd} cordova plugin --help`,
          example: {
            options: {},
          },
        },
      },
    },
    [options.cdvPrepareTargetName]: {
      executor: 'nx:run-commands',
      options: { command: `${ionicCmd} cordova prepare`, cwd: projectRoot },
      metadata: {
        technologies: ['ionic', 'cordova'],
        description:
          'Copies assets to Cordova platforms, preparing them for native builds',
        help: {
          command: `${ionicCmd} cordova prepare --help`,
          example: {
            options: {},
          },
        },
      },
    },
    [options.cdvRequirementsTargetName]: {
      executor: 'nx:run-commands',
      options: {
        command: `${ionicCmd} cordova requirements`,
        cwd: projectRoot,
      },
      metadata: {
        technologies: ['ionic', 'cordova'],
        description: 'Checks and print out all the requirements for platforms',
        help: {
          command: `${ionicCmd} cordova requirements --help`,
          example: {
            options: {},
          },
        },
      },
    },
    [options.cdvResourcesTargetName]: {
      executor: 'nx:run-commands',
      options: { command: `${ionicCmd} cordova resources`, cwd: projectRoot },
      metadata: {
        technologies: ['ionic', 'cordova'],
        description: 'Automatically create icon and splash screen resources',
        help: {
          command: `${ionicCmd} cordova resources --help`,
          example: {
            options: {},
          },
        },
      },
    },
    [options.cdvRunTargetName]: {
      executor: 'nx:run-commands',
      options: { command: `${ionicCmd} cordova run`, cwd: projectRoot },
      continuous: true,
      metadata: {
        technologies: ['ionic', 'cordova'],
        description: 'Run an Ionic project on a connected device',
        help: {
          command: `${ionicCmd} cordova run --help`,
          example: {
            options: {},
          },
        },
      },
    },
    [options.repairTargetName]: {
      executor: 'nx:run-commands',
      options: { command: `${ionicCmd} repair`, cwd: projectRoot },
      metadata: {
        technologies: ['ionic'],
        description: 'Repair Ionic configuration issues',
        help: {
          command: `${ionicCmd} repair --help`,
          example: {
            options: {},
          },
        },
      },
    },
  };

  return targets;
}

function getInputs(
  namedInputs: NxJsonConfiguration['namedInputs']
): TargetConfiguration['inputs'] {
  return [
    ...('production' in namedInputs
      ? ['default', '^production']
      : ['default', '^default']),
    {
      externalDependencies: ['@ionic/cli'],
    },
  ];
}

function getOutputs(projectRoot: string, dir: string) {
  if (projectRoot === '.') {
    return `{projectRoot}/${dir}`;
  } else {
    return `{workspaceRoot}/${projectRoot}/${dir}`;
  }
}

function normalizeOptions(options: IonicPluginOptions): IonicPluginOptions {
  options ??= {};
  options.buildTargetName ??= 'build';
  options.serveTargetName ??= 'serve';
  options.generateTargetName ??= 'generate';
  options.capAddTargetName ??= 'cap-add';
  options.capBuildTargetName ??= 'cap-build';
  options.capCopyTargetName ??= 'cap-copy';
  options.capOpenTargetName ??= 'cap-open';
  options.capRunTargetName ??= 'cap-run';
  options.capSyncTargetName ??= 'cap-sync';
  options.capUpdateTargetName ??= 'cap-update';
  options.cdvBuildTargetName ??= 'cdv-build';
  options.cdvCompileTargetName ??= 'cdv-compile';
  options.cdvEmulateTargetName ??= 'cdv-emulate';
  options.cdvPlatformTargetName ??= 'cdv-platform';
  options.cdvPluginTargetName ??= 'cdv-plugin';
  options.cdvPrepareTargetName ??= 'cdv-prepare';
  options.cdvRequirementsTargetName ??= 'cdv-requirements';
  options.cdvResourcesTargetName ??= 'cdv-resources';
  options.cdvRunTargetName ??= 'cdv-run';
  options.repairTargetName ??= 'repair';
  return options;
}

export const createNodesV2: CreateNodesV2<IonicPluginOptions> = [
  ionicConfigGlob,
  async (configFiles, options, context) => {
    const optionsHash = hashObject(options);
    const cachePath = join(workspaceDataDirectory, `ionic-${optionsHash}.hash`);
    const targetsCache = readTargetsCache(cachePath);

    try {
      return await createNodesFromFiles(
        (configFile, options, context) =>
          createNodesInternal(configFile, options, context, targetsCache),
        configFiles,
        options,
        context
      );
    } finally {
      writeTargetsToCache(cachePath, targetsCache);
    }
  },
];

async function createNodesInternal(
  configFile: string,
  options: IonicPluginOptions,
  context: CreateNodesContext,
  targetsCache: Record<
    string,
    Record<string, TargetConfiguration<IonicPluginOptions>>
  >
): Promise<CreateNodesResult> {
  options = normalizeOptions(options);
  const projectRoot = dirname(configFile);

  // Do not create a project if package.json isn't there.
  const siblingFiles = readdirSync(join(context.workspaceRoot, projectRoot));
  if (!siblingFiles.includes('package.json')) {
    return {};
  }

  // Check if it's an Ionic project
  const packageJson = readJsonFile(
    join(context.workspaceRoot, projectRoot, 'package.json')
  );
  if (
    !packageJson.dependencies?.['@ionic/angular'] &&
    !packageJson.dependencies?.['@ionic/react'] &&
    !packageJson.dependencies?.['@ionic/vue'] &&
    !packageJson.devDependencies?.['@ionic/cli']
  ) {
    return {};
  }

  const hash = await calculateHashForCreateNodes(
    projectRoot,
    options,
    context,
    [getLockFileName(detectPackageManager(context.workspaceRoot))]
  );

  targetsCache[hash] ??= buildIonicTargets(projectRoot, options, context);

  return {
    projects: {
      [projectRoot]: {
        targets: targetsCache[hash],
      },
    },
  };
}

/**
 * @deprecated This is replaced with {@link createNodesV2}. Update your plugin to export its own `createNodesV2` function that wraps this one instead.
 * This function will change to the v2 function in Nx 20.
 */
export const createNodes: CreateNodes<IonicPluginOptions> = [
  ionicConfigGlob,
  async (configFilePath, options, context) => {
    logger.warn(
      '`createNodes` is deprecated. Update your plugin to utilize createNodesV2 instead. In Nx 20, this will change to the createNodesV2 API.'
    );

    const optionsHash = hashObject(options);
    const cachePath = join(workspaceDataDirectory, `ionic-${optionsHash}.hash`);
    const targetsCache = readTargetsCache(cachePath);

    return createNodesInternal(configFilePath, options, context, targetsCache);
  },
];
