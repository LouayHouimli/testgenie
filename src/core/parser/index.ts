import type { ParsedFile, ParsedFunction } from "../../types/index.js";

export class CodeParser {
  async parseFile(filePath: string): Promise<ParsedFile> {
    throw new Error("Not implemented yet");
  }

  private extractFunctions(content: string): ParsedFunction[] {
    throw new Error("Not implemented yet");
  }

  private extractImports(content: string): string[] {
    throw new Error("Not implemented yet");
  }

  private extractExports(content: string): string[] {
    throw new Error("Not implemented yet");
  }
}
