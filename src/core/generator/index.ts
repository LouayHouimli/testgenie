import type { ParsedFile, GenerationOptions } from "../../types/index.js";

export class TestGenerator {
  async generateTests(
    parsedFile: ParsedFile,
    options: GenerationOptions
  ): Promise<string> {
    throw new Error("Not implemented yet");
  }

  private generateTestForFunction(
    functionData: any,
    options: GenerationOptions
  ): string {
    throw new Error("Not implemented yet");
  }

  private getTestTemplate(framework: string, style: string): string {
    throw new Error("Not implemented yet");
  }
}
