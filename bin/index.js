#! /usr/bin/env node
/* eslint-disable no-restricted-syntax */
const fs = require("fs");
// const path = require("path");
const { /* runCommand, */ askForInput, log } = require("./utils/terminalUtils");
const pjson = require("../package.json");
const tools = require("./config/tools.json");
// const { setup: setupJest } = require("./tools/jest/index");

// const DIR = path.dirname(fs.realpathSync(__filename));
const args = process.argv;
// Check for the action to execute at 2nd inde of args
const action = args[2];

const help = () => {
  console.log(`Imhotep help`);
};

const scanTools = async () => {
  const checkAliases = (aliases) => {
    let found = false;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < aliases.length; i++) {
      const alias = aliases[i];
      log(`Alias ${alias} [${i + 1} of ${aliases.length}]`, {
        indentation: 5,
        prepend: "🥸  ",
      });
      if (fs.existsSync(`./${alias}`)) {
        found = alias;
        break;
      }
    }
    return found;
  };

  // eslint-disable-next-line no-unused-vars
  const askToInstall = async (toolName) => {
    log(
      `${toolName} not found, do you want to install and setup ${toolName}? [Y] yes [N] no`,
      { break: true, indentation: 4 }
    );
    const r = await askForInput("");
    if (r) {
      log(`Installing ${toolName}`);
    }
  };

  log(`Scaning tools... 🔍`, true);
  for await (const tool of tools) {
    log(`${tool.name}  `, {
      break: true,
      indentation: 1,
      indentValue: "🔧 ",
      color: "Emph",
    });
    // Check packages
    log(`Checking on dev dependencies for ${tool.npmName}`);
    log(`${tool.npmName} was found ✅`, { indentation: 2 });
    // askToInstall();

    // Check docs
    log(``, { break: true });
    log(`Checking config files...`, { break: false });
    for await (const file of tool.files) {
      if (fs.existsSync(`./${file.name}`)) {
        log(`${tool.name} config file was found ✅`, {
          break: true,
          indentation: 2,
        });
      } else {
        log(`${file.name} not found ❌`, { break: true, indentation: 4 });
        if (file.aliases.length > 0) {
          log(`Searching Aliases of ${file.name} 🔍`, {
            break: true,
            indentation: 4,
            prepend: "🕵🏻  ",
          });
          const found = checkAliases(file.aliases);
          if (found) {
            log(`${found} config file was found ✅`, {
              break: true,
              indentation: 4,
            });
          } else {
            // ask to create
          }
        }
      }
    }
  }
};

const setup = async () => {
  console.log(
    `Welcome to Imothep, do you want me to check for the missing tools to install?`
  );
  const r = await askForInput("[Y] yes [N] no");
  if (r === "Y" || r === "y") {
    await scanTools();
  }
};

async function bootstrap() {
  switch (action) {
    case "-v":
      console.log(`v${pjson.version}`);
      break;
    case "--help":
    case "-h":
      help();
      break;
    default:
      setup();
      break;
  }
}

bootstrap();
