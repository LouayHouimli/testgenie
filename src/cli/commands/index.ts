import type { Argv } from "yargs";
import { registerGenCommand } from "./gen.ts";
import { registerScanCommand } from "./scan.ts";
import { registerAuditCommand } from "./audit.ts";
import { registerInitCommand } from "./init.ts";

export function registerCommands(cli: Argv) {
  registerGenCommand(cli);
  registerScanCommand(cli);
  registerAuditCommand(cli);
  registerInitCommand(cli);
}
