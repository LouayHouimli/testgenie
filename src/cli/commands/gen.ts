import type { Argv } from "yargs";
import { consola } from "consola";
import { loadConfig, requireInitialization } from "../../config/index.js";
import { ArgumentsCamelCase } from "yargs";
import * as yargs from "yargs";

export const genCommand: yargs.CommandModule = {
  command: "gen [file]",
  describe: "Generate tests for specified files or git changes",
  builder: (yargs: Argv) =>
    yargs
      .positional("file", {
        describe: "File to generate tests for",
        type: "string",
      })
      .option("diff", {
        alias: "d",
        describe: "Generate tests for git diff",
        type: "boolean",
        default: false,
      })
      .option("since", {
        alias: "s",
        describe: "Generate tests for changes since commit",
        type: "string",
      })
      .option("style", {
        describe: "Override test style",
        choices: ["bdd", "tdd", "minimal", "verbose"] as const,
      })
      .option("output", {
        alias: "o",
        describe: "Output directory for generated tests",
        type: "string",
      }),
  handler: async (argv: ArgumentsCamelCase<any>) => {
    requireInitialization("gen");

    const config = await loadConfig();
    const { CodeParser } = await import("../../core/parser/index.ts");
    const parser = new CodeParser();

    const style = argv.style || config.style;

    consola.info(`📋 Framework: Jest (Mocha/Vitest coming soon)`);
    consola.info(`🎨 Style: ${style}`);

    if (argv.diff || argv.since) {
      await generateTestsForGitChanges(
        { ...argv, framework: "jest", style },
        parser
      );
    } else if (argv.file) {
      await generateTestsForFile({ ...argv, framework: "jest", style }, parser);
    } else {
      consola.error(
        "❌ Please specify a file or use --diff/--since for git changes"
      );
      process.exit(1);
    }
  },
};

async function generateTestsForFile(argv: any, parser: any) {
  const { existsSync, statSync } = await import("fs-extra");
  const { isSourceFile } = await import("../../utils/index.ts");

  consola.info(`🧪 Generating tests for: ${argv.file}`);

  if (!existsSync(argv.file)) {
    consola.error(`❌ File not found: ${argv.file}`);
    process.exit(1);
  }

  const stats = statSync(argv.file);
  if (stats.isDirectory()) {
    consola.error(`❌ Cannot generate tests for a directory: ${argv.file}`);
    consola.info('💡 Use "testgenie scan" to analyze directories');
    process.exit(1);
  }

  if (!isSourceFile(argv.file)) {
    consola.error(`❌ Unsupported file type: ${argv.file}`);
    consola.info("💡 Supported files: .js, .ts, .jsx, .tsx");
    process.exit(1);
  }

  try {
    const parsedFile = await parser.parseFile(argv.file);
    await generateAndSaveTests([parsedFile], argv);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      consola.error(`❌ File not found: ${argv.file}`);
    } else if (error.code === "EISDIR") {
      consola.error(`❌ Cannot generate tests for a directory: ${argv.file}`);
      consola.info('💡 Use "testgenie scan" to analyze directories');
    } else if (error.message?.includes("Unexpected token")) {
      consola.error(`❌ Unable to parse file: ${argv.file}`);
      consola.info("💡 Check for syntax errors in the file");
    } else {
      consola.error(`❌ Error processing file: ${error.message || error}`);
    }
    process.exit(1);
  }
}

async function generateTestsForGitChanges(argv: any, parser: any) {
  const { GitManager } = await import("../../core/git/index.ts");
  const git = new GitManager();

  try {
    const isRepo = await git.isGitRepository();
    if (!isRepo) {
      consola.error("❌ Not a git repository");
      process.exit(1);
    }

    let diffInfo;
    if (argv.since) {
      consola.info(`⏰ Generating tests for changes since: ${argv.since}`);
      diffInfo = await git.getDiffSince(argv.since);
    } else {
      consola.info("📝 Generating tests for uncommitted changes");
      diffInfo = await git.getUncommittedDiff();
    }

    const { isSourceFile } = await import("../../utils/index.ts");
    const codeChanges = diffInfo.changes.filter(
      (change) => isSourceFile(change.file) && change.status !== "deleted"
    );

    if (codeChanges.length === 0) {
      consola.info("✨ No code changes found to generate tests for");
      return;
    }

    consola.info(`🎯 Found ${codeChanges.length} changed code files`);

    const parsedFiles = [];
    for (const change of codeChanges) {
      try {
        consola.info(`📄 Analyzing: ${change.file}`);
        const parsedFile = await parser.parseFile(change.file);
        if (parsedFile.functions.length > 0) {
          parsedFiles.push(parsedFile);
          consola.info(`  ⚡ Found ${parsedFile.functions.length} functions`);
        } else {
          consola.info(`  ℹ️ No functions found`);
        }
      } catch (error) {
        consola.warn(`⚠️ Could not parse ${change.file}: ${error}`);
      }
    }

    if (parsedFiles.length === 0) {
      consola.warn("⚠️ No testable functions found in changed files");
      return;
    }

    await generateAndSaveTests(parsedFiles, argv);
  } catch (error: any) {
    consola.error("❌ Git analysis failed:", error.message);
    process.exit(1);
  }
}

async function generateAndSaveTests(parsedFiles: any[], argv: any) {
  const { AITestGenerator } = await import("../../core/ai/index.ts");
  const { writeFile, ensureDir } = await import("fs-extra");
  const { getTestFilePath, checkDependencies } = await import(
    "../../utils/index.ts"
  );
  const path = require("path");
  const { loadConfig } = await import("../../config/index.js");

  const config = await loadConfig();

  const requiredDeps = ["jest", "@jest/globals"];
  if (
    parsedFiles.some(
      (f) => f.filePath.endsWith(".ts") || f.filePath.endsWith(".tsx")
    )
  ) {
    requiredDeps.push("@types/jest", "ts-jest");
  }

  consola.info("🔍 Checking required dependencies...");
  const depCheck = await checkDependencies(requiredDeps);

  if (depCheck.missing.length > 0) {
    consola.error(
      `❌ Missing required dependencies: ${depCheck.missing.join(", ")}`
    );
    consola.info(`💡 Install them with: ${depCheck.installCommand}`);
    consola.info(`🔧 Package manager detected: ${depCheck.packageManager}`);
    process.exit(1);
  }

  consola.success("✅ All required dependencies are installed");

  const aiGenerator = new AITestGenerator(config);
  const providerStatus = aiGenerator.getProviderStatus();

  if (!providerStatus.configured) {
    consola.error(`❌ AI provider (${providerStatus.provider}) not configured`);
    consola.info(`💡 ${providerStatus.message}`);
    if (providerStatus.provider !== "testgenie-api") {
      consola.info(
        "💡 Or run 'testgenie init' to switch to testgenie-api (no API key needed)"
      );
    }
    process.exit(1);
  }

  consola.info(`🤖 Using AI provider: ${providerStatus.provider}`);

  let totalTestsGenerated = 0;
  const generatedFiles = [];

  for (const parsedFile of parsedFiles) {
    if (parsedFile.functions.length === 0) {
      consola.info(`⏭️ Skipping ${parsedFile.filePath} - no functions found`);
      continue;
    }

    consola.info(`\n📁 Processing: ${parsedFile.filePath}`);
    consola.info(`⚡ Functions: ${parsedFile.functions.length}`);

    parsedFile.functions.forEach((func: any) => {
      const asyncTag = func.isAsync ? "(async)" : "";
      const exportTag = func.isExported ? "(exported)" : "";
      const lineInfo = func.startLine > 0 ? `[line ${func.startLine}]` : "";
      consola.info(
        `  🔧 ${func.name}(${func.params.join(
          ", "
        )}) ${asyncTag} ${exportTag} ${lineInfo}`
      );
    });

    consola.start(`🤖 Generating tests for ${parsedFile.filePath}...`);

    try {
      const aiResponse = await aiGenerator.generateTests({
        sourceCode: "",
        functions: parsedFile.functions,
        framework: "jest",
        style: argv.style,
        filePath: parsedFile.filePath,
      });

      const testFilePath = getTestFilePath(parsedFile.filePath, config.testDir);
      await ensureDir(path.dirname(testFilePath));
      await writeFile(testFilePath, aiResponse.testCode);

      consola.success(`✅ Generated ${aiResponse.testsGenerated} tests`);
      consola.info(`📁 Saved to: ${testFilePath}`);

      totalTestsGenerated += aiResponse.testsGenerated;
      generatedFiles.push(testFilePath);
    } catch (aiError: any) {
      consola.error(
        `❌ AI generation failed for ${parsedFile.filePath}: ${aiError.message}`
      );
    }
  }

  consola.success(`\n🎉 Generation complete!`);
  consola.info(`📊 Total tests generated: ${totalTestsGenerated}`);
  consola.info(`📁 Files created: ${generatedFiles.length}`);

  if (generatedFiles.length > 0) {
    consola.info("\n📋 Generated test files:");
    generatedFiles.forEach((file) => consola.info(`  - ${file}`));
  }
}
