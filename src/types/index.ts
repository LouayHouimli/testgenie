export interface TestFramework {
  name: "jest" | "vitest" | "mocha";
  extension: string;
  imports: string[];
}

export interface TestStyle {
  name: "bdd" | "tdd" | "minimal" | "verbose";
  template: string;
}

export interface GenerationOptions {
  framework: TestFramework;
  style: TestStyle;
  outputPath?: string;
}

export interface ParsedFunction {
  name: string;
  params: string[];
  returnType?: string;
  isAsync: boolean;
  isExported: boolean;
  startLine: number;
  endLine: number;
}

export interface ParsedFile {
  filePath: string;
  functions: ParsedFunction[];
  imports: string[];
  exports: string[];
}

export interface GitChange {
  filePath: string;
  changeType: "added" | "modified" | "deleted";
  additions: number;
  deletions: number;
}
