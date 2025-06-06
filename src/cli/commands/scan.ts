import type { Argv } from "yargs";
import { consola } from "consola";

export function registerScanCommand(cli: Argv) {
  cli.command(
    "scan [path]",
    "Scan codebase or git changes for test generation",
    (yargs) => {
      return yargs
        .positional("path", {
          describe: "Path to scan (defaults to current directory)",
          type: "string",
          default: ".",
        })
        .option("diff", {
          alias: "d",
          describe: "Scan git diff instead of all files",
          type: "boolean",
          default: false,
        })
        .option("since", {
          describe: 'Scan changes since specific time (e.g., "2 hours ago")',
          type: "string",
        });
    },
    async (argv) => {
      const { CodeParser } = await import("../../core/parser/index.ts");
      const { GitManager } = await import("../../core/git/index.ts");

      const parser = new CodeParser();
      const git = new GitManager(argv.path === "." ? undefined : argv.path);

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
              const codeChanges = diffInfo.changes.filter((change) =>
                isSourceFile(change.file)
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
                      consola.warn(
                        `⚠️ Could not parse ${change.file}: ${error}`
                      );
                    }
                  }
                }

                if (codeChanges.length > 3) {
                  consola.info(
                    `\n... and ${codeChanges.length - 3} more code files`
                  );
                }
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
        const { sourceFiles, testFiles } = await parser.discoverFiles(
          argv.path
        );

        consola.info(`📁 Found ${sourceFiles.length} source files`);
        consola.info(`🧪 Found ${testFiles.length} test files`);

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
      } catch (error) {
        consola.error("❌ Error scanning files:", error);
      }
    }
  );
}
