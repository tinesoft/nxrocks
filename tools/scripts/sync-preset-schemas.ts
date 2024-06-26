import { logger, readJsonFile, workspaceRoot, writeJsonFile } from '@nx/devkit';
import { execSync } from 'child_process';
import { existsSync, readdirSync } from 'fs';
import { join, resolve } from 'path';
import { resolveModuleName } from 'typescript';

interface SchemaFile {
  properties: Record<string, unknown>;
  required: string[];
}

const packagesRoot = resolve(workspaceRoot, 'packages');
const presetSchemaFiles = readdirSync(packagesRoot)
  .filter((folder) =>
    existsSync(join(packagesRoot, folder, '/src/generators/preset/schema.json'))
  )
  .map((folder) =>
    join(packagesRoot, folder, '/src/generators/preset/schema.json')
  );

const changedFiles = execSync('git diff --cached --name-only')
  .toString()
  .trim()
  .split(/\r?\n/);
const changedPresetSchemaFiles = changedFiles
  .map((f) => join(workspaceRoot, f))
  .filter((f) => presetSchemaFiles.indexOf(f) != -1);

// Sync the the schema.json file of 'preset' generators with the related 'project' generator's
changedPresetSchemaFiles.forEach((presetSchemaFile) => {
  const presetSchemaJson = readJsonFile<SchemaFile>(presetSchemaFile);
  const projetSchemaJson = readJsonFile<SchemaFile>(
    join(presetSchemaFile, '../../project/schema.json')
  );

  delete projetSchemaJson.properties['name'];
  const { prjName } = presetSchemaJson.properties;
  presetSchemaJson.properties = {
    prjName,
    ...projetSchemaJson.properties,
  };

  presetSchemaJson.required = [
    'prjName',
    ...projetSchemaJson.required.filter((p) => p !== 'name'),
  ];

  writeJsonFile(presetSchemaFile, presetSchemaJson);

  logger.info(
    `✅ Successfuly synced preset schema file at '${presetSchemaFile}'`
  );
});
