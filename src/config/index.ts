import type { TestFramework, TestStyle } from "../types/index.js";

export interface TestgenieConfig {
  framework: TestFramework["name"];
  style: TestStyle["name"];
  testDir: string;
  aiProvider: "openai" | "anthropic" | "local";
  coverage: {
    threshold: number;
    exclude: string[];
  };
  patterns: {
    unitTests: string;
    integrationTests: string;
    e2eTests: string;
  };
}

export const defaultConfig: TestgenieConfig = {
  framework: "jest",
  style: "bdd",
  testDir: "__tests__",
  aiProvider: "openai",
  coverage: {
    threshold: 80,
    exclude: ["**/*.config.js", "**/migrations/**"],
  },
  patterns: {
    unitTests: "**/*.test.js",
    integrationTests: "**/*.integration.js",
    e2eTests: "**/*.e2e.js",
  },
};

export function loadConfig(): TestgenieConfig {
  return defaultConfig;
}
