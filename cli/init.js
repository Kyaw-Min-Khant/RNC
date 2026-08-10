const path = require("path");
const prompts = require("prompts");
const pc = require("picocolors");
const { readConfig, writeConfig } = require("./components-config");
const { addTsconfigAlias } = require("./tsconfig-alias");

async function init(cwd) {
  const existing = readConfig(cwd);
  if (existing) {
    const { proceed } = await prompts({
      type: "confirm",
      name: "proceed",
      message: "components.json already exists. Overwrite it?",
      initial: false,
    });
    if (!proceed) {
      console.log(pc.yellow("Aborted."));
      return;
    }
  }

  const answers = await prompts([
    {
      type: "text",
      name: "components",
      message: "Where should components be added?",
      initial: "src/components/ui",
    },
    {
      type: "text",
      name: "theme",
      message: "Where should the theme context be added?",
      initial: "src/theme",
    },
    {
      type: "text",
      name: "utils",
      message: "Where should utilities (cn helper) be added?",
      initial: "src/lib",
    },
    {
      type: "confirm",
      name: "useAlias",
      message: "Use an import alias (e.g. @/components/...) instead of relative imports?",
      initial: true,
    },
    {
      type: (prev) => (prev ? "text" : null),
      name: "aliasPrefix",
      message: "Alias prefix",
      initial: "@",
    },
    {
      type: (prev, values) => (values.useAlias ? "text" : null),
      name: "aliasBaseDir",
      message: "Directory the alias points to",
      initial: "src",
    },
  ]);

  if (!answers.components) {
    console.log(pc.yellow("Aborted."));
    return;
  }

  const config = {
    $schema: "https://kyaw-min-khant.dev/rnc/schema/components.json",
    aliases: {
      components: answers.components,
      theme: answers.theme,
      utils: answers.utils,
    },
  };

  if (answers.useAlias) {
    config.importAlias = {
      prefix: answers.aliasPrefix,
      baseDir: answers.aliasBaseDir,
    };
  }

  writeConfig(cwd, config);
  console.log(pc.green("\ncomponents.json created."));

  const themeImport = answers.useAlias
    ? `${answers.aliasPrefix}/${path
        .relative(answers.aliasBaseDir, answers.theme)
        .split(path.sep)
        .join("/")}/ThemeContext`
    : `./${answers.theme}/ThemeContext`;

  if (answers.useAlias) {
    addTsconfigAlias(cwd, answers.aliasPrefix, answers.aliasBaseDir);
    console.log(pc.green(`tsconfig.json updated with "${answers.aliasPrefix}/*" -> "${answers.aliasBaseDir}/*".`));
    console.log(
      pc.yellow(
        `\nMetro/Babel also needs to resolve "${answers.aliasPrefix}" at runtime (tsconfig alone only affects TypeScript/editors). If you don't already have babel-plugin-module-resolver configured, install it and add this to babel.config.js:\n`,
      ),
    );
    console.log(
      pc.dim(
        `  plugins: [\n    ["module-resolver", { alias: { "${answers.aliasPrefix}": "./${answers.aliasBaseDir}" } }],\n  ]\n`,
      ),
    );
  }

  console.log(
    `Next: wrap your app root in ${pc.cyan("<ThemeProvider>")} once you add your first component:\n`,
  );
  console.log(
    pc.dim(
      `  import { ThemeProvider } from "${themeImport}";\n\n  export default function App() {\n    return (\n      <ThemeProvider>\n        <YourApp />\n      </ThemeProvider>\n    );\n  }\n`,
    ),
  );
  console.log(`Run ${pc.cyan("rnc add <component>")} to add your first component.`);
}

module.exports = { init };
