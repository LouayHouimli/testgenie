import { Argv, ArgumentsCamelCase } from "yargs";
import { consola } from "consola";
import { globby } from "globby";
import * as yargs from "yargs";
import { loadConfig, requireInitialization } from "../../config/index.js";

export const scanCommand: yargs.CommandModule = {
  command: "scan [path]",
  describe: "Analyze code patterns and suggest test improvements",
  builder: (yargs: Argv) =>
    yargs
      .positional("path", {
        describe: "File or directory path to scan",
        type: "string",
        default: ".",
      })
      .option("type", {
        alias: "t",
        describe: "Scan type",
        choices: ["coverage", "patterns", "quality"] as const,
        default: "patterns" as const,
      })
      .option("depth", {
        alias: "d",
        describe: "Analysis depth",
        choices: ["shallow", "deep"] as const,
        default: "shallow" as const,
      })
      .option("diff", {
        alias: "d",
        describe: "Scan only git changes",
        type: "boolean",
        default: false,
      })
      .option("since", {
        alias: "s",
        describe: "Scan changes since commit",
        type: "string",
      })
      .option("verbose", {
        alias: "v",
        describe: "Show detailed output",
        type: "boolean",
      })
      .option("output", {
        alias: "o",
        describe: "Save results to file",
        type: "string",
      })
      .option("format", {
        alias: "f",
        describe: "Output format",
        choices: ["json", "csv", "text"] as const,
        default: "text" as const,
      }),
  handler: async (argv: ArgumentsCamelCase<any>) => {
    requireInitialization("scan");

    const config = await loadConfig();
    const { CodeParser } = await import("../../core/parser/index.ts");
    const { GitManager } = await import("../../core/git/index.ts");

    const parser = new CodeParser();
    const git = new GitManager(argv.path === "." ? undefined : argv.path);

    const verbose =
      argv.verbose !== undefined ? argv.verbose : config.output.verbose;

    if (verbose) {
      consola.info("🔧 Using configuration:");
      consola.info(`  Framework: ${config.framework}`);
      consola.info(`  Style: ${config.style}`);
      consola.info(`  Test Directory: ${config.testDir}`);
      consola.info(`  AI Provider: ${config.ai.provider}`);
    }

    if (argv.diff || argv.since) {
      try {
        const isRepo = await git.isGitRepository();
        if (!isRepo) {
          consola.error("❌ Not a git repository");
          return;
        }

        consola.info("🔍 Git Repository Analysis");

        const branch = await git.getCurrentBranch();
        const commits = await git.getRecentCommits(3);

        consola.info(`📍 Current branch: ${branch}`);
        consola.info("📝 Recent commits:");
        commits.forEach((commit) => consola.info(`  ${commit}`));

        let diffInfo;
        if (argv.since) {
          consola.info(`⏰ Analyzing changes since: ${argv.since}`);
          diffInfo = await git.getDiffSince(argv.since);
        } else if (argv.diff) {
          consola.info("📝 Analyzing uncommitted changes");
          diffInfo = await git.getUncommittedDiff();
        }

        if (diffInfo) {
          const gitResults = {
            type: "git-analysis",
            branch,
            commits: commits.slice(0, 3),
            summary: {
              totalFiles: diffInfo.totalFiles,
              codeFiles: diffInfo.codeFiles,
            },
            changes: diffInfo.changes,
          };

          if (argv.output) {
            await saveResults(gitResults, argv.output, argv.format);
            consola.success(`📁 Results saved to: ${argv.output}`);
          }

          consola.info(`\n📊 Changes Summary:`);
          consola.info(`  Total files: ${diffInfo.totalFiles}`);
          consola.info(`  Code files: ${diffInfo.codeFiles}`);

          if (diffInfo.changes.length > 0) {
            consola.info("\n📋 Changed files:");
            diffInfo.changes.forEach((change) => {
              const icon =
                change.status === "added"
                  ? "🆕"
                  : change.status === "modified"
                  ? "📝"
                  : change.status === "deleted"
                  ? "🗑️"
                  : "📦";
              const staged = change.staged ? " (staged)" : "";
              consola.info(
                `  ${icon} ${change.file} [${change.status}]${staged}`
              );
            });

            const { isSourceFile } = await import("../../utils/index.ts");
            const codeChanges = diffInfo.changes.filter(
              (change) =>
                isSourceFile(change.file) &&
                !isExcludedFile(change.file, config.patterns.exclude)
            );

            if (codeChanges.length > 0) {
              consola.info(
                `\n🎯 ${codeChanges.length} code files need test analysis`
              );

              for (const change of codeChanges.slice(0, 3)) {
                if (change.status !== "deleted") {
                  try {
                    const parsed = await parser.parseFile(change.file);
                    if (parsed.functions.length > 0) {
                      consola.info(`\n📄 ${change.file}:`);
                      parsed.functions.forEach((fn) => {
                        const async = fn.isAsync ? " (async)" : "";
                        const exported = fn.isExported ? " (exported)" : "";
                        consola.info(
                          `  🔧 ${fn.name}(${fn.params.join(
                            ", "
                          )})${async}${exported}`
                        );
                      });
                    }
                  } catch (error) {
                    consola.warn(`⚠️ Could not parse ${change.file}: ${error}`);
                  }
                }
              }

              if (codeChanges.length > 3) {
                consola.info(
                  `\n... and ${codeChanges.length - 3} more code files`
                );
              }

              consola.info(`\n💡 To generate tests for these changes, run:`);
              consola.info(`   testgenie gen --diff`);
            }
          } else {
            consola.info("✨ No changes detected");
          }
        }
        return;
      } catch (error) {
        consola.error("❌ Git analysis failed:", error);
        return;
      }
    }

    consola.info(`🔍 Scanning: ${argv.path}`);

    try {
      const { sourceFiles, testFiles } = await parser.discoverFiles(argv.path);

      consola.info(`📁 Found ${sourceFiles.length} source files`);
      consola.info(`🧪 Found ${testFiles.length} test files`);

      const untested = sourceFiles.filter((sourceFile) => {
        const { getTestFilePath } = require("../../utils/index.ts");
        const expectedTestFile = getTestFilePath(sourceFile, config.testDir);
        return !testFiles.some(
          (testFile) =>
            testFile.includes(expectedTestFile) ||
            expectedTestFile.includes(testFile)
        );
      });

      const coverage =
        sourceFiles.length > 0
          ? (
              ((sourceFiles.length - untested.length) / sourceFiles.length) *
              100
            ).toFixed(1)
          : 0;

      const scanResults = {
        type: "scan",
        path: argv.path,
        summary: {
          totalSourceFiles: sourceFiles.length,
          totalTestFiles: testFiles.length,
          coverage: Number(coverage),
          threshold: config.coverage.threshold,
          untestedFiles: untested.length,
        },
        sourceFiles,
        testFiles,
        untestedFiles: untested,
        timestamp: new Date().toISOString(),
      };

      if (argv.output) {
        await saveResults(scanResults, argv.output, argv.format);
        consola.success(`📁 Results saved to: ${argv.output}`);
      }

      consola.info(
        `📊 Test coverage: ${coverage}% (${
          sourceFiles.length - untested.length
        }/${sourceFiles.length} files)`
      );

      if (untested.length > 0 && Number(coverage) < config.coverage.threshold) {
        consola.warn(
          `⚠️  Coverage below threshold (${config.coverage.threshold}%)`
        );
        consola.info(`\n🎯 Files missing tests (${untested.length}):`);
        untested.slice(0, 10).forEach((file) => {
          consola.info(`  - ${file}`);
        });
        if (untested.length > 10) {
          consola.info(`  ... and ${untested.length - 10} more`);
        }
        consola.info(`\n💡 To generate tests for missing files, run:`);
        consola.info(`   testgenie gen <file>`);
      }

      if (verbose) {
        if (sourceFiles.length > 0) {
          consola.info("\n📋 Source files:");
          sourceFiles.slice(0, 10).forEach((file) => {
            consola.info(`  - ${file}`);
          });
          if (sourceFiles.length > 10) {
            consola.info(`  ... and ${sourceFiles.length - 10} more`);
          }
        }

        if (testFiles.length > 0) {
          consola.info("\n🧪 Test files:");
          testFiles.slice(0, 5).forEach((file) => {
            consola.info(`  - ${file}`);
          });
          if (testFiles.length > 5) {
            consola.info(`  ... and ${testFiles.length - 5} more`);
          }
        }
      }
    } catch (error) {
      consola.error("❌ Error scanning files:", error);
    }
  },
};

async function saveResults(results: any, outputFile: string, format: string) {
  const { writeFile, ensureDir } = await import("fs-extra");
  const { dirname } = await import("path");

  await ensureDir(dirname(outputFile));

  let content: string;

  switch (format) {
    case "json":
      content = JSON.stringify(results, null, 2);
      break;
    case "csv":
      content = convertToCSV(results);
      break;
    case "text":
    default:
      content = convertToText(results);
      break;
  }

  await writeFile(outputFile, content, "utf8");
}

function convertToCSV(results: any): string {
  if (results.type === "scan") {
    const headers = ["File", "Type", "HasTest"];
    const rows = [headers.join(",")];

    results.sourceFiles.forEach((file: string) => {
      const hasTest = !results.untestedFiles.includes(file);
      rows.push(`"${file}","source","${hasTest}"`);
    });

    results.testFiles.forEach((file: string) => {
      rows.push(`"${file}","test","true"`);
    });

    return rows.join("\n");
  }

  return JSON.stringify(results, null, 2);
}

function convertToText(results: any): string {
  const lines = [];
  lines.push(`TestGenie Scan Results`);
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`Path: ${results.path || "."}`);
  lines.push("");

  if (results.type === "scan") {
    lines.push(`Summary:`);
    lines.push(`  Total source files: ${results.summary.totalSourceFiles}`);
    lines.push(`  Total test files: ${results.summary.totalTestFiles}`);
    lines.push(`  Coverage: ${results.summary.coverage}%`);
    lines.push(`  Untested files: ${results.summary.untestedFiles}`);
    lines.push("");

    if (results.untestedFiles.length > 0) {
      lines.push(`Files without tests:`);
      results.untestedFiles.forEach((file: string) => {
        lines.push(`  - ${file}`);
      });
    }
  } else if (results.type === "git-analysis") {
    lines.push(`Git Analysis:`);
    lines.push(`  Branch: ${results.branch}`);
    lines.push(`  Total files changed: ${results.summary.totalFiles}`);
    lines.push(`  Code files changed: ${results.summary.codeFiles}`);
    lines.push("");

    if (results.changes.length > 0) {
      lines.push(`Changed files:`);
      results.changes.forEach((change: any) => {
        lines.push(`  ${change.status}: ${change.file}`);
      });
    }
  }

  return lines.join("\n");
}

function isExcludedFile(filePath: string, excludePatterns: string[]): boolean {
  return excludePatterns.some((pattern) => {
    if (pattern.includes("**")) {
      const regex = pattern.replace(/\*\*/g, ".*").replace(/\*/g, "[^/]*");
      return new RegExp(regex).test(filePath);
    }
    return filePath.includes(pattern.replace(/\*/g, ""));
  });
}
