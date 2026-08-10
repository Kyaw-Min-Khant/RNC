const fs = require("fs");
const path = require("path");
const { sourceFilePath } = require("./registry");

function targetDirFor(cwd, config, item) {
  const alias = config.aliases[item.aliasKey];
  if (!alias) {
    throw new Error(
      `components.json has no alias for "${item.aliasKey}". Re-run "rnc init".`,
    );
  }
  return path.join(cwd, alias);
}

function targetFileFor(cwd, config, item) {
  return path.join(targetDirFor(cwd, config, item), item.targetFileName);
}

function toImportSpecifier(fromDir, toFileNoExt) {
  let rel = path.relative(fromDir, toFileNoExt).split(path.sep).join("/");
  if (!rel.startsWith(".")) rel = "./" + rel;
  return rel;
}

/**
 * Copies one registry item's source into the consumer's project, rewriting
 * its relative imports (e.g. "../../theme/ThemeContext") to point at wherever
 * that dependency's file actually landed per the consumer's configured aliases.
 */
function writeItem(registry, key, config, cwd, { overwrite = false } = {}) {
  const item = registry[key];
  const targetDir = targetDirFor(cwd, config, item);
  const targetFile = targetFileFor(cwd, config, item);

  if (fs.existsSync(targetFile) && !overwrite) {
    return { key, targetFile, status: "skipped" };
  }

  let content = fs.readFileSync(sourceFilePath(item), "utf8");

  for (const depKey of item.registryDependencies) {
    const dep = registry[depKey];
    if (!dep.originalImportPath) continue;
    const depTargetNoExt = targetFileFor(cwd, config, dep).replace(
      /\.tsx?$/,
      "",
    );
    const newSpecifier = toImportSpecifier(targetDir, depTargetNoExt);
    content = content.split(`"${dep.originalImportPath}"`).join(`"${newSpecifier}"`);
  }

  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(targetFile, content);
  return { key, targetFile, status: "added" };
}

module.exports = { writeItem, targetFileFor };
