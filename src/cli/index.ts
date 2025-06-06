import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { registerCommands } from "./commands/index.ts";

export function startCLI() {
  const cli = yargs(hideBin(process.argv))
    .scriptName("testgenie")
    .usage("$0 <command> [options]")
    .help()
    .version()
    .demandCommand(1, "You need at least one command before moving on")
    .strict();

  registerCommands(cli);

  cli.parse();
}
 