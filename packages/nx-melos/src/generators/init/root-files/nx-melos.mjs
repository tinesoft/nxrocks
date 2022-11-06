import { homedir} from 'os';
import { spawnSync} from 'child_process';

// This plugin (nx-melos) installs 'melos' (upon inititialization) as a Dart global package (inside user home folder at `~/.pub-cache/bin`).
// But that folder might not be on your PATH environment variable, so we can not just rely on the bare 'melos' executable being available globally. 
// Thus this wrapper, that uses the full path (OS independently) to the 'melos' executable.

const melosExec = `${homedir()}/.pub-cache/bin/melos`;

const args = process.argv.slice(2);
const execute = `${melosExec} ${args}`;
const silent = false;
try {
    spawnSync(execute, { shell: false, ...(silent ? { stdio: ['ignore', 'ignore', 'ignore'] } : {}), });
} catch (e) {
    console.error(`Failed to execute command: ${execute}`);
    console.error(e);
}