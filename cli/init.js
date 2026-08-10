const prompts = require("prompts");
const pc = require("picocolors");
const { readConfig, writeConfig } = require("./components-config");

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
  ]);

  if (!answers.components) {
    console.log(pc.yellow("Aborted."));
    return;
  }

  writeConfig(cwd, {
    $schema: "https://kyaw-min-khant.dev/rnc/schema/components.json",
    aliases: {
      components: answers.components,
      theme: answers.theme,
      utils: answers.utils,
    },
  });

  console.log(pc.green("\ncomponents.json created."));
  console.log(
    `\nNext: wrap your app root in ${pc.cyan("<ThemeProvider>")} once you add your first component:\n`,
  );
  console.log(
    pc.dim(
      `  import { ThemeProvider } from "${answers.theme}/ThemeContext";\n\n  export default function App() {\n    return (\n      <ThemeProvider>\n        <YourApp />\n      </ThemeProvider>\n    );\n  }\n`,
    ),
  );
  console.log(`Run ${pc.cyan("rnc add <component>")} to add your first component.`);
}

module.exports = { init };
