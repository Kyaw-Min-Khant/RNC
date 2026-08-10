const fs = require("fs");
const path = require("path");

const PACKAGE_ROOT = path.join(__dirname, "..");

function loadRegistry() {
  const raw = fs.readFileSync(
    path.join(PACKAGE_ROOT, "registry.json"),
    "utf8",
  );
  return JSON.parse(raw).items;
}

function normalizeName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-");
}

function resolveItem(registry, name) {
  const key = normalizeName(name);
  if (registry[key]) return key;
  throw new Error(
    `Unknown component "${name}". Run "rnc list" to see available components.`,
  );
}

/** Resolves requested component names into a dependency-ordered, deduped list of registry keys. */
function resolveWithDependencies(registry, names) {
  const ordered = [];
  const seen = new Set();

  function visit(key) {
    if (seen.has(key)) return;
    seen.add(key);
    const item = registry[key];
    for (const dep of item.registryDependencies) {
      visit(dep);
    }
    ordered.push(key);
  }

  for (const name of names) {
    visit(resolveItem(registry, name));
  }

  return ordered;
}

function sourceFilePath(item) {
  return path.join(PACKAGE_ROOT, "src", item.file);
}

module.exports = {
  PACKAGE_ROOT,
  loadRegistry,
  normalizeName,
  resolveItem,
  resolveWithDependencies,
  sourceFilePath,
};
