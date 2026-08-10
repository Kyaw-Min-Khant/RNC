#!/usr/bin/env node
const { Command } = require("commander");
const { init } = require("../cli/init");
const { add } = require("../cli/add");
const { list } = require("../cli/list");

const program = new Command();

program
  .name("rnc")
  .description("Copy RNC React Native components directly into your project");

program
  .command("init")
  .description("Create a components.json for this project")
  .action(() => init(process.cwd()));

program
  .command("add <components...>")
  .description("Add one or more components to your project")
  .option("-o, --overwrite", "overwrite files that already exist", false)
  .action((components, options) => add(process.cwd(), components, options));

program
  .command("list")
  .description("List all available components")
  .action(() => list());

program.parseAsync(process.argv);
