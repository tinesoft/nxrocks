import { logger, readJsonFile, workspaceRoot, writeJsonFile } from '@nx/devkit';
import { existsSync, readdirSync } from 'fs';
import { join, resolve } from 'path';
import { execNx } from './utils';

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

// Sync the the schema.json file of 'preset' generators with the related 'project' generator's
presetSchemaFiles.forEach((presetSchemaFile) => {

  const presetSchemaJson = readJsonFile<SchemaFile>(presetSchemaFile);
  const projetSchemaJson = readJsonFile<SchemaFile>(
    join(presetSchemaFile, '../../project/schema.json')
  );

  const { prjName } = presetSchemaJson.properties;
  presetSchemaJson.properties = {
    prjName,
    ...projetSchemaJson.properties,
  };

  presetSchemaJson.required = [];

  writeJsonFile(presetSchemaFile, presetSchemaJson);

  logger.info(
    `✅ Successfuly synced preset schema file at '${presetSchemaFile}'`
  );
});

execNx(['format']);
