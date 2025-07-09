import {
  Tree,
  addDependenciesToPackageJson,
  createProjectGraphAsync,
  formatFiles,
  GeneratorCallback,
  readNxJson,
  removeDependenciesFromPackageJson,
  runTasksInSerial,
  updateJson,
  updateNxJson,
} from '@nx/devkit';
import { addPlugin } from '@nx/devkit/src/utils/add-plugin';
import { createNodesV2 } from '../../plugins/plugin';
import { hasIonicPlugin } from '../../utils/plugin';
import { ionicCliVersion, nxVersion } from '../../utils/versions';
import { InitGeneratorSchema } from './schema';

function addGitIgnoreEntry(tree: Tree) {
  if (!tree.exists('.gitignore')) {
    return;
  }

  let content = tree.read('.gitignore', 'utf-8');
  if (!content.includes('# Ionic')) {
    content += `

# Ionic
www/
platforms/
plugins/
*.log
.DS_Store
Thumbs.db
UserInterfaceState.xcuserstate
$IONIC_LOG_FILE
`;
    tree.write('.gitignore', content);
  }
}

function updateProductionFileset(tree: Tree) {
  const nxJson = readNxJson(tree);

  const productionFileSet = nxJson.namedInputs?.production;
  if (productionFileSet) {
    productionFileSet.push('!{projectRoot}/ionic.config.json');
    productionFileSet.push('!{projectRoot}/capacitor.config.json');
    productionFileSet.push('!{projectRoot}/capacitor.config.ts');
    productionFileSet.push('!{projectRoot}/config.xml');
    productionFileSet.push('!{projectRoot}/.ionic');
    productionFileSet.push('!{projectRoot}/platforms');
    productionFileSet.push('!{projectRoot}/plugins');
    // Dedupe and set
    nxJson.namedInputs.production = Array.from(new Set(productionFileSet));
  }
  updateNxJson(tree, nxJson);
}

function addTargetDefaults(tree: Tree) {
  const nxJson = readNxJson(tree);

  nxJson.targetDefaults ??= {};
  nxJson.targetDefaults['@nxrocks/nx-ionic:ionic'] ??= {};
  nxJson.targetDefaults['@nxrocks/nx-ionic:ionic'].cache ??= true;
  nxJson.targetDefaults['@nxrocks/nx-ionic:ionic'].inputs ??= [
    'default',
    '{projectRoot}/ionic.config.json',
    '{projectRoot}/capacitor.config.json',
    '{projectRoot}/capacitor.config.ts',
    '{projectRoot}/config.xml',
    { externalDependencies: ['@ionic/cli'] },
  ];
  updateNxJson(tree, nxJson);
}

function updateVsCodeRecommendedExtensions(tree: Tree) {
  if (!tree.exists('.vscode/extensions.json')) {
    return;
  }

  updateJson(tree, '.vscode/extensions.json', (json) => {
    json.recommendations = json.recommendations || [];
    const extension = 'ionic.ionic';
    if (!json.recommendations.includes(extension)) {
      json.recommendations.push(extension);
    }
    return json;
  });
}

export async function initIonic(
  tree: Tree,
  options: InitGeneratorSchema
): Promise<GeneratorCallback> {
  const nxJson = readNxJson(tree);
  const addPluginDefault =
    process.env.NX_ADD_PLUGINS !== 'false' &&
    nxJson.useInferencePlugins !== false;
  options.addPlugin ??= addPluginDefault;

  const hasPlugin = hasIonicPlugin(tree);

  addGitIgnoreEntry(tree);

  // If plugin is already added and we have inference, we're done
  if (hasPlugin && options.addPlugin) {
    return runTasksInSerial();
  }

  updateProductionFileset(tree);
  updateVsCodeRecommendedExtensions(tree);

  if (options.addPlugin) {
    await addPlugin(
      tree,
      await createProjectGraphAsync(),
      '@nxrocks/nx-ionic/plugin',
      createNodesV2,
      {
        buildTargetName: ['build', 'ionic:build', 'ionic-build'],
        serveTargetName: ['serve', 'ionic:serve', 'ionic-serve'],
        generateTargetName: ['generate', 'ionic:generate', 'ionic-generate'],
        capAddTargetName: ['cap-add', 'ionic:cap-add', 'ionic-cap-add'],
        capBuildTargetName: ['cap-build', 'ionic:cap-build', 'ionic-cap-build'],
        capCopyTargetName: ['cap-copy', 'ionic:cap-copy', 'ionic-cap-copy'],
        capOpenTargetName: ['cap-open', 'ionic:cap-open', 'ionic-cap-open'],
        capRunTargetName: ['cap-run', 'ionic:cap-run', 'ionic-cap-run'],
        capSyncTargetName: ['cap-sync', 'ionic:cap-sync', 'ionic-cap-sync'],
        capUpdateTargetName: [
          'cap-update',
          'ionic:cap-update',
          'ionic-cap-update',
        ],
        cdvBuildTargetName: ['cdv-build', 'ionic:cdv-build', 'ionic-cdv-build'],
        cdvCompileTargetName: [
          'cdv-compile',
          'ionic:cdv-compile',
          'ionic-cdv-compile',
        ],
        cdvEmulateTargetName: [
          'cdv-emulate',
          'ionic:cdv-emulate',
          'ionic-cdv-emulate',
        ],
        cdvPlatformTargetName: [
          'cdv-platform',
          'ionic:cdv-platform',
          'ionic-cdv-platform',
        ],
        cdvPluginTargetName: [
          'cdv-plugin',
          'ionic:cdv-plugin',
          'ionic-cdv-plugin',
        ],
        cdvPrepareTargetName: [
          'cdv-prepare',
          'ionic:cdv-prepare',
          'ionic-cdv-prepare',
        ],
        cdvRequirementsTargetName: [
          'cdv-requirements',
          'ionic:cdv-requirements',
          'ionic-cdv-requirements',
        ],
        cdvResourcesTargetName: [
          'cdv-resources',
          'ionic:cdv-resources',
          'ionic-cdv-resources',
        ],
        cdvRunTargetName: ['cdv-run', 'ionic:cdv-run', 'ionic-cdv-run'],
        repairTargetName: ['repair', 'ionic:repair', 'ionic-repair'],
      },
      options.updatePackageScripts
    );
  } else {
    addTargetDefaults(tree);
  }

  const tasks: GeneratorCallback[] = [];
  if (!options.skipPackageJson) {
    tasks.push(moveDependency(tree));
    tasks.push(updateDependencies(tree, options));
  }

  if (!options.skipFormat) {
    await formatFiles(tree);
  }

  return runTasksInSerial(...tasks);
}

function updateDependencies(tree: Tree, options: InitGeneratorSchema) {
  return addDependenciesToPackageJson(
    tree,
    {},
    {
      '@nxrocks/nx-ionic': nxVersion,
      '@ionic/cli': ionicCliVersion,
    },
    undefined,
    options.keepExistingVersions
  );
}

function moveDependency(tree: Tree) {
  return removeDependenciesFromPackageJson(tree, ['@nxrocks/nx-ionic'], []);
}

export default async function initGenerator(
  tree: Tree,
  options: InitGeneratorSchema
) {
  return await initIonic(tree, { addPlugin: false, ...options });
}
