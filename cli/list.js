const pc = require("picocolors");
const { loadRegistry } = require("./registry");

function list() {
  const registry = loadRegistry();
  console.log(pc.bold("\nAvailable components:\n"));
  for (const [key, item] of Object.entries(registry)) {
    if (item.type !== "registry:component") continue;
    console.log(`  ${pc.cyan(key.padEnd(22))} ${item.description}`);
  }
  console.log(`\nRun ${pc.cyan("rnc add <component>")} to add one.`);
}

module.exports = { list };
