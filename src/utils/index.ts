import { resolve, dirname } from "path";

export function resolveFilePath(filePath: string): string {
  return resolve(process.cwd(), filePath);
}

export function getTestFilePath(
  sourceFile: string,
  testDir: string = "__tests__"
): string {
  const baseName = sourceFile.replace(/\.(js|ts|jsx|tsx)$/, "");
  return `${testDir}/${baseName}.test.js`;
}

export function isTestFile(filePath: string): boolean {
  return /\.(test|spec)\.(js|ts|jsx|tsx)$/.test(filePath);
}

export function isSourceFile(filePath: string): boolean {
  return /\.(js|ts|jsx|tsx)$/.test(filePath) && !isTestFile(filePath);
}
