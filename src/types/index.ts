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

export interface GitFileChange {
  file: string;
  status: "added" | "modified" | "deleted" | "staged";
  staged: boolean;
  modified: boolean;
}

export interface GitDiffInfo {
  changes: GitFileChange[];
  diffText: string;
  totalFiles: number;
  codeFiles: number;
}

export interface AIGenerationRequest {
  sourceCode: string;
  functions: ParsedFunction[];
  framework: string;
  style: string;
  filePath: string;
}

export interface AIGenerationResponse {
  testCode: string;
  testsGenerated: number;
  framework: string;
}
