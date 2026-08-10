const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function detect(cwd) {
  if (fs.existsSync(path.join(cwd, "bun.lockb"))) return "bun";
  if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(cwd, "yarn.lock"))) return "yarn";
  return "npm";
}

const ADD_COMMAND = {
  npm: "npm install",
  yarn: "yarn add",
  pnpm: "pnpm add",
  bun: "bun add",
};

function installPackages(cwd, packages) {
  if (packages.length === 0) return;
  const manager = detect(cwd);
  const command = `${ADD_COMMAND[manager]} ${packages.join(" ")}`;
  execSync(command, { cwd, stdio: "inherit" });
}

module.exports = { detect, installPackages };
