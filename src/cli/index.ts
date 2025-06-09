import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { registerCommands } from "./commands/index.ts";
import { isInitialized } from "../config/index.js";

export function startCLI() {
  const cli = yargs(hideBin(process.argv))
    .scriptName("testgenie")
    .usage("$0 <command> [options]")
    .help()
    .version()
    .demandCommand(1, getWelcomeMessage())
    .strict()
    .epilog(getEpilogMessage());

  registerCommands(cli);

  cli.parse();
}

function getWelcomeMessage(): string {
  if (!isInitialized()) {
    return `🚀 Welcome to testgenie! First time setup required.

⚡ Quick start:
   testgenie init    # Set up your configuration
   testgenie scan    # Analyze your codebase
   testgenie gen     # Generate tests

💡 Run 'testgenie init' first to get started!`;
  }

  return `⚡ Available commands:
   testgenie scan    # Analyze your codebase
   testgenie gen     # Generate tests  
   testgenie audit   # Review test coverage
   testgenie config  # View configuration

💡 Use 'testgenie <command> --help' for more details`;
}

function getEpilogMessage(): string {
  if (!isInitialized()) {
    return `🎯 New to testgenie? Start with 'testgenie init' to configure your preferences!
🚀 Visit https://github.com/LouayHouimli/testgenie for more info`;
  }

  return `🤖 Powered by AI test generation | 🚀 Visit https://github.com/LouayHouimli/testgenie for more info`;
}
