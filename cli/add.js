const pc = require("picocolors");
const { readConfig } = require("./components-config");
const { loadRegistry, resolveWithDependencies } = require("./registry");
const { writeItem } = require("./write-item");
const { installPackages } = require("./package-manager");

async function add(cwd, names, options = {}) {
  const config = readConfig(cwd);
  if (!config) {
    console.log(
      pc.red('No components.json found. Run "rnc init" first.'),
    );
    process.exitCode = 1;
    return;
  }

  if (names.length === 0) {
    console.log(pc.yellow("Usage: rnc add <component> [components...]"));
    return;
  }

  const registry = loadRegistry();
  let resolved;
  try {
    resolved = resolveWithDependencies(registry, names);
  } catch (err) {
    console.log(pc.red(err.message));
    process.exitCode = 1;
    return;
  }

  const npmPackages = new Set();
  const results = [];

  for (const key of resolved) {
    const item = registry[key];
    for (const dep of item.dependencies) npmPackages.add(dep);
    results.push(writeItem(registry, key, config, cwd, options));
  }

  for (const result of results) {
    const relTarget = result.targetFile.replace(cwd + "/", "");
    if (result.status === "added") {
      console.log(`${pc.green("+")} ${relTarget}`);
    } else {
      console.log(`${pc.dim("·")} ${pc.dim(relTarget + " (already exists, skipped)")}`);
    }
  }

  if (npmPackages.size > 0) {
    console.log(`\nInstalling: ${[...npmPackages].join(", ")}`);
    installPackages(cwd, [...npmPackages]);
  }

  console.log(pc.green("\nDone."));
}

module.exports = { add };
