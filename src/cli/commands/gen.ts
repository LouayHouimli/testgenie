import type { Argv } from "yargs";
import { consola } from "consola";

export function registerGenCommand(cli: Argv) {
  cli.command(
    "gen <file>",
    "Generate tests for a specific file",
    (yargs) => {
      return yargs
        .positional("file", {
          describe: "Path to the file to generate tests for",
          type: "string",
          demandOption: true,
        })
        .option("framework", {
          alias: "f",
          describe: "Testing framework to use",
          choices: ["jest", "vitest", "mocha"],
          default: "jest",
        })
        .option("style", {
          alias: "s",
          describe: "Test style to generate",
          choices: ["bdd", "tdd", "minimal", "verbose"],
          default: "bdd",
        });
    },
    async (argv) => {
      consola.info(`🧪 Generating tests for: ${argv.file}`);
      consola.info(`📋 Framework: ${argv.framework}`);
      consola.info(`🎨 Style: ${argv.style}`);
      consola.warn("⚠️ Feature not implemented yet");
    }
  );
}
