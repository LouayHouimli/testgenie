import type { Argv } from "yargs";
import { consola } from "consola";

export function registerInitCommand(cli: Argv) {
  cli.command(
    "init",
    "Initialize testgenie configuration",
    () => {},
    async () => {
      consola.info("🚀 Initializing testgenie configuration");
      consola.warn("⚠️ Feature not implemented yet");
    }
  );
}
