#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// index.ts
var import_chalk = __toESM(require("chalk"));
var import_fs_extra = __toESM(require("fs-extra"));
var import_url = require("url");
var import_path = __toESM(require("path"));
var import_inquirer = __toESM(require("inquirer"));
var import_minimist = __toESM(require("minimist"));
var import_simple_git = __toESM(require("simple-git"));
var import_meta = {};
var __filename = (0, import_url.fileURLToPath)(import_meta.url);
var __dirname = import_path.default.dirname(__filename);
var TEMPLATES_DIR = import_path.default.join(__dirname, "templates");
var args = (0, import_minimist.default)(process.argv.slice(2), {
  alias: {
    t: "template",
    n: "name",
    g: "git",
    e: "env",
    h: "help"
  },
  boolean: ["git", "env", "help"]
});
if (args.help) {
  console.log(`
        Usage: create-rr7-turbo-starter [options]

        Options:
        --template, -t     Name of the template to use (e.g., cloudflare, railway)
        --name, -n         Name of your new project
        --git, -g          Initialize a Git repository
        --env, -e          Generate a .env file (from .env.example if exists)
        --help, -h         Show this help message

        Examples:
        create-rr7-turbo-starter
        create-rr7-turbo-starter --template railway --name my-app
        create-rr7-turbo-starter -t cloudflare -n edge-app --git --env
    `);
  process.exit(0);
}
var passedTemplate = args.template || args.t;
var passedProjectName = args.name || args.n;
var initGit = args.git || false;
var generateEnv = args.env || false;
(async () => {
  console.log(import_chalk.default.cyan.bold("\n\u{1F680} Create a new project from a template\n"));
  const templates = import_fs_extra.default.readdirSync(TEMPLATES_DIR).filter(
    (dir) => import_fs_extra.default.statSync(import_path.default.join(TEMPLATES_DIR, dir)).isDirectory()
  );
  let template = passedTemplate;
  let projectName = passedProjectName;
  if (!template || !templates.includes(template)) {
    if (template && !templates.includes(template)) {
      console.log(import_chalk.default.red(`
\u274C Template "${template}" not found. Showing available options...
`));
    }
    const answers = await import_inquirer.default.prompt([
      {
        name: "template",
        type: "list",
        message: "Which template do you want to use?",
        choices: templates,
        when: () => !template || !templates.includes(template)
      }
    ]);
    template = answers.template || template;
  }
  if (!projectName) {
    const answers = await import_inquirer.default.prompt([
      {
        name: "projectName",
        type: "input",
        message: "Project name:",
        validate: (input) => !!input || "Project name cannot be empty."
      }
    ]);
    projectName = answers.projectName;
  }
  const templatePath = import_path.default.join(TEMPLATES_DIR, template);
  const targetPath = import_path.default.join(process.cwd(), projectName);
  if (import_fs_extra.default.existsSync(targetPath)) {
    console.log(import_chalk.default.red(`
\u274C Folder "${projectName}" already exists.`));
    process.exit(1);
  }
  await import_fs_extra.default.copy(templatePath, targetPath);
  if (generateEnv) {
    const envTemplate = import_path.default.join(templatePath, ".env.example");
    const envTarget = import_path.default.join(targetPath, ".env");
    if (import_fs_extra.default.existsSync(envTemplate)) {
      await import_fs_extra.default.copy(envTemplate, envTarget);
      console.log(import_chalk.default.green("\u{1F4C4} .env file created from .env.example"));
    } else {
      await import_fs_extra.default.outputFile(envTarget, "# Your environment variables\n");
      console.log(import_chalk.default.green("\u{1F4C4} Blank .env file generated"));
    }
  }
  if (initGit) {
    const git = (0, import_simple_git.default)(targetPath);
    await git.init();
    await git.add(".");
    await git.commit("Initial commit from starter CLI");
    console.log(import_chalk.default.green("\u{1F527} Git repo initialized"));
  }
  console.log(import_chalk.default.green(`
\u2705 Project "${projectName}" created using "${template}" template!`));
  console.log(import_chalk.default.yellow(`
Next steps:`));
  console.log(`  cd ${projectName}`);
  console.log(`  bun install (or npm/yarn/pnpm)`);
  console.log(`  bun dev`);
})();
