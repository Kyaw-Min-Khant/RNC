const fs = require("fs");
const path = require("path");

/**
 * Merges an alias into the consumer's tsconfig.json paths, creating a minimal
 * tsconfig.json if none exists. Only touches compilerOptions.baseUrl/paths —
 * everything else in the file (if any) is left untouched.
 */
function addTsconfigAlias(cwd, prefix, baseDir) {
  const file = path.join(cwd, "tsconfig.json");
  const tsconfig = fs.existsSync(file)
    ? JSON.parse(fs.readFileSync(file, "utf8"))
    : { extends: "expo/tsconfig.base", compilerOptions: {} };

  tsconfig.compilerOptions = tsconfig.compilerOptions || {};
  tsconfig.compilerOptions.baseUrl = tsconfig.compilerOptions.baseUrl || ".";
  tsconfig.compilerOptions.paths = tsconfig.compilerOptions.paths || {};
  tsconfig.compilerOptions.paths[`${prefix}/*`] = [`${baseDir}/*`];

  fs.writeFileSync(file, JSON.stringify(tsconfig, null, 2) + "\n");
}

module.exports = { addTsconfigAlias };
