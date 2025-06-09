import type { TestFramework, TestStyle } from "../types/index.js";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { pathToFileURL } from "url";
import { consola } from "consola";
import fs from "fs-extra";

export type AIProvider = "openai" | "gemini" | "claude" | "testgenie-api";

export interface AIProviderConfig {
  provider: AIProvider;
  apiKey?: string;
  model?: string;
  baseUrl?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface TestgenieConfig {
  framework: TestFramework["name"];
  style: TestStyle["name"];
  testDir: string;
  ai: AIProviderConfig;
  coverage: {
    threshold: number;
    exclude: string[];
  };
  patterns: {
    unitTests: string;
    integrationTests: string;
    e2eTests: string;
    include: string[];
    exclude: string[];
  };
  output: {
    verbose: boolean;
    colors: boolean;
    emojis: boolean;
  };
  git: {
    autoCommit: boolean;
    commitMessage: string;
  };
}

export const defaultConfig: TestgenieConfig = {
  framework: "jest",
  style: "bdd",
  testDir: "__tests__",
  ai: {
    provider: "testgenie-api",
    model: "auto",
    maxTokens: 4000,
    temperature: 0.7,
  },
  coverage: {
    threshold: 80,
    exclude: ["**/*.config.js", "**/migrations/**", "**/node_modules/**"],
  },
  patterns: {
    unitTests: "**/*.test.{js,ts}",
    integrationTests: "**/*.integration.{js,ts}",
    e2eTests: "**/*.e2e.{js,ts}",
    include: ["src/**/*.{js,ts}", "lib/**/*.{js,ts}"],
    exclude: ["**/*.test.*", "**/*.spec.*", "**/node_modules/**"],
  },
  output: {
    verbose: false,
    colors: true,
    emojis: true,
  },
  git: {
    autoCommit: false,
    commitMessage: "feat: add generated tests",
  },
};

const CONFIG_FILE_NAMES = [
  "testgenie.config.js",
  "testgenie.config.mjs",
  "testgenie.config.ts",
  ".testgenierc.js",
  ".testgenierc.json",
];

export const AI_PROVIDERS: Record<
  AIProvider,
  {
    name: string;
    description: string;
    requiresApiKey: boolean;
    defaultModel?: string;
    models?: string[];
    envVar?: string;
  }
> = {
  "testgenie-api": {
    name: "Testgenie API",
    description: "Testgenie's optimized AI service (recommended)",
    requiresApiKey: false,
  },
  openai: {
    name: "OpenAI",
    description: "GPT models from OpenAI",
    requiresApiKey: true,
    defaultModel: "gpt-4",
    models: ["gpt-4", "gpt-4-turbo", "gpt-4o", "gpt-4o-mini", "gpt-3.5-turbo"],
    envVar: "OPENAI_API_KEY",
  },
  gemini: {
    name: "Google Gemini",
    description: "Gemini models from Google AI",
    requiresApiKey: true,
    defaultModel: "gemini-1.5-flash",
    models: [
      "gemini-1.5-flash",
      "gemini-1.5-pro",
      "gemini-pro",
      "gemini-pro-vision",
    ],
    envVar: "GOOGLE_GENERATIVE_AI_API_KEY",
  },
  claude: {
    name: "Anthropic Claude",
    description: "Claude models from Anthropic",
    requiresApiKey: true,
    defaultModel: "claude-3-haiku-20240307",
    models: [
      "claude-3-opus-20240229",
      "claude-3-sonnet-20240229",
      "claude-3-haiku-20240307",
      "claude-3-5-sonnet-20240620",
    ],
    envVar: "ANTHROPIC_API_KEY",
  },
};

export function findConfigFile(cwd: string = process.cwd()): string | null {
  for (const fileName of CONFIG_FILE_NAMES) {
    const filePath = join(cwd, fileName);
    if (existsSync(filePath)) {
      return filePath;
    }
  }
  return null;
}

export function isInitialized(cwd?: string): boolean {
  return findConfigFile(cwd) !== null;
}

export function requireInitialization(commandName: string): void {
  if (!isInitialized()) {
    const { consola } = require("consola");

    consola.error(`❌ testgenie is not initialized`);
    consola.info(`🚀 Please run the following command first:`);
    consola.info(`   testgenie init`);
    consola.info(``);
    consola.info(
      `💡 This will set up your testing preferences, AI provider, and project configuration`
    );
    consola.info(`   Once configured, you can run: testgenie ${commandName}`);

    process.exit(1);
  }
}

async function loadConfigFile(
  configPath: string
): Promise<Partial<TestgenieConfig> | null> {
  try {
    if (!existsSync(configPath)) {
      return null;
    }

    // For ES modules, we need to use dynamic import with file:// protocol on Windows
    const fileUrl = pathToFileURL(configPath).href;
    const configModule = await import(fileUrl);

    // Handle both default export and named export
    const config = configModule.default || configModule;

    if (typeof config === "function") {
      return config();
    }

    return config;
  } catch (error: any) {
    // Don't warn about missing files, only about loading errors
    if (!error.message.includes("Cannot resolve module")) {
      consola.warn(
        `Failed to load config file ${configPath}: ${error.message}`
      );
      consola.info("Using default configuration...");
    }
    return null;
  }
}

export function validateConfig(config: Partial<TestgenieConfig>): string[] {
  const errors: string[] = [];

  if (config.framework && !["jest"].includes(config.framework)) {
    throw new Error(
      `Invalid framework: ${config.framework}. Currently only Jest is supported (Mocha and Vitest coming soon).`
    );
  }

  if (
    config.style &&
    !["bdd", "tdd", "minimal", "verbose"].includes(config.style)
  ) {
    errors.push(
      `Invalid style: ${config.style}. Must be bdd, tdd, minimal, or verbose.`
    );
  }

  if (
    config.ai?.provider &&
    !Object.keys(AI_PROVIDERS).includes(config.ai.provider)
  ) {
    errors.push(
      `Invalid AI provider: ${
        config.ai.provider
      }. Must be one of: ${Object.keys(AI_PROVIDERS).join(", ")}.`
    );
  }

  if (
    config.ai?.provider &&
    AI_PROVIDERS[config.ai.provider]?.requiresApiKey &&
    !config.ai.apiKey
  ) {
    const envVar = AI_PROVIDERS[config.ai.provider].envVar;
    if (!envVar || !process.env[envVar]) {
      errors.push(
        `API key required for ${config.ai.provider}. Set ${envVar} environment variable.`
      );
    }
  }

  if (
    config.coverage?.threshold &&
    (config.coverage.threshold < 0 || config.coverage.threshold > 100)
  ) {
    errors.push("Coverage threshold must be between 0 and 100.");
  }

  return errors;
}

export function mergeConfig(
  base: TestgenieConfig,
  override: Partial<TestgenieConfig>
): TestgenieConfig {
  return {
    ...base,
    ...override,
    ai: {
      ...base.ai,
      ...override.ai,
    },
    coverage: {
      ...base.coverage,
      ...override.coverage,
    },
    patterns: {
      ...base.patterns,
      ...override.patterns,
    },
    output: {
      ...base.output,
      ...override.output,
    },
    git: {
      ...base.git,
      ...override.git,
    },
  };
}

export async function loadConfig(): Promise<TestgenieConfig> {
  const configPath = findConfigFile();

  if (!configPath) {
    return defaultConfig;
  }

  try {
    const fileConfig = await loadConfigFile(configPath);
    const errors = validateConfig(fileConfig || {});

    if (errors.length > 0) {
      consola.warn("Configuration validation errors:");
      errors.forEach((error) => consola.warn(`  - ${error}`));
    }

    return { ...defaultConfig, ...(fileConfig || {}) };
  } catch (error) {
    consola.warn(`Error loading config: ${(error as Error).message}`);
    return defaultConfig;
  }
}

export function getConfigTemplate(): string {
  return `// testgenie.config.js
module.exports = {
  // Test framework to use
  framework: "jest", // "jest" | "vitest" | "mocha"
  
  // Test style preference
  style: "bdd", // "bdd" | "tdd" | "minimal" | "verbose"
  
  // Directory for generated tests
  testDir: "__tests__",
  
  // AI provider configuration
  ai: {
    provider: "testgenie-api", // "testgenie-api" | "openai" | "gemini" | "claude"
    // apiKey: "your-api-key-here", // Required for openai, gemini, claude
    model: "auto", // Model to use (auto-selected if not specified)
    maxTokens: 4000,
    temperature: 0.7,
    // baseUrl: "http://localhost:11434", // For local providers
  },
  
  // Coverage settings
  coverage: {
    threshold: 80,
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
    include: [
      "src/**/*.{js,ts}",
      "lib/**/*.{js,ts}"
    ],
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
    emojis: true
  },
  
  // Git integration
  git: {
    autoCommit: false,
    commitMessage: "feat: add generated tests"
  }
};
`;
}
