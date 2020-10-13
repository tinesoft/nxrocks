export function execSync(command, options) {
    const msg = `Executed command '${command}' with options '${JSON.stringify(options)}'`;
    console.log(msg);
    return msg;
}