import type { Argv } from "yargs";
import { consola } from "consola";
import {
  loadConfig,
  findConfigFile,
  validateConfig,
  isInitialized,
} from "../../config/index.js";
import { ArgumentsCamelCase } from "yargs";
import * as yargs from "yargs";

export const configCommand: yargs.CommandModule = {
  command: "config",
  describe: "View and validate testgenie configuration",
  builder: (yargs: Argv) =>
    yargs
      .option("show", {
        alias: "s",
        describe: "Show current configuration",
        type: "boolean",
        default: false,
      })
      .option("validate", {
        alias: "v",
        describe: "Validate configuration file",
        type: "boolean",
        default: false,
      })
      .option("path", {
        alias: "p",
        describe: "Show configuration file path",
        type: "boolean",
        default: false,
      }),
  handler: async (argv: ArgumentsCamelCase<any>) => {
    if (argv.path) {
      await showConfigPath();
    } else if (argv.validate) {
      await validateConfigFile();
    } else {
      await showConfiguration();
    }
  },
};

async function showConfigPath() {
  const configPath = findConfigFile();

  if (configPath) {
    consola.info(`📁 Configuration file: ${configPath}`);
  } else {
    consola.info("📁 No configuration file found");
    consola.info("💡 Run 'testgenie init' to create one");
  }
}

async function validateConfigFile() {
  if (!isInitialized()) {
    consola.warn("⚠️ testgenie is not initialized");
    consola.info("💡 Run 'testgenie init' to create a configuration");
    return;
  }

  const configPath = findConfigFile();

  try {
    const config = await loadConfig();
    const errors = validateConfig(config);

    if (errors.length === 0) {
      consola.success("✅ Configuration is valid");
    } else {
      consola.error("❌ Configuration validation failed:");
      errors.forEach((error) => consola.error(`  • ${error}`));
    }
  } catch (error) {
    consola.error(
      `❌ Failed to load configuration: ${(error as Error).message}`
    );
  }
}

async function showConfiguration() {
  const initialized = isInitialized();
  const configPath = findConfigFile();

  if (!initialized) {
    consola.warn("⚠️ testgenie is not initialized");
    consola.info("");
    consola.info("🚀 To get started:");
    consola.info("   1. Run 'testgenie init' to set up your configuration");
    consola.info("   2. Choose your preferred test framework and AI provider");
    consola.info(
      "   3. Start generating tests with 'testgenie scan' or 'testgenie gen'"
    );
    consola.info("");
    consola.info("💡 testgenie init will guide you through the setup process");
    return;
  }

  if (configPath) {
    consola.info(`📁 Configuration file: ${configPath}`);
  } else {
    consola.info("📝 Using default configuration (no config file found)");
  }

  try {
    const config = await loadConfig();

    consola.info("\n🔧 Current Configuration:");
    consola.info(`  Framework: ${config.framework}`);
    consola.info(`  Style: ${config.style}`);
    consola.info(`  Test Directory: ${config.testDir}`);

    consola.info("\n🤖 AI Configuration:");
    consola.info(`  Provider: ${config.ai.provider}`);
    consola.info(`  Model: ${config.ai.model || "auto"}`);
    if (config.ai.baseUrl) {
      consola.info(`  Base URL: ${config.ai.baseUrl}`);
    }
    consola.info(`  Max Tokens: ${config.ai.maxTokens}`);
    consola.info(`  Temperature: ${config.ai.temperature}`);

    consola.info(`\n📊 Coverage Threshold: ${config.coverage.threshold}%`);

    consola.info("\n📁 File Patterns:");
    consola.info(`  Include: ${config.patterns.include.join(", ")}`);
    consola.info(`  Exclude: ${config.patterns.exclude.join(", ")}`);

    consola.info("\n🎨 Output Settings:");
    consola.info(
      `  Verbose: ${config.output.verbose ? "enabled" : "disabled"}`
    );
    consola.info(`  Colors: ${config.output.colors ? "enabled" : "disabled"}`);
    consola.info(`  Emojis: ${config.output.emojis ? "enabled" : "disabled"}`);

    consola.info("\n🔄 Git Integration:");
    consola.info(
      `  Auto-commit: ${config.git.autoCommit ? "enabled" : "disabled"}`
    );
    consola.info(`  Commit Message: "${config.git.commitMessage}"`);

    if (!configPath) {
      consola.info(
        "\n💡 Run 'testgenie init' to create a customized configuration file"
      );
    }
  } catch (error) {
    consola.error(
      `❌ Failed to load configuration: ${(error as Error).message}`
    );
  }
}
