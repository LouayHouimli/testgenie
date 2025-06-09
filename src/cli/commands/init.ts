import type { Argv } from "yargs";
import { consola } from "consola";
import { writeFileSync, existsSync } from "fs";
import { join } from "path";
import {
  intro,
  text,
  select,
  confirm,
  multiselect,
  outro,
  cancel,
  isCancel,
} from "@clack/prompts";
import {
  getConfigTemplate,
  findConfigFile,
  AI_PROVIDERS,
  type AIProvider,
} from "../../config/index.js";
import { ArgumentsCamelCase } from "yargs";
import * as yargs from "yargs";

export const initCommand: yargs.CommandModule = {
  command: "init",
  describe: "Initialize testgenie configuration",
  builder: (yargs: Argv) =>
    yargs.option("force", {
      alias: "f",
      type: "boolean",
      description: "Overwrite existing config file",
      default: false,
    }),
  handler: async (argv: ArgumentsCamelCase<any>) => {
    await initConfiguration(argv.force as boolean);
  },
};

async function initConfiguration(force: boolean = false) {
  intro("🚀 Welcome to testgenie setup!");

  const existingConfigPath = findConfigFile();
  if (existingConfigPath && !force) {
    consola.info(`📁 Found existing config: ${existingConfigPath}`);
    const overwrite = await confirm({
      message: "Do you want to overwrite the existing configuration?",
    });

    if (isCancel(overwrite) || !overwrite) {
      cancel("Configuration setup cancelled.");
      return;
    }
  }

  const framework = await select({
    message: "🧪 Test framework (Jest only for now)",
    options: [{ value: "jest", label: "Jest (Currently supported)" }],
  });

  if (isCancel(framework)) {
    cancel("Configuration setup cancelled.");
    return;
  }

  consola.info("ℹ️ Note: Mocha and Vitest support coming soon!");

  const style = await select({
    message: "📝 What test style do you prefer?",
    options: [
      { value: "bdd", label: "BDD (describe/it blocks)" },
      { value: "tdd", label: "TDD (suite/test blocks)" },
      { value: "minimal", label: "Minimal (concise tests)" },
      { value: "verbose", label: "Verbose (detailed descriptions)" },
    ],
  });

  if (isCancel(style)) {
    cancel("Configuration setup cancelled.");
    return;
  }

  const testDir = await text({
    message: "📂 Where should tests be generated?",
    placeholder: "__tests__",
    defaultValue: "__tests__",
  });

  if (isCancel(testDir)) {
    cancel("Configuration setup cancelled.");
    return;
  }

  const aiProvider = await select({
    message: "🤖 Which AI provider do you want to use?",
    options: [
      {
        value: "testgenie-api",
        label: "🌟 Testgenie API (Recommended)",
        hint: "No API key needed, optimized for testing",
      },
      {
        value: "openai",
        label: "🟢 OpenAI (GPT models)",
        hint: "requires OPENAI_API_KEY env var",
      },
      {
        value: "gemini",
        label: "🔵 Google Gemini",
        hint: "requires GOOGLE_GENERATIVE_AI_API_KEY env var",
      },
      {
        value: "claude",
        label: "🟠 Anthropic Claude",
        hint: "requires ANTHROPIC_API_KEY env var",
      },
    ],
  });

  if (isCancel(aiProvider)) {
    cancel("Configuration setup cancelled.");
    return;
  }

  const providerInfo = AI_PROVIDERS[aiProvider as AIProvider];
  let model: string | symbol | undefined;

  if (providerInfo.models && providerInfo.models.length > 1) {
    model = await select({
      message: `🎯 Which ${providerInfo.name} model do you prefer?`,
      options: [
        { value: "auto", label: "Auto (recommended model)" },
        ...providerInfo.models.map((m) => ({ value: m, label: m })),
      ],
    });

    if (isCancel(model)) {
      cancel("Configuration setup cancelled.");
      return;
    }
  }

  const includePatterns = await multiselect({
    message: "📁 Which directories should be scanned for source files?",
    options: [
      {
        value: "src/**/*.{js,ts}",
        label: "src/ directory",
        hint: "recommended",
      },
      { value: "lib/**/*.{js,ts}", label: "lib/ directory" },
      { value: "app/**/*.{js,ts}", label: "app/ directory" },
      { value: "components/**/*.{js,ts}", label: "components/ directory" },
      { value: "utils/**/*.{js,ts}", label: "utils/ directory" },
    ],
    required: false,
  });

  if (isCancel(includePatterns)) {
    cancel("Configuration setup cancelled.");
    return;
  }

  const coverageThreshold = await text({
    message: "📊 What coverage threshold do you want? (0-100)",
    placeholder: "80",
    defaultValue: "80",
    validate: (value: string) => {
      const num = parseInt(value);
      if (isNaN(num) || num < 0 || num > 100) {
        return "Please enter a number between 0 and 100";
      }
    },
  });

  if (isCancel(coverageThreshold)) {
    cancel("Configuration setup cancelled.");
    return;
  }

  const enableEmojis = await confirm({
    message: "😊 Enable emojis in output?",
  });

  if (isCancel(enableEmojis)) {
    cancel("Configuration setup cancelled.");
    return;
  }

  const gitIntegration = await confirm({
    message: "🔄 Enable auto-commit of generated tests?",
  });

  if (isCancel(gitIntegration)) {
    cancel("Configuration setup cancelled.");
    return;
  }

  const config = generateConfigContent({
    framework: framework as string,
    style: style as string,
    testDir: testDir as string,
    aiProvider: aiProvider as AIProvider,
    model: model as string,
    includePatterns: includePatterns as string[],
    coverageThreshold: parseInt(coverageThreshold as string),
    enableEmojis: enableEmojis as boolean,
    gitIntegration: gitIntegration as boolean,
  });

  const configPath = join(process.cwd(), "testgenie.config.js");

  try {
    writeFileSync(configPath, config, "utf-8");
    outro("✅ Configuration saved to testgenie.config.js");

    consola.success("🎉 testgenie is now configured!");
    consola.info("📝 You can edit testgenie.config.js to customize further");

    if (providerInfo.requiresApiKey) {
      consola.warn(
        `⚠️  Don't forget to set your ${providerInfo.envVar} environment variable`
      );
    }

    if (aiProvider === "testgenie-api") {
      consola.info("🌟 You're using testgenie-api - no setup required!");
      consola.info(
        "💡 This will be our global service with the best models optimized for testing"
      );
    }

    consola.info("🚀 Try running: testgenie scan");
  } catch (error) {
    consola.error(
      `❌ Failed to save configuration: ${(error as Error).message}`
    );
    process.exit(1);
  }
}

function generateConfigContent(options: {
  framework: string;
  style: string;
  testDir: string;
  aiProvider: AIProvider;
  model?: string;
  includePatterns: string[];
  coverageThreshold: number;
  enableEmojis: boolean;
  gitIntegration: boolean;
}): string {
  const {
    framework,
    style,
    testDir,
    aiProvider,
    model,
    includePatterns,
    coverageThreshold,
    enableEmojis,
    gitIntegration,
  } = options;

  const finalIncludePatterns =
    includePatterns.length > 0
      ? includePatterns
      : ["src/**/*.{js,ts}", "lib/**/*.{js,ts}"];

  const providerInfo = AI_PROVIDERS[aiProvider];
  const finalModel = model || providerInfo.defaultModel || "auto";

  return `// testgenie.config.js
export default {
  // Test framework to use
  framework: "${framework}",
  
  // Test style preference
  style: "${style}",
  
  // Directory for generated tests
  testDir: "${testDir}",
  
  // AI provider configuration
  ai: {
    provider: "${aiProvider}",
    model: "${finalModel}",
    maxTokens: 4000,
    temperature: 0.7,
  },
  
  // Coverage settings
  coverage: {
    threshold: ${coverageThreshold},
    exclude: [
      "**/*.config.js",
      "**/migrations/**",
      "**/node_modules/**"
    ]
  },
  
  // File patterns
  patterns: {
    unitTests: "**/*.test.{js,ts}",
    integrationTests: "**/*.integration.{js,ts}",
    e2eTests: "**/*.e2e.{js,ts}",
    include: ${JSON.stringify(finalIncludePatterns, null, 6)},
    exclude: [
      "**/*.test.*",
      "**/*.spec.*",
      "**/node_modules/**"
    ]
  },
  
  // Output preferences
  output: {
    verbose: false,
    colors: true,
    emojis: ${enableEmojis}
  },
  
  // Git integration
  git: {
    autoCommit: ${gitIntegration},
    commitMessage: "feat: add generated tests"
  }
};
`;
}
