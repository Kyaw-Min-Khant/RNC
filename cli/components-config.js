const fs = require("fs");
const path = require("path");

const CONFIG_FILE_NAME = "components.json";

function configPath(cwd) {
  return path.join(cwd, CONFIG_FILE_NAME);
}

function readConfig(cwd) {
  const file = configPath(cwd);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeConfig(cwd, config) {
  fs.writeFileSync(configPath(cwd), JSON.stringify(config, null, 2) + "\n");
}

module.exports = { CONFIG_FILE_NAME, configPath, readConfig, writeConfig };
