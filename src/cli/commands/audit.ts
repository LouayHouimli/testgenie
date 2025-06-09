import type { Argv } from "yargs";
import { consola } from "consola";
import { loadConfig, requireInitialization } from "../../config/index.js";
import { ArgumentsCamelCase } from "yargs";
import * as yargs from "yargs";

export const auditCommand: yargs.CommandModule = {
  command: "audit [path]",
  describe: "Audit test coverage and quality",
  builder: (yargs: Argv) =>
    yargs
      .positional("path", {
        describe: "Path to audit",
        type: "string",
        default: ".",
      })
      .option("fix", {
        alias: "f",
        describe: "Auto-fix issues where possible",
        type: "boolean",
        default: false,
      })
      .option("format", {
        describe: "Output format",
        choices: ["json", "text", "html"] as const,
        default: "text" as const,
      }),
  handler: async (argv: ArgumentsCamelCase<any>) => {
    requireInitialization("audit");

    const config = await loadConfig();

    consola.info(`📊 Auditing: ${argv.path}`);
    if (argv.deep) {
      consola.info("🔬 Mode: Deep analysis");
    }

    consola.info(`🎯 Coverage threshold: ${config.coverage.threshold}%`);
    consola.info(`📂 Test directory: ${config.testDir}`);

    try {
      const { CodeParser } = await import("../../core/parser/index.ts");
      const parser = new CodeParser();

      const { sourceFiles, testFiles } = await parser.discoverFiles(argv.path);

      // Basic audit functionality
      const results = await performAudit(
        sourceFiles,
        testFiles,
        config,
        argv.deep as boolean
      );

      if (argv.json) {
        console.log(JSON.stringify(results, null, 2));
      } else {
        displayAuditResults(results, config);
      }
    } catch (error) {
      consola.error("❌ Audit failed:", error);
      process.exit(1);
    }
  },
};

async function performAudit(
  sourceFiles: string[],
  testFiles: string[],
  config: any,
  deep: boolean
) {
  const { getTestFilePath } = await import("../../utils/index.ts");

  const untested = sourceFiles.filter((sourceFile) => {
    const expectedTestFile = getTestFilePath(sourceFile, config.testDir);
    return !testFiles.some(
      (testFile) =>
        testFile.includes(expectedTestFile) ||
        expectedTestFile.includes(testFile)
    );
  });

  const tested = sourceFiles.filter(
    (sourceFile) => !untested.includes(sourceFile)
  );
  const coverage =
    sourceFiles.length > 0
      ? ((tested.length / sourceFiles.length) * 100).toFixed(1)
      : 0;

  const issues = [];

  // Check coverage threshold
  if (Number(coverage) < config.coverage.threshold) {
    issues.push({
      type: "coverage",
      severity: "warning",
      message: `Coverage ${coverage}% below threshold ${config.coverage.threshold}%`,
      files: untested.slice(0, 10),
    });
  }

  // Check for outdated tests (if deep analysis)
  let outdatedTests = [];
  if (deep) {
    const { stat } = await import("fs-extra");

    for (const sourceFile of tested) {
      try {
        const testFile = getTestFilePath(sourceFile, config.testDir);
        const matchingTest = testFiles.find(
          (tf) => tf.includes(testFile) || testFile.includes(tf)
        );

        if (matchingTest) {
          const sourceStat = await stat(sourceFile);
          const testStat = await stat(matchingTest);

          if (sourceStat.mtime > testStat.mtime) {
            outdatedTests.push({
              source: sourceFile,
              test: matchingTest,
              sourceModified: sourceStat.mtime,
              testModified: testStat.mtime,
            });
          }
        }
      } catch (error) {
        // Ignore file stat errors
      }
    }

    if (outdatedTests.length > 0) {
      issues.push({
        type: "outdated",
        severity: "info",
        message: `${outdatedTests.length} test files are older than source files`,
        files: outdatedTests.map((ot) => ot.test),
      });
    }
  }

  return {
    summary: {
      totalFiles: sourceFiles.length,
      testedFiles: tested.length,
      untestedFiles: untested.length,
      coverage: Number(coverage),
      threshold: config.coverage.threshold,
      meetsThreshold: Number(coverage) >= config.coverage.threshold,
    },
    untested,
    tested,
    outdatedTests,
    issues,
    recommendations: generateRecommendations(issues, untested, config),
  };
}

function generateRecommendations(
  issues: any[],
  untested: string[],
  config: any
) {
  const recommendations = [];

  if (untested.length > 0) {
    recommendations.push({
      type: "generate-tests",
      message: `Generate tests for ${untested.length} untested files`,
      command:
        untested.length === 1
          ? `testgenie gen ${untested[0]}`
          : "testgenie gen <file>",
      files: untested.slice(0, 5),
    });
  }

  const coverageIssue = issues.find((i) => i.type === "coverage");
  if (coverageIssue) {
    recommendations.push({
      type: "improve-coverage",
      message: "Focus on testing these high-priority files first",
      files: untested
        .filter((file) => !file.includes("utils") && !file.includes("helpers"))
        .slice(0, 3),
    });
  }

  const outdatedIssue = issues.find((i) => i.type === "outdated");
  if (outdatedIssue) {
    recommendations.push({
      type: "update-tests",
      message: "Review and update outdated tests",
      command: "testgenie gen --diff",
    });
  }

  return recommendations;
}

function displayAuditResults(results: any, config: any) {
  const { summary, issues, recommendations } = results;

  consola.info("\n📊 Test Coverage Summary:");
  consola.info(`  Total files: ${summary.totalFiles}`);
  consola.info(`  Tested files: ${summary.testedFiles}`);
  consola.info(`  Untested files: ${summary.untestedFiles}`);
  consola.info(`  Coverage: ${summary.coverage}%`);

  if (summary.meetsThreshold) {
    consola.success(`✅ Coverage meets threshold (${summary.threshold}%)`);
  } else {
    consola.warn(`⚠️ Coverage below threshold (${summary.threshold}%)`);
  }

  if (issues.length > 0) {
    consola.info("\n🔍 Issues Found:");
    issues.forEach((issue, index) => {
      const icon = issue.severity === "warning" ? "⚠️" : "ℹ️";
      consola.info(`  ${icon} ${issue.message}`);

      if (issue.files && issue.files.length > 0) {
        issue.files.slice(0, 3).forEach((file: string) => {
          consola.info(`    - ${file}`);
        });
        if (issue.files.length > 3) {
          consola.info(`    ... and ${issue.files.length - 3} more`);
        }
      }
    });
  } else {
    consola.success("✅ No issues found!");
  }

  if (recommendations.length > 0) {
    consola.info("\n💡 Recommendations:");
    recommendations.forEach((rec) => {
      consola.info(`  📋 ${rec.message}`);
      if (rec.command) {
        consola.info(`     Command: ${rec.command}`);
      }
      if (rec.files && rec.files.length > 0) {
        rec.files.forEach((file: string) => {
          consola.info(`     - ${file}`);
        });
      }
    });
  }

  consola.info("\n🚀 Next steps:");
  if (summary.untestedFiles > 0) {
    consola.info("  1. Run 'testgenie gen <file>' for priority files");
    consola.info("  2. Run 'testgenie scan' to see all files needing tests");
  } else {
    consola.info(
      "  1. Consider running 'testgenie gen --diff' after code changes"
    );
    consola.info("  2. Keep up the great testing work! 🎉");
  }
}
