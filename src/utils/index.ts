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
  const baseName = fileName.replace(/\.(js|ts|jsx|tsx)$/, "");
  const dir = path.dirname(sourceFile);

  if (dir === "." || dir === "") {
    return `${testDir}/${baseName}.test.js`;
  }

  return `${testDir}/${dir}/${baseName}.test.js`;
}

export function isTestFile(filePath: string): boolean {
  return /\.(test|spec)\.(js|ts|jsx|tsx)$/.test(filePath);
}

export function isSourceFile(filePath: string): boolean {
  return /\.(js|ts|jsx|tsx)$/.test(filePath) && !isTestFile(filePath);
}
