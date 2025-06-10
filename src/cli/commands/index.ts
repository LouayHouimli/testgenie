import type { Argv } from "yargs";
import { genCommand } from "./gen.ts";
import { scanCommand } from "./scan.ts";
import { auditCommand } from "./audit.ts";
import { initCommand } from "./init.ts";
import { configCommand } from "./config.ts";
import { testCommand } from "./test.ts";

export function registerCommands(cli: Argv) {
  cli.command(genCommand);
  cli.command(scanCommand);
  cli.command(auditCommand);
  cli.command(initCommand);
  cli.command(configCommand);
  cli.command(testCommand);
}
