import {
  Tree,
  formatFiles,
  generateFiles,
  joinPathFragments,
  getPackageManagerCommand,
  addProjectConfiguration,
  names,
} from '@nx/devkit';
import { execSync } from 'child_process';

export interface AppGeneratorSchema {
  name: string;
  template?: 'blank' | 'tabs' | 'sidemenu' | 'list';
  directory?: string;
  type?: 'angular' | 'angular-standalone' | 'react' | 'vue';
  capacitor?: boolean;
  cordova?: boolean;
  id?: string;
  projectId?: string;
  packageId?: string;
  noDeps?: boolean;
  noGit?: boolean;
  link?: boolean;
  tags?: string;
}

export default async function appGenerator(
  tree: Tree,
  options: AppGeneratorSchema
) {
  // Validate required options
  if (!options.name) {
    throw new Error('Project name is required');
  }

  // Validate package ID format if provided
  if (
    options.packageId &&
    !/^[a-z][a-z0-9_]*(\.[a-z0-9_]+)+[0-9a-z_]$/.test(options.packageId)
  ) {
    throw new Error(
      'Package ID must be in reverse-DNS notation (e.g., com.example.app)'
    );
  }

  const normalizedOptions = normalizeOptions(options);
  const { projectName, projectRoot, projectDirectory } = normalizedOptions;

  // Build Ionic CLI command
  const pmc = getPackageManagerCommand();
  const ionicArgs = [
    'start',
    projectName,
    options.template || 'blank',
    '--no-interactive',
    '--quiet',
  ];

  // Add project ID
  if (options.projectId) {
    ionicArgs.push('--project-id', options.projectId);
  } else {
    ionicArgs.push('--project-id', projectName);
  }

  // Add type (framework)
  if (options.type) {
    ionicArgs.push('--type', options.type);
  }

  // Add Capacitor/Cordova flags
  if (options.capacitor) {
    ionicArgs.push('--capacitor');
  }
  if (options.cordova) {
    ionicArgs.push('--cordova');
  }

  // Add Ionic App ID
  if (options.id) {
    ionicArgs.push('--id', options.id);
  }

  // Add package ID
  if (options.packageId) {
    ionicArgs.push('--package-id', options.packageId);
  }

  // Add dependency and git flags
  if (options.noDeps) {
    ionicArgs.push('--no-deps');
  }
  if (options.noGit) {
    ionicArgs.push('--no-git');
  }

  // Add link flag
  if (options.link) {
    ionicArgs.push('--link');
  }

  // Execute Ionic CLI command
  const command = `${pmc.exec} @ionic/cli@latest ${ionicArgs.join(' ')}`;

  try {
    execSync(command, {
      stdio: 'inherit',
      cwd: projectDirectory ? tree.root : undefined,
    });
  } catch (error) {
    throw new Error(`Failed to create Ionic app: ${error.message}`);
  }

  // Add Nx project configuration
  const targets = {
    build: {
      executor: 'nx:run-commands',
      options: {
        command: `${pmc.exec} ionic build`,
        cwd: projectRoot,
      },
    },
    serve: {
      executor: 'nx:run-commands',
      options: {
        command: `${pmc.exec} ionic serve`,
        cwd: projectRoot,
      },
    },
  };

  // Add Capacitor targets if enabled
  if (options.capacitor !== false) {
    targets['cap-add'] = {
      executor: 'nx:run-commands',
      options: {
        command: `${pmc.exec} ionic capacitor add`,
        cwd: projectRoot,
      },
    };
    targets['cap-build'] = {
      executor: 'nx:run-commands',
      options: {
        command: `${pmc.exec} ionic capacitor build`,
        cwd: projectRoot,
      },
    };
    targets['cap-copy'] = {
      executor: 'nx:run-commands',
      options: {
        command: `${pmc.exec} ionic capacitor copy`,
        cwd: projectRoot,
      },
    };
    targets['cap-open'] = {
      executor: 'nx:run-commands',
      options: {
        command: `${pmc.exec} ionic capacitor open`,
        cwd: projectRoot,
      },
    };
    targets['cap-run'] = {
      executor: 'nx:run-commands',
      options: {
        command: `${pmc.exec} ionic capacitor run`,
        cwd: projectRoot,
      },
    };
    targets['cap-sync'] = {
      executor: 'nx:run-commands',
      options: {
        command: `${pmc.exec} ionic capacitor sync`,
        cwd: projectRoot,
      },
    };
  }

  addProjectConfiguration(tree, projectName, {
    root: projectRoot,
    projectType: 'application',
    sourceRoot: `${projectRoot}/src`,
    targets,
    tags: options.tags ? options.tags.split(',').map((s) => s.trim()) : [],
  });

  // Generate additional Nx files if needed
  generateFiles(tree, joinPathFragments(__dirname, './files'), projectRoot, {
    ...options,
    ...normalizedOptions,
    tmpl: '',
  });

  await formatFiles(tree);

  return () => {
    console.log(`\n🎉 Successfully created Ionic app "${projectName}"!`);
    console.log(`\n📁 Project location: ${projectRoot}`);
    console.log(`\n🚀 To get started:`);
    console.log(`   cd ${projectRoot}`);
    console.log(`   ${pmc.exec} ionic serve`);
  };
}

function normalizeOptions(options: AppGeneratorSchema) {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `apps/${projectDirectory}`;

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
  };
}
