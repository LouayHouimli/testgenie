import { resolve, dirname } from "path";

export function resolveFilePath(filePath: string): string {
  return resolve(process.cwd(), filePath);
}

export function getTestFilePath(
  sourceFile: string,
  testDir: string = "__tests__"
): string {
  const path = require("path");
  const fileName = path.basename(sourceFile);
  const extensionMatch = fileName.match(/\.(js|ts|jsx|tsx)$/);
  const extension = extensionMatch ? extensionMatch[1] : "js";
  const baseName = fileName.replace(/\.(js|ts|jsx|tsx)$/, "");
  const dir = path.dirname(sourceFile);

  if (dir === "." || dir === "") {
    return `${testDir}/${baseName}.test.${extension}`;
  }

  return `${testDir}/${dir}/${baseName}.test.${extension}`;
}

export function isTestFile(filePath: string): boolean {
  return /\.(test|spec)\.(js|ts|jsx|tsx)$/.test(filePath);
}

export function isSourceFile(filePath: string): boolean {
  return /\.(js|ts|jsx|tsx)$/.test(filePath) && !isTestFile(filePath);
}

export async function detectPackageManager(): Promise<string> {
  const fs = await import("fs-extra");

  if (await fs.pathExists("pnpm-lock.yaml")) {
    return "pnpm";
  } else if (await fs.pathExists("yarn.lock")) {
    return "yarn";
  } else if (
    (await fs.pathExists("bun.lockb")) ||
    (await fs.pathExists("bun.lock"))
  ) {
    return "bun";
  } else if (await fs.pathExists("package-lock.json")) {
    return "npm";
  }

  return "npm";
}

export async function checkDependencies(requiredDeps: string[]): Promise<{
  missing: string[];
  packageManager: string;
  installCommand: string;
}> {
  const fs = await import("fs-extra");
  const packageManager = await detectPackageManager();

  let packageJson: any = {};
  try {
    if (await fs.pathExists("package.json")) {
      packageJson = await fs.readJson("package.json");
    }
  } catch (error) {
    packageJson = {};
  }

  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  const missing = requiredDeps.filter((dep) => !allDeps[dep]);

  const installCommands = {
    npm: "npm install --save-dev",
    yarn: "yarn add --dev",
    pnpm: "pnpm add --save-dev",
    bun: "bun add --dev",
  };

  const installCommand = `${
    installCommands[packageManager as keyof typeof installCommands]
  } ${missing.join(" ")}`;

  return {
    missing,
    packageManager,
    installCommand,
  };
}
