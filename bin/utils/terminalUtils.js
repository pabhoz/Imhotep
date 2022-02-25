const { exec } = require("child_process");
const fs = require("fs");
const readline = require("readline");

const config = {
  verbose: true,
};

const runCommand = (command) =>
  new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        if (config?.verbose) {
          console.log(`error: ${error.message}`);
        }
        reject(new Error(`error: ${error.message}`));
        return;
      }
      if (stderr) {
        if (config?.verbose) {
          console.log(`stderr: ${stderr}`);
        }
        reject(new Error(`stderr: ${stderr}`));
        return;
      }
      if (config?.verbose) {
        console.log(`
        Success
        Command executed: ${command}
    
        ${
          stdout ? `Stdout:\n----------------------------------\n${stdout}` : ""
        }`);
      }
      resolve(stdout || undefined);
    });
  });

const checkForFolder = (path) => fs.existsSync(path);

const askForInput = async (msg) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log(msg);
  const it = rl[Symbol.asyncIterator]();
  const input = await it.next();
  rl.close();
  return input.value;
};

const styles = {
  Reset: `\x1b[0m`,
  Bright: `\x1b[1m`,
  Dim: `\x1b[2m`,
  Underscore: `\x1b[4m`,
  Blink: `\x1b[5m`,
  Reverse: `\x1b[7m`,
  Hidden: `\x1b[8m`,
  FgBlack: `\x1b[30m`,
  FgRed: `\x1b[31m`,
  FgGreen: `\x1b[32m`,
  FgYellow: `\x1b[33m`,
  FgBlue: `\x1b[34m`,
  FgMagenta: `\x1b[35m`,
  FgCyan: `\x1b[36m`,
  FgWhite: `\x1b[37m`,
  BgBlack: `\x1b[40m`,
  BgRed: `\x1b[41m`,
  BgGreen: `\x1b[42m`,
  BgYellow: `\x1b[43m`,
  BgBlue: `\x1b[44m`,
  BgMagenta: `\x1b[45m`,
  BgCyan: `\x1b[46m`,
  BgWhite: `\x1b[47m`,
  Emph: `\x1b[43m\x1b[30m`,
};

const addIndentation = (spaces = 0, indentValue = " ") =>
  spaces > 0 ? indentValue.repeat(spaces) : "";

const log = (msg, params) => {
  const br = params?.break
    ? `
  `
    : "";
  const indentation = params?.indentation || 0;
  const indentValue = params?.indentValue || " ";
  const prepend = params?.prepend || "";

  console.log(
    params?.color ? styles[params.color] : styles.Reset,
    `${addIndentation(indentation, indentValue)}${prepend}${msg}${br}`,
    styles.Reset
  );
};

module.exports = {
  runCommand,
  checkForFolder,
  askForInput,
  addIndentation,
  log,
};
