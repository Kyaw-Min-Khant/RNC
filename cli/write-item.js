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

function relativeImportSpecifier(fromDir, toFileNoExt) {
  let rel = path.relative(fromDir, toFileNoExt).split(path.sep).join("/");
  if (!rel.startsWith(".")) rel = "./" + rel;
  return rel;
}

/**
 * Builds an "@/..."-style specifier for a target file when the consumer opted
 * into an import alias, e.g. baseDir "src" + prefix "@" turns
 * ".../src/theme/ThemeContext" into "@/theme/ThemeContext". Returns null when
 * aliasing is off, or when the file falls outside the aliased base directory
 * (falls back to a relative import in that case).
 */
function aliasImportSpecifier(cwd, config, toFileNoExt) {
  const alias = config.importAlias;
  if (!alias) return null;
  const baseDir = path.join(cwd, alias.baseDir);
  const rel = path.relative(baseDir, toFileNoExt);
  if (rel.startsWith("..")) return null;
  return `${alias.prefix}/${rel.split(path.sep).join("/")}`;
}

function importSpecifierFor(cwd, config, fromDir, toFileNoExt) {
  return (
    aliasImportSpecifier(cwd, config, toFileNoExt) ??
    relativeImportSpecifier(fromDir, toFileNoExt)
  );
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
    const newSpecifier = importSpecifierFor(cwd, config, targetDir, depTargetNoExt);
    content = content.split(`"${dep.originalImportPath}"`).join(`"${newSpecifier}"`);
  }

  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(targetFile, content);
  return { key, targetFile, status: "added" };
}

module.exports = { writeItem, targetFileFor };
