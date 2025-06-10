import type { Argv } from "yargs";
import { consola } from "consola";
import { loadConfig, requireInitialization } from "../../config/index.js";
import { ArgumentsCamelCase } from "yargs";
import * as yargs from "yargs";

export const testCommand: yargs.CommandModule = {
  command: "test [pattern]",
  describe: "Execute tests in the configured test directory",
  builder: (yargs: Argv) =>
    yargs
      .positional("pattern", {
        describe: "Test file pattern to run (optional)",
        type: "string",
      })
      .option("watch", {
        alias: "w",
        describe: "Watch mode for continuous testing",
        type: "boolean",
        default: false,
      })
      .option("coverage", {
        alias: "c",
        describe: "Generate coverage reports",
        type: "boolean",
        default: false,
      })
      .option("reporter", {
        alias: "r",
        describe: "Test reporter format",
        choices: ["default", "json", "verbose", "minimal"] as const,
        default: "default" as const,
      })
      .option("filter", {
        alias: "f",
        describe: "Filter tests by name pattern",
        type: "string",
      })
      .option("parallel", {
        alias: "p",
        describe: "Run tests in parallel",
        type: "boolean",
        default: true,
      })
      .option("bail", {
        alias: "b",
        describe: "Stop on first test failure",
        type: "boolean",
        default: false,
      })
      .option("silent", {
        alias: "s",
        describe: "Suppress test output (show only results)",
        type: "boolean",
        default: false,
      })
      .option("timeout", {
        alias: "t",
        describe: "Test timeout in milliseconds",
        type: "number",
        default: 30000,
      }),
  handler: async (argv: ArgumentsCamelCase<any>) => {
    requireInitialization("test");

    const config = await loadConfig();

    if (!argv.silent) {
      consola.info(`🧪 Running tests with ${config.framework}`);
      consola.info(`📂 Test directory: ${config.testDir}`);

      if (argv.pattern) {
        consola.info(`🎯 Pattern: ${argv.pattern}`);
      }

      if (argv.watch) {
        consola.info("👀 Watch mode enabled");
      }

      if (argv.coverage) {
        consola.info("📊 Coverage reporting enabled");
      }
    }

    try {
      await ensureTestSetup(config.framework, !argv.silent);

      const testRunner = await createTestRunner(config.framework);
      const testOptions = {
        testDir: config.testDir,
        pattern: argv.pattern,
        watch: argv.watch,
        coverage: argv.coverage,
        reporter: argv.reporter,
        filter: argv.filter,
        parallel: argv.parallel,
        bail: argv.bail,
        silent: argv.silent,
        timeout: argv.timeout,
        config,
      };

      const results = await testRunner.run(testOptions);

      if (!argv.silent) {
        displayTestResults(results, argv.reporter);
      }

      if (results.failed > 0 && !argv.watch) {
        process.exit(1);
      }
    } catch (error) {
      consola.error("❌ Test execution failed:", error);
      process.exit(1);
    }
  },
};

async function createTestRunner(framework: string) {
  switch (framework) {
    case "jest":
      return new JestTestRunner();
    case "mocha":
      throw new Error("Mocha support coming soon!");
    case "vitest":
      throw new Error("Vitest support coming soon!");
    default:
      throw new Error(`Unsupported test framework: ${framework}`);
  }
}

async function ensureTestSetup(framework: string, verbose: boolean = true) {
  if (framework !== "jest") {
    return;
  }

  const { existsSync, readdir, readFile } = await import("fs-extra");
  const { writeFile } = await import("fs-extra");
  const { checkDependencies } = await import("../../utils/index.ts");
  const path = require("path");

  const jestConfigPath = path.join(process.cwd(), "jest.config.js");
  const packageJsonPath = path.join(process.cwd(), "package.json");

  if (verbose) {
    consola.info("🔍 Checking test setup...");
  }

  const hasReactTests = await detectReactTests();

  let requiredDeps = [
    "jest",
    "@jest/globals",
    "@types/jest",
    "ts-jest",
    "@babel/preset-env",
    "babel-jest",
  ];

  if (hasReactTests) {
    requiredDeps = requiredDeps.concat([
      "@babel/preset-react",
      "@testing-library/react",
      "@testing-library/jest-dom",
      "jest-environment-jsdom",
      "react",
      "react-dom",
    ]);
  }

  const depCheck = await checkDependencies(requiredDeps);

  if (depCheck.missing.length > 0) {
    if (verbose) {
      consola.info(
        `📦 Installing missing test dependencies: ${depCheck.missing.join(
          ", "
        )}`
      );
      if (hasReactTests) {
        consola.info(
          "🔍 Detected React/JSX tests - including React testing libraries"
        );
      }
      consola.start("Installing dependencies...");
    }

    try {
      const { execa } = await import("execa");

      const packageManager = depCheck.packageManager;
      const installCommand =
        packageManager === "yarn"
          ? ["yarn", "add", "--dev", ...depCheck.missing]
          : packageManager === "pnpm"
          ? ["pnpm", "add", "--save-dev", ...depCheck.missing]
          : packageManager === "bun"
          ? ["bun", "add", "--dev", ...depCheck.missing]
          : ["npm", "install", "--save-dev", ...depCheck.missing];

      await execa(installCommand[0], installCommand.slice(1), {
        stdio: verbose ? "inherit" : "pipe",
        cwd: process.cwd(),
      });

      if (verbose) {
        consola.success("✅ Dependencies installed successfully");
      }
    } catch (error) {
      throw new Error(`Failed to install dependencies: ${error}`);
    }
  } else if (verbose) {
    consola.success("✅ All test dependencies are installed");
  }

  if (!existsSync(jestConfigPath)) {
    if (verbose) {
      consola.info("⚙️ Creating Jest configuration...");
      if (hasReactTests) {
        consola.info("🔧 Configuring Jest for React/JSX support");
      }
    }

    const jestConfig = createJestConfig(hasReactTests);

    try {
      await writeFile(jestConfigPath, jestConfig, "utf8");
      if (verbose) {
        consola.success("✅ Jest configuration created successfully");
      }
    } catch (error) {
      throw new Error(`Failed to create Jest configuration: ${error}`);
    }
  } else if (verbose) {
    consola.success("✅ Jest configuration found");
  }
}

async function detectReactTests(): Promise<boolean> {
  try {
    const { globby } = await import("globby");
    const { readFile } = await import("fs-extra");

    const testFiles = await globby([
      "**/__tests__/**/*.(test|spec).(js|ts|jsx|tsx)",
      "**/*.(test|spec).(js|ts|jsx|tsx)",
    ]);

    for (const testFile of testFiles) {
      try {
        const content = await readFile(testFile, "utf-8");
        if (
          content.includes("render(") &&
          content.includes("<") &&
          content.includes("/>")
        ) {
          return true;
        }
        if (content.includes("import") && content.includes("react")) {
          return true;
        }
        if (testFile.includes(".jsx") || testFile.includes(".tsx")) {
          return true;
        }
      } catch (error) {
        continue;
      }
    }

    return false;
  } catch (error) {
    return false;
  }
}

function createJestConfig(hasReactSupport: boolean): string {
  const reactPresets = hasReactSupport
    ? `['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-react'`
    : `['@babel/preset-env', { targets: { node: 'current' } }]`;

  const testEnvironment = hasReactSupport ? "jsdom" : "node";

  const setupFilesAfterEnv = hasReactSupport
    ? `  setupFilesAfterEnv: ['@testing-library/jest-dom'],`
    : `  setupFilesAfterEnv: [],`;

  return `export default {
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  testEnvironment: '${testEnvironment}',
  testMatch: ['**/__tests__/**/*.(test|spec).(js|ts|tsx|jsx)'],
  transform: {
    '^.+\\\\.tsx?$': ['ts-jest', {
      useESM: true,
      isolatedModules: true,
    }],
    '^.+\\\\.jsx?$': ['babel-jest', { presets: [${reactPresets}] }],
  },
  moduleNameMapper: {
    '^(\\\\.{1,2}/.*)\\\\.js$': '$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts',
    '!src/**/*.test.{ts,tsx,js,jsx}',
    '!src/**/*.spec.{ts,tsx,js,jsx}',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
${setupFilesAfterEnv}
  testTimeout: 30000,
  verbose: false,
  bail: false,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};`;
}

class JestTestRunner {
  async run(options: any) {
    const { execa } = await import("execa");

    const args = ["jest"];

    if (options.pattern) {
      args.push(options.pattern);
    } else {
      args.push(options.testDir);
    }

    if (options.watch) {
      args.push("--watch");
    }

    if (options.coverage) {
      args.push("--coverage");
    }

    if (options.filter) {
      args.push("--testNamePattern", options.filter);
    }

    if (options.parallel) {
      args.push("--runInBand=false");
    } else {
      args.push("--runInBand");
    }

    if (options.bail) {
      args.push("--bail");
    }

    if (options.silent) {
      args.push("--silent");
    }

    args.push("--testTimeout", options.timeout.toString());

    switch (options.reporter) {
      case "json":
        args.push("--json");
        break;
      case "verbose":
        args.push("--verbose");
        break;
      case "minimal":
        args.push("--silent");
        break;
    }

    args.push("--passWithNoTests");

    if (!options.silent) {
      consola.start("🏃 Executing tests...");
    }

    try {
      const result = await execa("npx", args, {
        stdio: options.silent ? "pipe" : "inherit",
        cwd: process.cwd(),
      });

      const testResults = this.parseJestOutput(
        result.stdout || "",
        options.reporter
      );

      if (!options.silent) {
        consola.success("✅ Tests completed successfully");
      }

      return testResults;
    } catch (error: any) {
      if (error.stdout && options.reporter === "json") {
        const testResults = this.parseJestOutput(
          error.stdout,
          options.reporter
        );
        return testResults;
      }

      if (!options.silent) {
        consola.error("❌ Some tests failed");
      }

      return {
        total: 0,
        passed: 0,
        failed: error.exitCode || 1,
        skipped: 0,
        duration: 0,
        coverage: null,
      };
    }
  }

  private parseJestOutput(output: string, reporter: string) {
    if (reporter === "json" && output.trim()) {
      try {
        const jsonOutput = JSON.parse(output);
        return {
          total: jsonOutput.numTotalTests || 0,
          passed: jsonOutput.numPassedTests || 0,
          failed: jsonOutput.numFailedTests || 0,
          skipped: jsonOutput.numPendingTests || 0,
          duration:
            jsonOutput.testResults?.reduce(
              (acc: number, test: any) => acc + (test.perfStats?.runtime || 0),
              0
            ) || 0,
          coverage: jsonOutput.coverageMap || null,
        };
      } catch (error) {
        consola.warn("⚠️ Failed to parse Jest JSON output");
      }
    }

    const lines = output.split("\n");
    let total = 0,
      passed = 0,
      failed = 0,
      skipped = 0;

    for (const line of lines) {
      if (line.includes("Tests:")) {
        const match = line.match(
          /(\d+)\s+passed.*?(\d+)\s+failed.*?(\d+)\s+total/
        );
        if (match) {
          passed = parseInt(match[1], 10);
          failed = parseInt(match[2], 10);
          total = parseInt(match[3], 10);
        }
      }
    }

    return {
      total,
      passed,
      failed,
      skipped,
      duration: 0,
      coverage: null,
    };
  }
}

function displayTestResults(results: any, reporter: string) {
  if (reporter === "json") {
    console.log(JSON.stringify(results, null, 2));
    return;
  }

  consola.info("\n📊 Test Results Summary:");
  consola.info(`  Total tests: ${results.total}`);

  if (results.passed > 0) {
    consola.success(`  ✅ Passed: ${results.passed}`);
  }

  if (results.failed > 0) {
    consola.error(`  ❌ Failed: ${results.failed}`);
  }

  if (results.skipped > 0) {
    consola.warn(`  ⏭️ Skipped: ${results.skipped}`);
  }

  if (results.duration > 0) {
    consola.info(`  ⏱️ Duration: ${(results.duration / 1000).toFixed(2)}s`);
  }

  if (results.coverage) {
    consola.info("\n📈 Coverage information available");
    consola.info("💡 Check coverage reports for detailed analysis");
  }

  if (results.failed === 0 && results.total > 0) {
    consola.success("\n🎉 All tests passed!");
  } else if (results.failed > 0) {
    consola.warn(`\n⚠️ ${results.failed} test(s) failed`);
    consola.info("💡 Run with --verbose for detailed output");
  } else if (results.total === 0) {
    consola.warn("\n⚠️ No tests found");
    consola.info("💡 Run 'testgenie scan' to identify files needing tests");
    consola.info("💡 Run 'testgenie gen <file>' to generate tests");
  }
}
